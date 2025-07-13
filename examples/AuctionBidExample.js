import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { placeBid, updateAuctionOptimistically, getAuction } from '@/state/reducers/auctionsSlice';

/**
 * Example component demonstrating auction bid functionality
 * This shows how to implement bidding with both optimistic updates and real-time updates
 */
const AuctionBidExample = ({ auctionId }) => {
  const dispatch = useDispatch();
  const auction = useSelector(getAuction(auctionId, 'all'));
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle regular bid placement
  const handleRegularBid = () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid bid amount');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Send bid through WebSocket
      placeBid({
        auction_id: auctionId,
        amount: parseFloat(bidAmount),
      });
      
      setBidAmount('');
      Alert.alert('Success', 'Bid placed successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to place bid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle optimistic bid (immediate UI update)
  const handleOptimisticBid = () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid bid amount');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create optimistic update
      const optimisticAuction = {
        ...auction,
        current_price: bidAmount,
        bids: [
          ...auction.bids,
          {
            id: Date.now(), // Temporary ID
            amount: bidAmount,
            bidder: auction.currentUser, // Assuming current user is available
            placed_at: new Date().toISOString(),
            isCurrentUser: true,
          }
        ]
      };

      // Update UI immediately
      dispatch(updateAuctionOptimistically(optimisticAuction));
      
      // Send actual bid
      placeBid({
        auction_id: auctionId,
        amount: parseFloat(bidAmount),
      });
      
      setBidAmount('');
      Alert.alert('Success', 'Bid placed successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to place bid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle quick bid (bid increment amount)
  const handleQuickBid = () => {
    const increment = parseFloat(auction.bid_increment);
    const newAmount = parseFloat(auction.current_price) + increment;
    
    setIsSubmitting(true);
    
    try {
      placeBid({
        auction_id: auctionId,
        amount: newAmount,
      });
      
      Alert.alert('Success', `Quick bid placed: ₦${newAmount}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to place quick bid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!auction) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Auction not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{auction.title}</Text>
      
      <View style={styles.priceContainer}>
        <Text style={styles.label}>Current Price:</Text>
        <Text style={styles.price}>₦{auction.current_price}</Text>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.label}>Bid Increment:</Text>
        <Text style={styles.increment}>₦{auction.bid_increment}</Text>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.label}>Time Left:</Text>
        <Text style={styles.timer}>{auction.timeLeft}</Text>
      </View>

      <View style={styles.bidSection}>
        <Text style={styles.sectionTitle}>Place a Bid</Text>
        
        <TextInput
          style={styles.input}
          value={bidAmount}
          onChangeText={setBidAmount}
          placeholder="Enter bid amount"
          keyboardType="decimal-pad"
        />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleRegularBid}
            disabled={isSubmitting || auction.has_ended}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleOptimisticBid}
            disabled={isSubmitting || auction.has_ended}
          >
            <Text style={styles.buttonText}>Optimistic Bid</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[styles.button, styles.quickButton]}
          onPress={handleQuickBid}
          disabled={isSubmitting || auction.has_ended}
        >
          <Text style={styles.buttonText}>
            Quick Bid (+₦{auction.bid_increment})
          </Text>
        </TouchableOpacity>
      </View>

      {auction.has_ended && (
        <View style={styles.endedContainer}>
          <Text style={styles.endedText}>Auction has ended</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  increment: {
    fontSize: 16,
    color: '#f97316',
  },
  timer: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '600',
  },
  bidSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#22c55e',
  },
  secondaryButton: {
    backgroundColor: '#3b82f6',
  },
  quickButton: {
    backgroundColor: '#f97316',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  endedContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    alignItems: 'center',
  },
  endedText: {
    color: '#dc2626',
    fontWeight: '600',
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AuctionBidExample; 