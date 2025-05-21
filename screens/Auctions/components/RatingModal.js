import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Thumbnail from "@/common_components/Thumbnail";

const RatingModal = ({ visible, onClose, onSubmit, auction }) => {
  const [rating, setRating] = useState(0);
  //   const [feedback, setFeedback] = useState("");

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    onSubmit({ rating });
    onClose();
    setRating(0);
    // setFeedback("");
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={{ fontSize: 20 }}>×</Text>
          </Pressable>

          <Text style={styles.title}>Rate the Seller</Text>

          {/* Seller Thumbnail & Username */}
          <View style={styles.sellerInfo}>
            <Thumbnail
              url={auction.seller.thumbnail}
              width={60}
              height={60}
              borderRadius={30}
            />
            <Text style={styles.username}>{auction.seller.username}</Text>
            <Text style={styles.subtitle}>
              How was your experience with me 😊
            </Text>
          </View>

          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Pressable key={i} onPress={() => handleRating(i)}>
                <FontAwesome
                  name={i <= rating ? "star" : "star-o"}
                  size={30}
                  color="#FFD700"
                />
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default RatingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sellerInfo: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
    textAlign: "center",
  },
});
