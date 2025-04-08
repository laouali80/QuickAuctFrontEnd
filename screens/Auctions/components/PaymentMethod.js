import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

const PaymentMethod = ({ icon, label }) => {
  return (
    <TouchableOpacity style={styles.paymentMethod}>
      {icon && <Image source={icon} style={styles.paymentIcon} />}
      {label && <Text style={styles.paymentLabel}>{label}</Text>}
    </TouchableOpacity>
  );
};

export default PaymentMethod;

const styles = StyleSheet.create({
  paymentMethod: {
    flex: 1,
    height: 60,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  paymentIcon: {
    width: 30,
    height: 30,
    marginBottom: 4,
  },
  paymentLabel: {
    fontSize: 12,
    textAlign: "center",
  },
});
