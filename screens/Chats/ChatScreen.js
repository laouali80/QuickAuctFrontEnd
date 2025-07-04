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
  messageTyping as sendTypingIndicator,
  setActiveChat,
  checkMessageTyping,
} from "@/state/reducers/chatsSlice";
import { useDispatch, useSelector } from "react-redux";

const ChatScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  // Redux state
  const messages = useSelector(getMessages);
  const messagesNext = useSelector(getNextPage);
  const isTyping = useSelector(checkMessageTyping);
  const connectionId = route.params.id || null;
  const friend = route.params.friend || route.params.username;

  console.log("render page: ", messagesNext);

  // WebSocket and navigation setup
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <ChatHeader friend={friend} />,
    });
  }, [navigation]);

  useEffect(() => {
    // Initial load
    if (connectionId && friend) {
      dispatch(messagesList(connectionId));
      dispatch(setActiveChat(friend.username));
    }
    return () => {
      dispatch(setActiveChat(null));
    };
  }, [friend.username, dispatch]);

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
        sendTypingIndicator(friend.username);
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
            if (item.id === -1) return 'typing-indicator';
            return item.id.toString();
          }}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          onScroll={({ nativeEvent }) => {
            // Track scroll position if needed
          }}
          renderItem={({ item, index }) => (
            <MessageBubble index={index} message={item} friend={friend} />
          )}
          ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
        />
      </View>

      {Platform.OS === "ios" ? (
        <InputAccessoryView>
          <ChatInput message={message} setMessage={onTyping} onSend={onSend} />
        </InputAccessoryView>
      ) : (
        <ChatInput message={message} setMessage={onTyping} onSend={onSend} />
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
