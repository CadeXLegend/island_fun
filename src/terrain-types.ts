import p5 from "p5";
import * as chroma from 'chroma.ts'

export type TerrainParameters = {
    height: number;
    width: number;
    seed: number;
    frequency: number;
    gain: number;
    lacunarity: number;
    domainWarpAmplification: number;
    fractalOctaves: number;
}

export type VegetationRegion = {
    regionType: VegetationRegionTypes;
    pixels: TerrainNode[];
    minimumHeight: number;
    maximumHeight: number;
    colourScale: chroma.Scale;
    colour: (normalizedNoise: number, colourScale: chroma.Scale, p5: p5) => p5.Color;
}

export enum VegetationRegionTypes {
    deeperwater ="Deeper Water", 
    shallowwater = "Shallow Water", 
    beach = "Beach", 
    inlandsand = "Inland Sand", 
    shallowgreenery = "Shallow Greenery", 
    densegreenery = "Dense Greenery", 
    grove = "Grove"
}

export type RegionedTerrain = {
    regions: VegetationRegion[];
    rawTerrain: TerrainNode[][];
}

export type TerrainNode = {
     x: number;
     y: number;
     colour: p5.Color;
     regionType: VegetationRegionTypes;
}

export type TerrainColour = {
    r: number; 
    g: number;
    b: number;
    a: number;
}
