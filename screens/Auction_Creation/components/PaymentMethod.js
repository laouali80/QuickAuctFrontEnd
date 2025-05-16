import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";

const PaymentMethodSelector = ({ selectedMethods, setSelectedMethods }) => {
  const paymentMethods = [
    {
      id: "cash",
      name: "Cash",
      icon: require("../../../assets/icons/nairaNote.svg"),
      // imageUrl: "https://i.ibb.co/vjQCN4y/Visa-Card.png",
      imageStyle: { width: 80, height: 50 },
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: require("../../../assets/icons/BankTransfer.svg"),
      // imageUrl: "https://i.ibb.co/vdbBkgT/mastercard.jpg",
      imageStyle: { width: 100, height: 50 },
    },
    {
      id: "PayPal",
      name: "PayPal",
      icon: require("../../../assets/icons/paypal.png"),
      // icon: require("https://i.ibb.co/vdbBkgT/mastercard.jpg"),
      // imageUrl: "https://i.ibb.co/vdbBkgT/mastercard.jpg",
      imageStyle: { width: 100, height: 50 },
    },

    {
      id: "apple_pay",
      name: "Apple Pay",
      icon: require("../../../assets/icons/Apple.svg"),
      // imageUrl: "https://i.ibb.co/KVF3mr1/paypal.png",
      imageStyle: { width: 100, height: 50 },
    },
    {
      id: "debit_card",
      name: "Debit Card",
      icon: require("../../../assets/icons/DebitCard.svg"),
      // imageUrl: "https://i.ibb.co/wQnrX86/American-Express.jpg",
      imageStyle: { width: 150, height: 50 },
    },
    {
      id: "others",
      name: "Others",
      // icon: require("../../assets/icons/nairaNote.svg"),
      // imageUrl: "https://i.ibb.co/wQnrX86/American-Express.jpg",
      // imageStyle: { width: 50, height: 50 },
    },
  ];

  const toggleMethod = (methodId) => {
    if (selectedMethods.includes(methodId)) {
      setSelectedMethods(selectedMethods.filter((id) => id !== methodId));
    } else {
      setSelectedMethods([...selectedMethods, methodId]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>
          Select a <Text style={styles.highlight}>Payment</Text> method
        </Text>
      </View>

      <View style={styles.category}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.method,
              selectedMethods.includes(method.id) && styles.selectedMethod,
            ]}
            onPress={() => toggleMethod(method.id)}
            activeOpacity={0.7}
          >
            <View style={styles.imgName}>
              {method.icon && (
                <View style={styles.imgContainer}>
                  <Image
                    source={method.icon}
                    // source={{ uri: method.imageUrl }}
                    style={[styles.image, method.imageStyle]}
                    resizeMode="contain"
                  />
                </View>
              )}
              <Text style={styles.name}>{method.name}</Text>
            </View>

            {selectedMethods.includes(method.id) && (
              <View style={styles.check}>
                <AntDesign
                  name="checkcircle"
                  size={18}
                  color={COLORS.primary}
                />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
    // maxWidth: 400,
    borderRadius: 8,
    padding: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: "white",
    alignSelf: "center",
    marginVertical: 20,
  },
  title: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 20,
    fontFamily: "Arial",
  },
  highlight: {
    color: COLORS.primary,
  },
  category: {
    marginTop: 10,
    paddingTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  method: {
    width: "30%",
    height: 145,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  selectedMethod: {
    borderColor: COLORS.primary,
  },
  imgName: {
    justifyContent: "center",
    alignItems: "center",
    // width: 100,
  },
  imgContainer: {
    // marginBottom: 30,
  },
  image: {
    marginBottom: 10,
  },
  name: {
    fontFamily: "Arial",
    // position: "absolute",
    // bottom: 20,
  },
  check: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "white",
    borderRadius: 9,
  },
});

export default PaymentMethodSelector;
