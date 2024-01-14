import { DirectionalNeighbours } from "./terrain-types";

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
