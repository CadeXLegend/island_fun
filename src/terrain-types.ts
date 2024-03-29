import p5 from "p5";
import * as chroma from 'chroma.ts'
import { Entity } from "./existence-types";
import { Voronoi } from "d3-delaunay";

export type TerrainParameters = {
    height: number;
    width: number;
    seed: number;
    frequency: number;
    gain: number;
    lacunarity: number;
    domainWarpAmplification: number;
    fractalOctaves: number;
    biomeCells: number;
}

export type VegetationRegion = {
    regionType: VegetationRegionTypes;
    terrainTiles: TerrainTile[][];
    voronoiMap?: Voronoi;
    voronoiCellsAmount?: number;
    minimumHeight: number;
    maximumHeight: number;
    colourScale: chroma.Scale;
    colour: (normalizedNoise: number, colourScale: chroma.Scale, p5: p5) => p5.Color;
}

export enum VegetationRegionTypes {
    deeperwater = "Deeper Water",
    shallowwater = "Shallow Water",
    beach = "Beach",
    inlandsand = "Inland Sand",
    shallowgreenery = "Shallow Greenery",
    densegreenery = "Dense Greenery",
    grove = "Grove"
}

export type RegionedTerrain = {
    voronoiDiagram?: Voronoi;
    voronoiCellsAmount?: number;
    regionTiles: VegetationRegion[];
    rawTerrain: TerrainTile[][];
}

export type TerrainTile = {
    x: number;
    y: number;
    neighbours?: NodeNeighbours;
    colour: p5.Color;
    regionType: VegetationRegionTypes;
    occupyingEntity: Entity | undefined
    assignEntity: (entity: Entity) => void;
}

export enum DirectionalNeighbours {
    Left = "Left",
    Right = "Right",
    Up = "Up",
    Down = "Down",
    UpperLeft = "UpperLeft",
    UpperRight = "UpperRight",
    LowerLeft = "LowerLeft",
    LowerRight = "LowerRight"
}

type DirectionalNeighboursDictionary = {
    [key in DirectionalNeighbours]: TerrainTile;
};

export type NodeNeighbours = {
    directionalNeighbours: DirectionalNeighboursDictionary;
}

export type TerrainColour = {
    r: number;
    g: number;
    b: number;
    a: number;
}

export const deeperwater: VegetationRegion = {
    regionType: VegetationRegionTypes.deeperwater,
    terrainTiles: [] = [],
    minimumHeight: 0,
    maximumHeight: 0.42,
    colourScale: chroma.scale('00054D', '0E87CC'),
    colour: calculateColour
}
export const shallowwater: VegetationRegion = {
    regionType: VegetationRegionTypes.shallowwater,
    terrainTiles: [] = [],
    minimumHeight: 0.42,
    maximumHeight: 0.5,
    colourScale: chroma.scale('0E87CC', '66D4B1'),
    colour: calculateColour
}
export const beach: VegetationRegion = {
    regionType: VegetationRegionTypes.beach,
    terrainTiles: [] = [],
    minimumHeight: 0.5,
    maximumHeight: 0.55,
    colourScale: chroma.scale('E2CA76', 'FFF6D9'),
    colour: calculateColour
}
export const inlandsand: VegetationRegion = {
    regionType: VegetationRegionTypes.inlandsand,
    terrainTiles: [] = [],
    minimumHeight: 0.55,
    maximumHeight: 0.58,
    colourScale: chroma.scale('CCBB88', 'FAE8BC'),
    colour: calculateColour
}
export const shallowgreenery: VegetationRegion = {
    regionType: VegetationRegionTypes.shallowgreenery,
    terrainTiles: [] = [],
    minimumHeight: 0.58,
    maximumHeight: 0.66,
    colourScale: chroma.scale('ADB864', 'A9C08A', '228800'),
    colour: calculateColour
}
export const densegreenery: VegetationRegion = {
    regionType: VegetationRegionTypes.densegreenery,
    terrainTiles: [] = [],
    minimumHeight: 0.66,
    maximumHeight: 0.7,
    colourScale: chroma.scale('74B052', '247309'),
    colour: calculateColour
}
export const grove: VegetationRegion = {
    regionType: VegetationRegionTypes.grove,
    terrainTiles: [] = [],
    minimumHeight: 0.7,
    maximumHeight: 1,
    colourScale: chroma.scale('3E9650', '206708'),
    colour: calculateColour
}

type VegetationDictionary = {
    [key in VegetationRegionTypes]: VegetationRegion;
};
export const VegetationRegionsMapped: VegetationDictionary = {
    "Deeper Water": deeperwater,
    "Shallow Water": shallowwater,
    Beach: beach,
    "Inland Sand": inlandsand,
    "Shallow Greenery": shallowgreenery,
    "Dense Greenery": densegreenery,
    Grove: grove
}

export const VegetationRegions = [deeperwater, shallowwater, beach, inlandsand, shallowgreenery, densegreenery, grove] as VegetationRegion[];

function calculateColour(normalizedNoise: number, colourScale: chroma.Scale, p5: p5): p5.Color {
    const colors = colourScale.gamma(normalizedNoise).colors(8, "rgb");
    const mappedNoise = Math.round(
        p5.map(
            normalizedNoise,
            0, 1,
            0, colors.length - 1
        ));
    const color = colors[mappedNoise];
    return p5.color(color[0], color[1], color[2]);
}
