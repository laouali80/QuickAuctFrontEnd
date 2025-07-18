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
} from "@/state/reducers/chatsSlice";
import { useDispatch, useSelector } from "react-redux";
import AuctionReplyPreview from "./components/AuctionReplyPreview";

const ChatScreen = ({ navigation, route }) => {
  const params = route.params || {};

  // If coming from ChatsScreen (connection object)
  const connectionId = params.connectionId || null;
  const friend = params.friend || null;

  // If coming from AuctionScreen (auction object)
  const auction = params.auction || null;
  const seller = auction?.seller || null;

  // Decide which to use
  let chatConnectionId = connectionId;
  let chatFriend = friend;

  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  // const { sellerId, auction } = route.params || {};

  // Redux state
  const messages = connectionId
    ? useSelector(getChatMessages(connectionId))
    : [];
  const messagesNext = useSelector(getNextPage);
  const isTyping = useSelector(checkMessageTyping);

  // console.log("render page: ", messagesNext);
  // console.log("activeuSER: ", activeuSER);

  // WebSocket and navigation setup
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <ChatHeader friend={friend} />,
    });
  }, [navigation]);

  useEffect(() => {
    // Initial load
    if (connectionId && friend) {
      // Navigated from ChatsScreen

      if (messages.length === 0) {
        dispatch(fetchChats({ connectionId: connectionId, page: 1 }));
      }
      // dispatch(setActiveChat(friend.username));
      dispatch(setActiveChat(connectionId));
    }
    // else if (seller) {
    //   // Navigated from AuctionScreen
    //   const hadConnection = findConnectionBySeller(seller.userId);
    //   if (hadConnection) {
    //     messages = getChatMessages(hadConnection.connectionId);

    //     if (messages.length === 0) {
    //       const response = FetchMessagesList({connectionId:hadConnection.connectionId,page:1});

    //       const messages = response.data

    //     }
    //   }
    // }

    return () => {
      dispatch(setActiveChat(null));
    };
  }, [connectionId, seller, dispatch]);

  // Reset loading state when messages change
  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, [messagesNext]);

  // Improved send message handler
  const onSend = () => {
    const cleaned = message.replace(/\s+/g, " ").trim();
    if (cleaned.length === 0) return;

    messageSend({ connectionId, content: cleaned });
    setMessage("");

    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  };

  const delay = null;

  // Improved typing handler with proper debouncing
  const typingTimeoutRef = useRef(null);
  const onTyping = (value) => {
    setMessage(value);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Only send typing indicator if there's content
    if (value.trim().length > 0) {
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator({ username: friend.username, connectionId });
      }, 500);
    }
  };

  // Improved pagination handler
  const handleLoadMore = useCallback(() => {
    // Only load more if we're not already loading, have a next page, and typing indicator is not active
    if (!isLoading && messagesNext && messagesNext !== null && !isTyping) {
      console.log("Loading more messages, page:", messagesNext);
      setIsLoading(true);
      dispatch(messagesList(connectionId, messagesNext));
    }
  }, [messagesNext, isLoading, dispatch, connectionId, isTyping]);

  // console.log("ChatScreen messages: ", messages);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, marginBottom: Platform.OS === "ios" ? 60 : 0 }}>
        <FlatList
          ref={flatListRef}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{ paddingTop: 30 }}
          data={[{ id: -1 }, ...messages]}
          inverted={true}
          keyExtractor={(item) => {
            if (item.id === -1) return "typing-indicator";
            return item.id.toString();
          }}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          onScroll={({ nativeEvent }) => {
            // Track scroll position if needed
          }}
          renderItem={({ item, index }) => {
            const fullList = [{ id: -1 }, ...messages];
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
                friend={friend}
                connectionId={connectionId}
              />
            );
          }}
          ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
        />
      </View>

      {Platform.OS === "ios" ? (
        <>
          {auction && (
            <AuctionReplyPreview
              auction={auction}
              onViewAuction={() =>
                navigation.navigate("AuctionScreen", { id: auction.id })
              }
              onClose={() => {
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
          {auction && (
            <AuctionReplyPreview
              auction={auction}
              onViewAuction={() =>
                navigation.navigate("AuctionScreen", { id: auction.id })
              }
              onClose={() => {
                // logic to remove auction preview, e.g. setAuction(null)
              }}
            />
          )}
          <ChatInput message={message} setMessage={onTyping} onSend={onSend} />
        </>
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
