import { StyleSheet } from "react-native";
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import { COLORS } from "@/constants/COLORS";

const SelectDrop = ({ placeholder, selectItems = [], handleSelect }) => {
  const handleValueChange = (value) => {
    if (handleSelect) {
      handleSelect(value); // Call parent function if provided
    }
    console.log("Selected Value:", value);
  };

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger
        variant="outline"
        size="md"
        style={{
          borderColor: COLORS.silverIcon,
          borderWidth: 1,
        }}
      >
        <SelectInput
          style={{
            color: COLORS.primary,
          }}
          placeholder={placeholder}
          className="text-xl font-semibold"
        />
        <SelectIcon className="mr-3" as={ChevronDownIcon} />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {Array.isArray(selectItems) &&
            selectItems.map((item) => (
              <SelectItem
                key={item.value}
                label={item.key}
                value={item.value}
              />
            ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

export default SelectDrop;

const styles = StyleSheet.create({});
