import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
// import { styled } from 'nativewind';

// const View = styled(View);
// const Text = styled(Text);
// const TextInput = styled(TextInput);
// const TouchableOpacity = styled(TouchableOpacity);

function EditModal({ visible, editedInfo, setEditedInfo, onCancel, onSave }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 w-[90%] max-w-md">
          <Text className="text-lg font-semibold mb-4">
            Edit Personal Information
          </Text>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Email</Text>
            <TextInput
              value={editedInfo.email}
              onChangeText={(text) =>
                setEditedInfo({ ...editedInfo, email: text })
              }
              keyboardType="email-address"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:border-green-500"
            />
          </View>

          {/* Phone */}
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Phone</Text>
            <TextInput
              value={editedInfo.phone}
              onChangeText={(text) =>
                setEditedInfo({ ...editedInfo, phone: text })
              }
              keyboardType="phone-pad"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:border-green-500"
            />
          </View>

          {/* Address */}
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Shipping Address</Text>
            <TextInput
              value={editedInfo.address}
              onChangeText={(text) =>
                setEditedInfo({ ...editedInfo, address: text })
              }
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="border border-gray-300 rounded-lg px-3 py-2 h-24 focus:border-green-500"
            />
          </View>

          {/* Payment Card */}
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Payment Card</Text>
            <TextInput
              value={editedInfo.paymentCard}
              onChangeText={(text) =>
                setEditedInfo({ ...editedInfo, paymentCard: text })
              }
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:border-green-500"
            />
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-end space-x-3 mt-6">
            <TouchableOpacity
              onPress={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <Text className="text-gray-600">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={onSave}
              className="px-4 py-2 bg-green-500 rounded-lg"
            >
              <Text className="text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default EditModal;
