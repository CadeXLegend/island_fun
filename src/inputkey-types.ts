import { DirectionalNeighbours } from "./terrain-types";

export enum NumberKeys {
  zero = 48,
  one = 49,
  two = 50,
  three = 51,
  four = 52,
  five = 53,
  six = 54,
  seven = 55,
  eight = 56,
  nine = 57,
}

export enum MovementKeys {
  W = 83,
  A = 65,
  S = 87,
  D = 68
}

type DirectionToNeighboursDictionary = {
  [key in MovementKeys]: DirectionalNeighbours;
};

export const DirectionFromInputMap: DirectionToNeighboursDictionary = {
  [MovementKeys.W]: DirectionalNeighbours.Up,
  [MovementKeys.A]: DirectionalNeighbours.Left,
  [MovementKeys.S]: DirectionalNeighbours.Down,
  [MovementKeys.D]: DirectionalNeighbours.Right
}
