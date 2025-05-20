import React from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";
// import { styled } from 'nativewind';
import { CheckCircle2 } from "lucide-react-native";

// const View = styled(View);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);

export default function SuccessModal({ visible, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 w-[85%] items-center">
          {/* Green Check Icon */}
          <CheckCircle2 size={64} className="text-green-600 mb-4" />

          {/* Title */}
          <Text className="text-xl font-bold text-black mb-2">Success !</Text>

          {/* Message */}
          <Text className="text-center text-gray-600 mb-6">
            You have successfully posted the product for auction. Now wait for
            awesome bids!
          </Text>

          {/* Button */}
          <TouchableOpacity
            onPress={onClose}
            className="bg-green-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Return To Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
