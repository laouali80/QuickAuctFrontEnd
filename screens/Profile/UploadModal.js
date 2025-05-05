import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Heading } from "@/components/ui/heading";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";

const UploadModal = ({ show, onClose, onCameraPress, onGalleryPress }) => {
  const [showModal, setShowModal] = useState(show);
  return (
    <>
      <Modal
        // className="h-auto"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          onClose(); // Ensure parent state is updated
        }}
      >
        <ModalBackdrop />
        <ModalContent className="max-w-[305px] h-30 items-center">
          <ModalHeader>
            <Heading size="md" className="text-typography-950 mb-2 text-center">
              Profile Photo
            </Heading>
          </ModalHeader>
          <ModalBody className="w-full">
            <View className="flex flex-row justify-evenly">
              <TouchableOpacity
                className="items-center"
                onPress={() => {
                  onCameraPress();
                  onClose(); // Ensure parent state is updated
                }}
              >
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={30}
                  color={COLORS.primary}
                />
                <Text>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center"
                onPress={() => {
                  onGalleryPress();
                  onClose(); // Ensure parent state is updated
                }}
              >
                <MaterialCommunityIcons
                  name="image-outline"
                  size={30}
                  color={COLORS.primary}
                />
                <Text>Gallery</Text>
              </TouchableOpacity>
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UploadModal;

const styles = StyleSheet.create({});
