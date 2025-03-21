import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import SubmitButton from "@/auction-components/share-components/SubmitButton";
import { COLORS } from "@/constants/COLORS";
import { AntDesign } from "@expo/vector-icons";
import SelectDrop from "@/auction-components/share-components/SelectDrop";
import { Textarea, TextareaInput } from "@/components/ui/textarea";

const CreateAuctionFormScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Create an Auction",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const [selectedDuration, setSelectedDuration] = useState(null);
  const [duration, setDuration] = useState([
    {
      type: "days",
      fields: ["days", "hours", "minutes", "seconds"],
      values: ["", "", "", ""],
    },
    {
      type: "hours",
      fields: ["hours", "minutes", "seconds"],
      values: ["", "", ""],
    },
    {
      type: "minutes",
      fields: ["minutes", "seconds"],
      values: ["", ""],
    },
  ]);

  const inputRefs = useRef([]);

  const handleSelect = (value) => {
    setSelectedDuration(value);
  };

  const handleChange = (text, fieldIndex) => {
    setDuration((prev) =>
      prev.map((item) =>
        item.type === selectedDuration
          ? {
              ...item,
              values: item.values.map((val, i) =>
                i === fieldIndex ? text : val
              ),
            }
          : item
      )
    );
  };

  return (
    <ScrollView style={{ flex: 1, marginVertical: 20, marginHorizontal: 20 }}>
      <VStack space="md" className="flex-1">
        <VStack space="md">
          <Text className="text-xl font-semibold ">Add Images</Text>
          <HStack space="sm">
            <View
              className="bg-gray-800 rounded-lg"
              style={{ width: 80, height: 80 }}
            >
              <Text>test</Text>
            </View>
            <View
              className="bg-gray-800 rounded-lg"
              style={{ width: 80, height: 80 }}
            >
              <Text>test</Text>
            </View>
            <View
              className="bg-gray-800 rounded-lg"
              style={{ width: 80, height: 80 }}
            >
              <Text>test</Text>
            </View>
            <View
              className="bg-gray-800 rounded-lg"
              style={{ width: 80, height: 80 }}
            >
              <Text>test</Text>
            </View>
            <View
              className="bg-gray-800 rounded-lg"
              style={{
                width: 80,
                height: 80,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.primary,
              }}
            >
              <AntDesign name="plus" size={35} color="white" />
            </View>
          </HStack>
        </VStack>

        <VStack space="sm">
          <TextInput
            placeholder="Product Title"
            style={{
              borderColor: "black",
              color: COLORS.primary,
              borderWidth: 1,
              fontWeight: "bold",
              borderRadius: 4,
              height: 35,
            }}
          />
          <Textarea
            size="md"
            isReadOnly={false}
            isInvalid={false}
            isDisabled={false}
            className="w-64"
          >
            <TextareaInput placeholder="Your text goes here..." />
          </Textarea>
          <SelectDrop
            placeholder="Category"
            selectItems={[
              { key: "Electronics", value: "electronics" },
              { key: "Furniture", value: "furniture" },
            ]}
          />

          <TextInput
            placeholder="Starting Price"
            keyboardType="numeric"
            style={{
              borderColor: "black",
              color: COLORS.primary,
              borderWidth: 1,
              fontWeight: "bold",
              borderRadius: 4,
              height: 35,
            }}
          />
        </VStack>

        <View
          className="flex flex-col py-4  "
          style={{
            borderWidth: 4,
            borderColor: "blue",
            marginVertical: 9,
          }}
        >
          <Text className="text-xl font-semibold ">Auction Length</Text>
          <SelectDrop
            placeholder={"Duration"}
            selectItems={[
              { key: "Days", value: "days" },
              { key: "Hours", value: "hours" },
              { key: "Minutes", value: "minutes" },
            ]}
            handleSelect={handleSelect}
          />

          {selectedDuration && (
            <HStack space="xl" className="mt-8 py-6">
              {duration
                .find((item) => item.type === selectedDuration)
                ?.values.map((digit, index) => (
                  <View key={index} style={{ alignItems: "center" }}>
                    <Text className="mb-2">
                      {
                        duration.find((item) => item.type === selectedDuration)
                          ?.fields[index]
                      }
                    </Text>

                    <TextInput
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      className="rounded-lg font-semibold text-center"
                      style={{
                        borderWidth: 1,
                        borderColor: "gray",
                        borderRadius: 5,
                        width: 50,
                        height: 40,
                        textAlign: "center",
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                      value={digit}
                      onChangeText={(text) => handleChange(text, index)}
                      autoFocus={index === 0}
                    />
                  </View>
                ))}
            </HStack>
          )}
          <Text className="text-xl font-semibold ">Product Type</Text>
          <SelectDrop
            placeholder={"Type"}
            selectItems={[
              { key: "Used", value: "used" },
              { key: "New", value: "new" },
            ]}
          />
          <Text className="text-xl font-semibold">Delivery Type</Text>
          <SelectDrop
            placeholder={"Delivery"}
            selectItems={[
              { key: "Pickup", value: "pickup" },
              { key: "Delivery", value: "delivery" },
            ]}
          />
        </View>

        <View
          className="flex flex-col py-4  "
          style={{
            borderWidth: 4,
            borderColor: "red",
            marginVertical: 9,
          }}
        >
          <Text
            style={{ alignItems: "center", alignSelf: "center" }}
            className="text-xl font-semibold p-2"
          >
            Payment Methods
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 10, // Use margin if gap isn't supported
              width: "100%",
            }}
          >
            {[
              { icon: require("../assets/icons/nairaNote.svg"), label: "Cash" },
              {
                icon: require("../assets/icons/BankTransfer.svg"),
                label: "Bank Trans",
              },
              { icon: require("../assets/icons/Paypal.svg"), label: "" },
              {
                icon: require("../assets/icons/DebitCard.svg"),
                label: "Debit Card",
              },
              {
                icon: require("../assets/icons/Apple.svg"),
                label: "Apple Pay",
              },
              { icon: null, label: "Other" }, // No icon for "Other"
            ].map((item, index) => (
              <View
                key={index}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: "grey",
                  padding: 15,
                  width: 100,
                  height: 60,
                  margin: 5, // Add margin to space out items if gap isn't working
                }}
              >
                <HStack space="sm">
                  {item.icon && (
                    <Image
                      source={item.icon}
                      style={{ width: 30, height: 30 }}
                    />
                  )}
                  {item.label && (
                    <Text className="self-center">{item.label}</Text>
                  )}
                </HStack>
              </View>
            ))}
          </View>
        </View>

        <SubmitButton text="Post Auction" isDisabled={true} handleSubmit={{}} />
      </VStack>
    </ScrollView>
  );
};

export default CreateAuctionFormScreen;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#E5E7EB",
    width: 55,
    height: 55,
    borderRadius: 10,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },
});
