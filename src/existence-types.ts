import { Sketch } from "./sketch";
import { TerrainTile } from "./terrain-types";

export type Entity = {
    label: string;
    currentTile: TerrainTile | undefined;
    size: number;
    type: EntityType;
    //dirtied: boolean;
    render: (sketch: Sketch) => void;
}

export type Player = Entity & {
    actionsCooldown: number;
}

export enum EntityType {
    Player,
    Enemy
}
