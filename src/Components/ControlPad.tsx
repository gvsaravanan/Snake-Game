import React from "react";
import { View, StyleSheet, Dimensions, ViewProps } from "react-native";

import ControlButton from "./ControlButton";
import { DIRECTIONS } from "../types";
import Colors from "../colors";

const window = Dimensions.get("window");

const styles = StyleSheet.create({
  controlButton: {
    height: (window.height - window.width) / 4,
    width: (window.height - window.width) / 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: (window.height - window.width) / 8,
    backgroundColor: Colors.controlButton,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowColor: Colors.controlButtonShadow,
    shadowOpacity: 0.3,
    elevation: 20,
  },
});

interface ControlPadProps {
  handlePress: (direction: DIRECTIONS) => void;
  containerStyle: ViewProps["style"];
}

const ControlPad: React.FunctionComponent<ControlPadProps> = ({
  handlePress,
  containerStyle = {},
}) => {
  return (
    <View style={containerStyle}>
      <ControlButton
        direction={DIRECTIONS.up}
        style={styles.controlButton}
        onPress={() => {
          handlePress(DIRECTIONS.up);
        }}
      />
      <View style={{ flexDirection: "row" }}>
        <ControlButton
          direction={DIRECTIONS.left}
          style={[styles.controlButton, { marginHorizontal: 40 }]}
          onPress={() => {
            handlePress(DIRECTIONS.left);
          }}
        />
        <ControlButton
          direction={DIRECTIONS.right}
          style={[styles.controlButton, { marginHorizontal: 40 }]}
          onPress={() => {
            handlePress(DIRECTIONS.right);
          }}
        />
      </View>
      <ControlButton
        direction={DIRECTIONS.down}
        style={styles.controlButton}
        onPress={() => {
          handlePress(DIRECTIONS.down);
        }}
      />
      <View />
    </View>
  );
};

export default ControlPad;
