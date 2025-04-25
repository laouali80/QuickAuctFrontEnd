import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useRef, useState } from "react";
import SelectDrop from "@/common_components/SelectDrop";
import { HStack } from "@/components/ui/hstack";
import { COLORS } from "@/constants/COLORS";

const AuctionLength = ({
  updateStateDuration,
  duration,
  setDuration,
  selectedDuration,
  setSelectedDuration,
}) => {
  const inputRefs = useRef([]);

  const handleSelectDuration = (value) => {
    // console.log("reach");
    setSelectedDuration(value);
  };

  const handleChange = (text, fieldIndex) => {
    if (text === "") {
      setDuration((prev) =>
        prev.map((item) =>
          item.type === selectedDuration
            ? {
                ...item,
                values: item.values.map((v, i) => (i === fieldIndex ? "" : v)),
              }
            : item
        )
      );
      updateStateDuration(fieldIndex, "");
      return;
    }

    const val = parseInt(text, 10);
    if (isNaN(val) || val < 0) return;

    const limits = {
      days: [3, 23, 59, 59],
      hours: [23, 59, 59],
      minutes: [59, 59],
    };

    const maxValues = limits[selectedDuration];
    if (!maxValues || fieldIndex >= maxValues.length) return;
    if (val > maxValues[fieldIndex]) return;

    setDuration((prev) =>
      prev.map((item) =>
        item.type === selectedDuration
          ? {
              ...item,
              values: item.values.map((v, i) => (i === fieldIndex ? val : v)),
            }
          : item
      )
    );

    updateStateDuration(fieldIndex, val);
  };

  return (
    <View className="gap-y-2">
      <Text className="text-xl font-semibold ">Auction Length</Text>
      <SelectDrop
        placeholder={"Duration"}
        selectItems={[
          { value: "Days", key: "days" },
          { value: "Hours", key: "hours" },
          { value: "Minutes", key: "minutes" },
        ]}
        handleSelect={handleSelectDuration}
      />

      {selectedDuration && (
        <Text className="text-gray-500 text-sm mt-1">
          {selectedDuration === "days" &&
            "Max: 3 days, 23 hours, 59 minutes, 59 seconds"}
          {selectedDuration === "hours" &&
            "Max: 23 hours, 59 minutes, 59 seconds"}
          {selectedDuration === "minutes" && "Max: 59 minutes, 59 seconds"}
        </Text>
      )}

      {selectedDuration && (
        <HStack space="xl" className="mt-2 py-4 justify-center">
          {duration
            .find((item) => item.type === selectedDuration)
            ?.values.map((digit, index) => (
              <View
                key={index}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
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
                    borderColor: COLORS.silverIcon,
                    color: "black",
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
    </View>
  );
};

export default AuctionLength;

const styles = StyleSheet.create({});
