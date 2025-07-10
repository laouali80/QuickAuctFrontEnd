import { COLORS } from "@/constants/COLORS";
import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

const DeleteModal = ({ visible, onClose, onSubmit }) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Close button */}
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>

          {/* Title */}
          <Text style={styles.title}>Delete Auction!</Text>

          {/* Info Text */}
          <Text style={styles.subtitle}>
            Do you really want to delete this auction? This action cannot be
            undone.
          </Text>

          {/* Submit */}
          <Pressable style={styles.submitBtn} onPress={onSubmit}>
            <Text style={styles.submitText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    alignItems: "center",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 14,
    zIndex: 10,
  },
  closeText: {
    fontSize: 26,
    fontWeight: "600",
    color: "#555",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  submitBtn: {
    backgroundColor: COLORS.red,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
