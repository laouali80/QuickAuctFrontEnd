import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import SubmitButton from "@/auction-components/share-components/SubmitButton";

const CreateAuctionFormScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Create an Auction",
      headerTitleAlign: "center",
    });
  }, [navigation]);
  return (
    <VStack className="flex-1">
      <VStack>
        <Text>Add Images</Text>
        <HStack>
          <View>
            <Image />
          </View>
        </HStack>
      </VStack>

      <VStack>
        <TextInput placeholder="Macbook Pro 16" />
        <TextInput
          placeholder="Leave your review"
          className="flex-1 font-semibold h-20 p-4"
        />
        <TextInput placeholder="Category: Laptops" />
      </VStack>

      <VStack>
        <Text>Auction Length</Text>
        <TextInput placeholder="Days" />
        <Text>Product Type</Text>
        <TextInput placeholder="Used" />
        <Text>Delivery Type</Text>
        <TextInput placeholder="Pickup" />
      </VStack>

      <VStack>
        <Text style={{ alignItems: "center" }}>Payment Methods</Text>
        <HStack>
          <View>
            {/* icon */}
            <Text>Cash</Text>
          </View>
          <View>
            {/* icon */}
            <Text>Internet Transfer</Text>
          </View>
          <View>
            {/* icon */}
            <Text>USSD</Text>
          </View>
          <View>
            {/* icon */}
            <Text>Debit Card</Text>
          </View>
          <View>
            {/* icon */}
            <Text>Pay</Text>
          </View>
          <View>
            {/* icon */}
            <Text>Other</Text>
          </View>
        </HStack>
      </VStack>

      <SubmitButton text="Post Auction" isDisabled={true} handleSubmit={{}} />
    </VStack>
  );
};

export default CreateAuctionFormScreen;

const styles = StyleSheet.create({});
