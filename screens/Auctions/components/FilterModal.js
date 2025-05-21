import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import SubmitButton from "@/common_components/SubmitButton";

const FilterModal = ({ visible, onClose, onSubmit }) => {
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(10);
  const [selectedCondition, setSelectedCondition] = useState("New");
  const [popularity, setPopularity] = useState("Most Liked");
  const [bidPosting, setBidPosting] = useState("Most Recent");
  const [popDropdownOpen, setPopDropdownOpen] = useState(false);
  const [bidDropdownOpen, setBidDropdownOpen] = useState(false);

  const handleSubmit = () => {
    onSubmit({
      priceRange: [parseFloat(minPrice), parseFloat(maxPrice)],
      condition: selectedCondition,
      popularity,
      bidPosting,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter</Text>
            <Pressable onPress={onClose}>
              <AntDesign name="close" size={20} color="black" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Price Range */}
            <Text style={styles.label}>Bid Price</Text>
            <View style={styles.priceRow}>
              <View style={styles.priceInputContainer}>
                <Text style={styles.inputLabel}>Min</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={minPrice}
                  onChangeText={setMinPrice}
                  placeholder="$"
                  onBlur={() => {
                    let min = parseInt(minPrice);
                    let max = parseInt(maxPrice);
                    if (isNaN(min)) min = 0;
                    if (min >= max) min = max - 1;
                    setMinPrice(min.toString());
                  }}
                />
              </View>
              <View style={styles.priceInputContainer}>
                <Text style={styles.inputLabel}>Max</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  placeholder="$"
                  onBlur={() => {
                    let min = parseInt(minPrice);
                    let max = parseInt(maxPrice);
                    if (isNaN(max)) max = min + 1;
                    if (max <= min) max = min + 1;
                    setMaxPrice(max.toString());
                  }}
                />
              </View>
            </View>

            {/* Condition */}
            <Text style={styles.label}>Condition</Text>
            <View style={styles.buttonRow}>
              {["Used", "New", "Like New"].map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.conditionButton,
                    selectedCondition === c && styles.conditionButtonSelected,
                  ]}
                  onPress={() => setSelectedCondition(c)}
                >
                  <Text
                    style={{
                      color: selectedCondition === c ? "#32CD32" : "#000",
                    }}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Popularity */}
            <Text style={styles.label}>Popularity</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setPopDropdownOpen((prev) => !prev)}
            >
              <Text>{popularity}</Text>
              <AntDesign name="down" size={14} />
            </TouchableOpacity>
            {popDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {["Most Liked", "Most Bids"].map((option) => (
                  <Pressable
                    key={option}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setPopularity(option);
                      setPopDropdownOpen(false);
                    }}
                  >
                    <Text>{option}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Bid Posting */}
            <Text style={styles.label}>Bid posting</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setBidDropdownOpen((prev) => !prev)}
            >
              <Text>{bidPosting}</Text>
              <AntDesign name="down" size={14} />
            </TouchableOpacity>
            {bidDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {["Most Recent", "Oldest"].map((option) => (
                  <Pressable
                    key={option}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setBidPosting(option);
                      setBidDropdownOpen(false);
                    }}
                  >
                    <Text>{option}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Submit */}
          <SubmitButton
            handleSubmit={handleSubmit}
            text="Submit"
            textColor="white"
          />
          {/* <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 16,
    padding: 20,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  label: {
    marginTop: 16,
    fontWeight: "600",
    fontSize: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  priceInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    color: "black",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  conditionButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  conditionButtonSelected: {
    borderColor: "#32CD32",
    backgroundColor: "#E6F4EA",
  },
  dropdown: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 4,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  dropdownItem: {
    padding: 10,
  },
});
