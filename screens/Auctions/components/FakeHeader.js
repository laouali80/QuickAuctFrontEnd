import { StyleSheet, Text, View } from "react-native";
import React from "react";

const FakeHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.titleView}>
        <Text>Test</Text>
      </View>
    </View>
  );
};

export default FakeHeader;

const styles = StyleSheet.create({
  header: {
    height: 50,
    elevation: 8,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "red",
  },
  view: {
    marginHorizontal: 16,
    alignItems: "center",
    flexDirection: "row",
  },
  titleView: {
    flex: 1,
  },
  rightView: {
    justifyContent: "flex-end",
  },
  rowView: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
});
