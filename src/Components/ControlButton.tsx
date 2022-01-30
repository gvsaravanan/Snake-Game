import React from "react";
import { DIRECTIONS } from "../types";
import {
  View,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface ControlButtonProps extends TouchableOpacityProps {
  direction: DIRECTIONS;
}

const ControlButton: React.FunctionComponent<ControlButtonProps> = ({
  direction,
  ...props
}) => {
  return (
    <TouchableOpacity {...props}>
      <View
        style={[
          {
            width: 0,
            height: 0,
            borderStyle: "solid",
            backgroundColor: "transparent",
          },
          direction === DIRECTIONS.up
            ? {
                borderLeftWidth: 10,
                borderRightWidth: 10,
                borderBottomWidth: 15,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: "rgb(173, 243, 255)",
              }
            : null,
          direction === DIRECTIONS.down
            ? {
                borderLeftWidth: 10,
                borderRightWidth: 10,
                borderTopWidth: 15,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: "rgb(173, 243, 255)",
              }
            : null,
          direction === DIRECTIONS.left
            ? {
                borderTopWidth: 10,
                borderBottomWidth: 10,
                borderRightWidth: 15,
                borderTopColor: "transparent",
                borderBottomColor: "transparent",
                borderRightColor: "rgb(173, 243, 255)",
              }
            : null,
          direction === DIRECTIONS.right
            ? {
                borderTopWidth: 10,
                borderBottomWidth: 10,
                borderLeftWidth: 15,
                borderTopColor: "transparent",
                borderBottomColor: "transparent",
                borderLeftColor: "rgb(173, 243, 255)",
              }
            : null,
        ]}
      />
    </TouchableOpacity>
  );
};

export default ControlButton;
