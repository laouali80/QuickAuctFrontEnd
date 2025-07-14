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
import AuctionReplyPreview from "./components/AuctionReplyPreview";

const ChatScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  // const { sellerId, auction } = route.params || {};
  // console.log('auction: ', auction);
  const auction = {
    "id": "cc0bc3ab-2c74-464f-980b-bc256a3f6c8f",
    "title": "fddff",
    "description": "dvccvcv",
    "starting_price": "4545.00",
    "current_price": "4845.00",
    "bid_increment": "100.00",
    "status": "ongoing",
    "seller": {
        "userId": "44ae33d2-eb9a-4040-bf03-cbd857db36e2",
        "first_name": "work",
        "last_name": "work",
        "name": "Work Work",
        "username": "work",
        "email": "work@gmail.com",
        "phone_number": "0988843",
        "thumbnail": "/media/thumbnails/08b4616f18113147.jpg",
        "latest_location": "Yola, Adamawa",
        "address": null
    },
    "winner": null,
    "category": {
        "key": 6,
        "value": "Fashion"
    },
    "watchers": [],
    "start_time": "2025-07-11T16:52:59.204000+01:00",
    "end_time": "2025-07-14T16:52:59.204000+01:00",
    "created_at": "2025-07-11T16:52:59.205000+01:00",
    "updated_at": "2025-07-12T18:58:14.688311+01:00",
    "shipping_details": "Delivery",
    "payment_methods": [
        "Apple Pay",
        "Debit Card"
    ],
    "item_condition": "used",
    "images": [
        {
            "id": 65,
            "image": "/media/auction_images/2ddf6bd0cd108be3.jpg",
            "image_url": "/media/auction_images/2ddf6bd0cd108be3.jpg",
            "is_primary": true,
            "uploaded_at": "2025-07-11T16:52:59.208997+01:00"
        }
    ],
    "bids": [
        {
            "id": 13,
            "auction": "cc0bc3ab-2c74-464f-980b-bc256a3f6c8f",
            "bidder": {
                "userId": "7ec59e2b-045c-40d6-b7ea-36cf0479d7c2",
                "first_name": "quick",
                "last_name": "quick",
                "name": "Quick Quick",
                "username": "quick",
                "email": "quick@gmail.com",
                "phone_number": "098",
                "thumbnail": "/media/thumbnails/8f9e820f35bd5ae3.jpg",
                "latest_location": "Yola, Adamawa",
                "address": null
            },
            "amount": "4845.00",
            "placed_at": "2025-07-12T18:58:14.687331+01:00",
            "is_winner": false,
            "is_highest_bid": true,
            "isCurrentUser": false,
            "status": "winning"
        },
        {
            "id": 11,
            "auction": "cc0bc3ab-2c74-464f-980b-bc256a3f6c8f",
            "bidder": {
                "userId": "f15d1694-0c16-4b8e-b8de-05e36d517800",
                "first_name": "test",
                "last_name": "test",
                "name": "Test Test",
                "username": "test",
                "email": "test@gmail.com",
                "phone_number": "098",
                "thumbnail": "/media/thumbnails/10f4d8ff7ad72340.jpg",
                "latest_location": "Yola, Adamawa",
                "address": null
            },
            "amount": "4745.00",
            "placed_at": "2025-07-12T18:22:11.526462+01:00",
            "is_winner": false,
            "is_highest_bid": false,
            "isCurrentUser": true,
            "status": "outbid"
        }
    ],
    "highest_bid": {
        "id": 13,
        "auction": "cc0bc3ab-2c74-464f-980b-bc256a3f6c8f",
        "bidder": {
            "userId": "7ec59e2b-045c-40d6-b7ea-36cf0479d7c2",
            "first_name": "quick",
            "last_name": "quick",
            "name": "Quick Quick",
            "username": "quick",
            "email": "quick@gmail.com",
            "phone_number": "098",
            "thumbnail": "/media/thumbnails/8f9e820f35bd5ae3.jpg",
            "latest_location": "Yola, Adamawa",
            "address": null
        },
        "amount": "4845.00",
        "placed_at": "2025-07-12T18:58:14.687331+01:00",
        "is_winner": false,
        "is_highest_bid": true,
        "isCurrentUser": false,
        "status": "winning"
    },
    "duration": "3 days",
    "is_active": true,
    "has_ended": false,
    "user_bid": {
        "id": 11,
        "auction": "cc0bc3ab-2c74-464f-980b-bc256a3f6c8f",
        "bidder": {
            "userId": "f15d1694-0c16-4b8e-b8de-05e36d517800",
            "first_name": "test",
            "last_name": "test",
            "name": "Test Test",
            "username": "test",
            "email": "test@gmail.com",
            "phone_number": "098",
            "thumbnail": "/media/thumbnails/10f4d8ff7ad72340.jpg",
            "latest_location": "Yola, Adamawa",
            "address": null
        },
        "amount": "4745.00",
        "placed_at": "2025-07-12T18:22:11.526462+01:00",
        "is_winner": false,
        "is_highest_bid": false,
        "isCurrentUser": false,
        "status": "outbid"
    },
    "timeLeft": "7:4:3s",
    "lastUpdated": 1752482935478
}


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

      {Platform.OS === 'ios' ? (
  <>
    {auction && (
      <AuctionReplyPreview
        auction={auction}
        onViewAuction={() =>
          navigation.navigate('AuctionScreen', { id: auction.id })
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
          navigation.navigate('AuctionScreen', { id: auction.id })
        }
        onClose={() => {
          // logic to remove auction preview, e.g. setAuction(null)
        }}
      />
    )}
    <ChatInput
      message={message}
      setMessage={onTyping}
      onSend={onSend}
    />
  </>
)}

    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
