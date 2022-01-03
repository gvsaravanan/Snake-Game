import React, { useState, useEffect, useRef, useReducer } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";

import { coordinatesType, DIRECTIONS } from "./types";

import {
  NUMBER_OF_ROWS,
  INITIAL_FOOD_POSITION,
  INITIAL_SNAKE_POSITION,
} from "./config";
import ControlPad from "./Components/ControlPad";
import GameBoard from "./Components/GameBoard";
import Colors from "./colors";

const window = Dimensions.get("window");

const getNextSnakePosition: (
  currentPosition: coordinatesType,
  direction: DIRECTIONS
) => coordinatesType = ({ x, y }, direction) => {
  switch (direction) {
    case DIRECTIONS.right:
      return { x: x === NUMBER_OF_ROWS - 1 ? 0 : x + 1, y };
    case DIRECTIONS.left:
      return { x: x === 0 ? NUMBER_OF_ROWS - 1 : x - 1, y };
    case DIRECTIONS.up:
      return { x, y: y === 0 ? NUMBER_OF_ROWS - 1 : y - 1 };
    default:
      return { x, y: y === NUMBER_OF_ROWS - 1 ? 0 : y + 1 };
  }
};

const App = () => {
  const [snakePosition, setSnakePosition] = useState<coordinatesType>(INITIAL_SNAKE_POSITION);
  const [trail, setTrail] = useState<coordinatesType[]>([]);
  const [length, setLength] = useState<number>(1);
  const [direction, setDirection] = useState<DIRECTIONS>(DIRECTIONS.right);
  const [foodPosition, setFoodPosition] = useState<coordinatesType>(INITIAL_FOOD_POSITION);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  // const [speed, setSpeed] = useState<number>(15);

  let interval: number | undefined = useRef().current;

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
  }, []);

  useEffect(() => {
    const intervalDuration = 100;

    if (gameOver) {
      clearInterval(interval);
      return;
    }

    // clear interval and change get new position as soon as direction changes
    clearInterval(interval);
    setSnakePosition((snakePosition) =>
      getNextSnakePosition(snakePosition, direction)
    );

    interval = setInterval(() => {
      setSnakePosition((snakePosition) => {
        return getNextSnakePosition(snakePosition, direction);
      });
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [direction, gameOver]);

  useEffect(() => {
    const updatedSnakeTrail = [...trail];
    while (updatedSnakeTrail.length > length - 1) {
      updatedSnakeTrail.shift();
    }
    setTrail([...updatedSnakeTrail, snakePosition]);
  }, [length, snakePosition]);

  useEffect(() => {
    if (areSamePositions(snakePosition, foodPosition)) {
      setFoodPosition({
        x: Math.floor(Math.random() * (NUMBER_OF_ROWS - 1)),
        y: Math.floor(Math.random() * (NUMBER_OF_ROWS - 1)),
      });
      setLength((length) => length + 1);
      setScore((score) => score + 1);
    }
  }, [snakePosition, foodPosition]);

  useEffect(() => {
    if (!gameOver && isSteppingOnOwnBody(snakePosition, trail.slice(0, trail.length - 2))) {
      setGameOver(true);

      Alert.alert(
        "Game Over",
        `\nScore: ${score}\n\nStart New Game ?`,
        [{ text: "OK", onPress: resetGameState }],
        { cancelable: false }
      );
    }
  }, [snakePosition, trail, gameOver]);

  const resetGameState = () => {
    setGameOver(false);
    setScore(0);
    setLength(1);
    setSnakePosition(INITIAL_SNAKE_POSITION);
    setFoodPosition(INITIAL_FOOD_POSITION);
    setTrail([]);
    setDirection(DIRECTIONS.right);
  };

  const isSteppingOnOwnBody: (
    snakePosition: coordinatesType,
    trail: coordinatesType[]
  ) => boolean = (snakePosition, trail) => {
    const snakePositionString = JSON.stringify(snakePosition);
    const snakeTrailString = JSON.stringify(trail);
    return snakeTrailString.includes(snakePositionString);
  };

  const areSamePositions: (
    a: coordinatesType,
    b: coordinatesType
  ) => boolean = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  const handleDirectionChange: (nextDirection: DIRECTIONS) => void = (
    nextDirection
  ) => {
    const blackListedNextDirection = {
      [DIRECTIONS.left]: [DIRECTIONS.right],
      [DIRECTIONS.right]: [DIRECTIONS.left],
      [DIRECTIONS.up]: [DIRECTIONS.down],
      [DIRECTIONS.down]: [DIRECTIONS.up],
    };

    setDirection((direction) => {
      if (
        nextDirection !== direction &&
        !blackListedNextDirection[nextDirection].includes(direction)
      ) {
        return nextDirection;
      }
      return direction;
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 40 }} />

      <GameBoard
        containerStyle={styles.boardContainer}
        snakePosition={snakePosition}
        snakeTrail={trail}
        foodPosition={foodPosition}
        snakeColor={Colors.snake}
        foodColor={Colors.food}
        numberOfRows={NUMBER_OF_ROWS}
      />

      <ControlPad
        handlePress={handleDirectionChange}
        containerStyle={styles.controlsContainer}
      />

      <View style={styles.scoreContainer}>
        <Text style={styles.score}>Score: {score}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.board,
  },
  boardContainer: {
    flexDirection: "row",
    height: window.width,
  },
  controlsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: Colors.controlPad,
  },
  scoreContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  score: {
    color: "white",
    fontSize: 18,
  },
});

export default App;
