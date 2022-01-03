import React from "react";
import { View, ViewProps } from "react-native";

import type { coordinatesType } from "../types";

interface GameBoardProps {
  numberOfRows: number;
  snakePosition: coordinatesType;
  snakeTrail: coordinatesType[];
  foodPosition: coordinatesType;
  snakeColor: string;
  foodColor: string;
  containerStyle: ViewProps["style"],
}

const GameBoard: React.FunctionComponent<GameBoardProps> = ({
  numberOfRows,
  snakePosition,
  snakeTrail,
  foodPosition,
  snakeColor,
  foodColor,
  containerStyle = {},
}) => {
  const oneDArray = new Array(numberOfRows).fill(null);

  const isSnakeOnCoordinates = (x: number, y: number) =>
    (snakePosition.x === x && snakePosition.y === y) ||
    snakeTrail.some((segment) => segment.x === x && segment.y === y);

  const isFoodOnCoordinates = (x: number, y: number) =>
    foodPosition.x === x && foodPosition.y === y;

  return (
    <View style={containerStyle}>
      {oneDArray.map((_, rowIndex) => {
        return (
          <View key={`row-${rowIndex}`} style={{ flex: 1 }}>
            {oneDArray.map((_, columnIndex) => {
              return (
                <View
                  key={`column-${columnIndex}`}
                  style={[
                    { flex: 1, borderWidth: 1, borderColor: "transparent" },
                    isSnakeOnCoordinates(rowIndex, columnIndex)
                      ? {
                          backgroundColor: snakeColor,
                          borderWidth: 1,
                          borderColor: "black",
                        }
                      : {},
                    isFoodOnCoordinates(rowIndex, columnIndex)
                      ? { backgroundColor: foodColor }
                      : {},
                  ]}
                ></View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

export default GameBoard;
