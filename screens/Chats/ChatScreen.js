import {
  ActivityIndicator,
  FlatList,
  InputAccessoryView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import MessageBubble from "./components/MessageBubble";
import ChatInput from "./components/ChatInput";
import ChatHeader from "./components/ChatHeader";
import {
  getMessages,
  getNextPage,
  messageSend,
  messagesList,
  sendTypingIndicator,
  setActiveChat,
  checkMessageTyping,
  findConnectionBySeller,
  getChatMessages,
  fetchChats,
  createConnection,
  markReadMessages,
  getChatPagination,
} from "@/state/reducers/chatsSlice";
import { useDispatch, useSelector } from "react-redux";
import AuctionReplyPreview from "./components/AuctionReplyPreview";
import { getTokens } from "@/state/reducers/userSlice";
import { checkConnection } from "./calls/chatScreen/checkConnection";
import { fetchMessages } from "./calls/chatScreen/fetchMessages";
import ChatSkeleton from "./components/ChatSkeleton";

const ChatScreen = ({ navigation, route }) => {
  const params = route.params || {};

  // If coming from ChatsScreen (connection object)
  const connectionId = params.connectionId || null;
  const friend = params.friend || null;

  // If coming from AuctionScreen (auction object)
  const auction = params.auction || null;
  const seller = auction?.seller || null;

  const dispatch = useDispatch();

  // Always declare all state variables at the top level
  const [localMessages, setLocalMessages] = useState([]);
  const [localConnection, setLocalConnection] = useState(null);
  const [wereConnected, setWereConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAuctionPreview, setShowAuctionPreview] = useState(
    auction ? true : false
  );
  const activeConnectionId =
    connectionId ??
    hadConnection?.connectionId ??
    localConnection?.connectionId;

  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Always call these hooks, regardless of conditions
  const hadConnection = useSelector(
    seller ? findConnectionBySeller(seller.userId) : () => null
  );
  const messagesFromConnection = useSelector(
    connectionId ? getChatMessages(connectionId) : () => []
  );
  const messagesFromHadConnection = useSelector(
    hadConnection ? getChatMessages(hadConnection.connectionId) : () => []
  );

  //   const messages = useSelector(
  //   activeConnectionId ? getChatMessages(activeConnectionId) : () => []
  // );

  const chatPagination = useSelector(
    activeConnectionId ? getChatPagination(activeConnectionId) : () => null
  );
  const isTyping = useSelector(checkMessageTyping(activeConnectionId));
  const tokens = useSelector(getTokens);

  const conversation = useSelector((state) =>
    connectionId
      ? state.chats.conversations[connectionId]
      : hadConnection
      ? state.chats.conversations[hadConnection.connectionId]
      : false
  );
  const historyLoaded = conversation?.historyLoaded;

  // Then use logic to pick which messages to use
  const messages = connectionId
    ? messagesFromConnection
    : hadConnection
    ? messagesFromHadConnection
    : [];

  // WebSocket and navigation setup
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () =>
        friend ? (
          <ChatHeader friend={friend} />
        ) : (
          <ChatHeader friend={seller} />
        ),
    });
  }, [navigation, friend, seller]);

  // Single useEffect with all initialization logic
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (connectionId && friend) {
        // From ChatsScreen — use Redux directly
        if (!historyLoaded) {
          dispatch(fetchChats({ connectionId, page: 1 }));
        }
        dispatch(setActiveChat(connectionId));
        if (params.unreadCount > 0) {
          // Mark messages as read if there are unread messages
          markReadMessages({ connectionId });
        }
      } else if (seller) {
        // From AuctionScreen — handle local state only
        if (hadConnection && messages.length > 0) {
          if (hadConnection.unreadCount !== 0) {
            markReadMessages({ connectionId: hadConnection.connectionId });
          }
        } else if (hadConnection && messages.length === 0) {
          const data = await fetchMessages(hadConnection.connectionId, tokens);
          if (isMounted) {
            setLocalMessages(data.messages || []);
          }
        } else if (!hadConnection) {
          const data = await checkConnection(seller.userId, tokens);
          if (isMounted) {
            if (data.isConnected) {
              setLocalMessages(data.messages || []);
              setLocalConnection(data.connection || null);
              setWereConnected(true);
            } else {
              setWereConnected(false);
            }
          }
        }
      }
    };

    init();

    return () => {
      dispatch(setActiveChat(null));
      isMounted = false;
    };
  }, [
    connectionId,
    seller,
    dispatch,
    messages.length,
    hadConnection,
    tokens,
    friend,
    historyLoaded,
  ]);

  // Reset loading state when messages change
  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, [chatPagination, isLoading]);

  // Improved typing handler with proper debouncing
  const onTyping = useCallback(
    (value) => {
      setMessage(value);

      // Clear any previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      const trimmed = value.trim();

      if (trimmed.length === 0) return;

      // Resolve connectionId once
      const resolvedConnectionId =
        connectionId ||
        (hadConnection
          ? hadConnection.connectionId
          : localConnection?.connectionId);

      // Resolve username safely
      const resolvedUsername = connectionId
        ? friend?.username
        : seller?.username;

      // Safety check
      if (!resolvedConnectionId || !resolvedUsername) return;

      // Set timeout to send typing indicator after short delay
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator({
          username: resolvedUsername,
          connectionId: resolvedConnectionId,
        });
      }, 500);
    },
    [connectionId, hadConnection, localConnection, friend, seller]
  );

  // Improved pagination handler
  const handleLoadMore = useCallback(() => {
    // Prevent loading if no pagination data or no more pages
    if (!chatPagination || !chatPagination.hasNext) return;

    // Prevent loading if already loading, user is typing, or required IDs are missing
    if (isLoading || isTyping) return;

    const nextPage = chatPagination.nextPage;

    if (connectionId) {
      setIsLoading(true);
      dispatch(fetchChats({ connectionId: connectionId, page: nextPage }));
    } else if (hadConnection?.connectionId && messages.length > 0) {
      setIsLoading(true);
      dispatch(
        fetchChats({ connectionId: hadConnection.connectionId, page: nextPage })
      );
    }
  }, [
    chatPagination,
    isLoading,
    dispatch,
    connectionId,
    hadConnection,
    isTyping,
    messages,
  ]);

  // Memoize messages to render
  const messagesToRender = useMemo(() => {
    if (connectionId && messages.length > 0) return messages;
    if (hadConnection && messages.length > 0) return messages;
    return localMessages;
  }, [connectionId, hadConnection, messages, localMessages]);

  const onSend = useCallback(() => {
    const cleaned = message.replace(/\s+/g, " ").trim();
    if (cleaned.length === 0) return;

    const hasMessages = messagesToRender.length > 0;

    // 💬 Case 1: Connection from chat list
    if (connectionId) {
      // console.log("Case 1: Connection from chat list");
      messageSend({ connectionId, content: cleaned });
    }
    // 💬 Case 2: Existing connection + showing auction
    else if (showAuctionPreview && hadConnection && hasMessages) {
      // console.log("Case 2: Existing connection + showing auction");
      dispatch(
        fetchChats({ connectionId: hadConnection.connectionId, page: 1 })
      );
      messageSend({
        connectionId: hadConnection.connectionId,
        content: cleaned,
        auctionId: auction?.id,
      });
      setShowAuctionPreview(false);
    }

    // 💬 Case 3: Existing connection, no auction
    else if (!showAuctionPreview && hadConnection && hasMessages) {
      // console.log("Case 3: Existing connection, no auction");
      messageSend({
        connectionId: hadConnection.connectionId,
        content: cleaned,
      });
    }

    // 💬 Case 4: Connection exists in DB but not in Redux and send with auction
    else if (showAuctionPreview && !hadConnection && wereConnected) {
      // console.log("Case 4: (with auct) Connection exists in DB but not in Redux");
      dispatch(
        fetchChats({ connectionId: localConnection.connectionId, page: 1 })
      );
      messageSend({
        connectionId: localConnection.connectionId,
        content: cleaned,
        auctionId: auction?.id,
      });
      setShowAuctionPreview(false);
    }

    // 💬 Case 5: Connection exists in DB but not in Redux and send without auction
    else if (!showAuctionPreview && !hadConnection && wereConnected) {
      // console.log("Case 5: (without auct) Connection exists in DB but not in Redux");
      dispatch(
        fetchChats({ connectionId: localConnection.connectionId, page: 1 })
      );
      messageSend({
        connectionId: localConnection.connectionId,
        content: cleaned,
      });
    }

    // 💬 Case 6: No connection at all — create new one
    else if (!hadConnection && !wereConnected) {
      // console.log("Case 6: No connection at all — create new one");

      createConnection({
        receiver_id: seller.userId,
        content: cleaned,
        auctionId: showAuctionPreview ? auction.id : null,
      });
      setShowAuctionPreview(false);
    }

    // 💬 Case 7: Had connection, but messages are empty
    else if (hadConnection && messages.length === 0 && !showAuctionPreview) {
      // console.log(
      //   "Case 7: Had connection, but messages are empty (without auct)"
      // );
      dispatch(
        fetchChats({ connectionId: hadConnection.connectionId, page: 1 })
      );
      messageSend({
        connectionId: hadConnection.connectionId,
        content: cleaned,
      });
    }

    // 💬 Case 8: Had connection, but messages are empty and send with auct
    else if (hadConnection && messages.length === 0 && showAuctionPreview) {
      // console.log("Case 8: Had connection, but messages are empty (with auct)");
      dispatch(
        fetchChats({ connectionId: hadConnection.connectionId, page: 1 })
      );
      messageSend({
        connectionId: hadConnection.connectionId,
        content: cleaned,
        auctionId: auction?.id,
      });
      setShowAuctionPreview(false);
    }

    // 💬 Catch: Fallback (optional for safety)
    else {
      console.warn("Message send failed: unexpected state");
    }

    // Reset input
    setMessage("");

    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  }, [
    message,
    messagesToRender,
    showAuctionPreview,
    hadConnection,
    wereConnected,
    localConnection,
    auction,
    connectionId,
    messages,
    dispatch,
  ]);

  // Show skeleton if:
  // - No conversation exists yet (coming from AuctionScreen and not loaded)
  // - Or historyLoaded is not true
  const showSkeleton = !conversation || !historyLoaded;
  // console.log("messagesToRender: ",messagesToRender);

  //
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, marginBottom: Platform.OS === "ios" ? 60 : 0 }}>
        {showSkeleton ? (
          <ChatSkeleton />
        ) : (
          <FlatList
            ref={flatListRef}
            automaticallyAdjustKeyboardInsets={true}
            contentContainerStyle={{ paddingTop: 30 }}
            data={[{ id: -1 }, ...messagesToRender]}
            inverted={true}
            keyExtractor={(item) => {
              if (item.id === -1) return "typing-indicator";
              return item.id.toString();
            }}
            onEndReachedThreshold={0.5}
            onEndReached={
              handleLoadMore // your actual pagination logic
            }
            // onEndReached={() =>
            //   console.log("End reached, handleLoadMore called")
            // }
            onScroll={({ nativeEvent }) => {
              // Track scroll position if needed
            }}
            onMomentumScrollBegin={() => {
              // Reset the flag so `onEndReached` can be called again on actual scroll
              onEndReachedCalledOnce.current = false;
            }}
            renderItem={({ item, index }) => {
              const fullList = [{ id: -1 }, ...messagesToRender];
              // const isTypingIndicator = item.id === -1;

              const previousMessage =
                index < fullList.length - 1 ? fullList[index + 1] : null;
              // const nextMessage = index > 0 ? fullList[index - 1] : null;

              return (
                <MessageBubble
                  index={index}
                  message={item}
                  prevMessage={previousMessage}
                  // nextMessage={nextMessage}
                  friend={friend ? friend : seller}
                  connectionId={connectionId}
                />
              );
            }}
            ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
          />
        )}
      </View>

      {Platform.OS === "ios" ? (
        <>
          {showAuctionPreview && (
            <AuctionReplyPreview
              auction={auction}
              onViewAuction={() =>
                navigation.navigate("AuctionScreen", { id: auction.id })
              }
              onClose={() => {
                setShowAuctionPreview(false);
                // logic to remove auction preview, e.g. setAuction(null)
              }}
            />
          )}
          <InputAccessoryView>
            <ChatInput
              message={message}
              setMessage={onTyping}
              onSend={onSend}
            />
          </InputAccessoryView>
        </>
      ) : (
        <>
          {showAuctionPreview && (
            <AuctionReplyPreview
              auction={auction}
              onViewAuction={() =>
                navigation.navigate("AuctionScreen", { id: auction.id })
              }
              onClose={() => {
                setShowAuctionPreview(false);
                // logic to remove auction preview, e.g. setAuction(null)
              }}
            />
          )}
          <ChatInput
            message={message}
            setMessage={onTyping}
            onSend={onSend}
            loading={!historyLoaded}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
