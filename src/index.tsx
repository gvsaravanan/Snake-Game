import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";

import RNExitApp from 'react-native-exit-app';

import { coordinatesType, DIRECTIONS } from "./types";

import {
  NUMBER_OF_ROWS,
  INITIAL_FOOD_POSITION,
  INITIAL_SNAKE_POSITION,
} from "./config";
import ControlPad from "./Components/ControlPad";
import GameBoard from "./Components/GameBoard";
import { FOOD_COLORS, Colors } from "./colors";

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
  const [foodColor, setFoodColor] = useState<string>(FOOD_COLORS[Math.floor(Math.random()*FOOD_COLORS.length)]);
  const [highScore, setHighScore] = useState<number>(0);

  let interval: number | undefined = useRef().current;
  var check = false;

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
  }, []);

  useEffect(() => {
    const intervalDuration = 100;

    if (gameOver) {
      clearInterval(interval);
      return;
    }
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
      setFoodColor(FOOD_COLORS[Math.floor(Math.random()*FOOD_COLORS.length)]);
      setFoodPosition({
        x: Math.floor(Math.random() * (NUMBER_OF_ROWS - 1)),
        y: Math.floor(Math.random() * (NUMBER_OF_ROWS - 1)),
      });
      setLength((length) => length + 1);
      setScore((score) => score + 1);
    }
  }, [snakePosition, foodPosition]);

  useEffect(() => {
    if (!gameOver && isSteppingOnOwnBody(snakePosition, trail.slice(0, trail.length - 2)) && !check && score != 0) {
      if (score > highScore) {
        setHighScore(score);
      }

      setGameOver(true);

      Alert.alert(
        "Game Over",
        `\nHigh Score: ${highScore}\nYour Score is: ${score}\n\nPlay Again?`,
        [
          { text: "Yes", onPress: resetGameState },
          { text: "No", onPress: exit }
        ],
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
    check = true;
  };

  const exit = () => {
    RNExitApp.exitApp();
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
      <View style={{ height: 20 }}>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>Score: {score}</Text>
        </View>
      </View>

      <View style={{ height: 40 }} />

      <GameBoard
        containerStyle={styles.boardContainer}
        snakePosition={snakePosition}
        snakeTrail={trail}
        foodPosition={foodPosition}
        snakeColor={Colors.snake}
        foodColor={foodColor}
        numberOfRows={NUMBER_OF_ROWS}
      />

      <ControlPad
        handlePress={handleDirectionChange}
        containerStyle={styles.controlsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: Colors.board,
  },
  boardContainer: {
    flexDirection: "row",
    height: window.width-window.width/10,
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
    top: 25,
    right: 15,
  },
  score: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
  },
});

export default App;
