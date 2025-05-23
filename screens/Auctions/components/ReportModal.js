import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";

const ReportModal = ({ visible, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const handleReport = () => {
    if (!reason.trim()) return alert("Please provide a reason.");
    onSubmit({ reason, description });
    setReason("");
    setDescription("");
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.headerRow}>
            {/* Close Button Top Right */}
            <Pressable style={styles.closeButton} onPress={onClose}>
              <AntDesign name="close" size={20} color="black" />
            </Pressable>

            {/* Alert Icon Centered */}
            <MaterialIcons name="report" size={80} color={COLORS.yellow} />
          </View>

          {/* Title and Subtext */}
          <Text style={styles.title}>Report Post</Text>
          <Text style={styles.subtitle}>
            Enter the reason and brief description for reporting the post
          </Text>

          {/* Inputs */}
          <TextInput
            style={styles.input}
            placeholder="Reason for Report"
            value={reason}
            onChangeText={setReason}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Brief Description"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleReport}>
            <Text style={styles.submitText}>Report Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ReportModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 20,
  },
  modal: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  headerRow: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 15,
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitBtn: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
