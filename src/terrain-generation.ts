import { TerrainParameters, VegetationRegion, TerrainNode, RegionedTerrain, VegetationRegionTypes } from './terrain-types';
import p5 from 'p5';
import * as chroma from 'chroma.ts'
import FastNoiseLite from 'fastnoise-lite';

export function generateTerrain(terrainParams: TerrainParameters, p5: p5): RegionedTerrain {
    let terrain: TerrainNode[][] = [];
    p5.noiseSeed(terrainParams.seed);
    //const noiseMap = generateNoiseMap(terrainParams);
    const noise = new FastNoiseLite();
    noise.SetSeed(terrainParams.seed);
    noise.SetFractalOctaves(terrainParams.fractalOctaves);
    noise.SetFractalLacunarity(terrainParams.lacunarity);
    noise.SetFrequency(terrainParams.frequency);
    noise.SetDomainWarpAmp(terrainParams.domainWarpAmplification);
    noise._RotationType3D = FastNoiseLite.RotationType3D.ImproveXYPlanes;
    noise._TransformType3D = FastNoiseLite.TransformType3D.ImproveXYPlanes;
    noise._FractalType = FastNoiseLite.FractalType.FBm;
    noise._NoiseType = FastNoiseLite.NoiseType.OpenSimplex2S;
    noise._DomainWarpType = FastNoiseLite.DomainWarpType.OpenSimplex2;

    for (let x = 0; x < terrainParams.width; ++x) {
        terrain[x] = [];
        for (let y = 0; y < terrainParams.height; ++y) {
            //p5.noiseDetail(terrainParams.noiseIterations, terrainParams.noiseInterationsFalloff);
            //const noiseValue = p5.noise(x / terrainParams.zoomDistance, y / terrainParams.zoomDistance);
            let normalizedNoise = p5.map(noise.GetNoise(x, y), -1, 1, 0, 1);
            //console.log(noiseMap[x][y], normalizedNoise);
            //const normalizedNoise = p5.map(noiseValue, -1, 1, 0, 1);
            const region = VegetationRegions.find((region) => normalizedNoise < region.maximumHeight);
            if (region === undefined) {
                console.log('failed to generate')
                return {
                    regions: VegetationRegions,
                    rawTerrain: terrain
                };
            }
            // if (normalizedNoise < lightwater.maximumHeight) {
            //     noise.SetFractalGain(terrainParams.gain - 0.05);
            //     normalizedNoise = p5.map(noise.GetNoise(x, y), -1, 1, 0, 1);
            // }
            // else{
            //     noise.SetFractalGain(terrainParams.gain);
            //     normalizedNoise = p5.map(noise.GetNoise(x, y), -1, 1, 0, 1);
            // }
            const colour = region.colour(normalizedNoise, region.colourScale, p5);
            const terrainObject = {
                x: x,
                y: y,
                colour: colour,
                regionType: region.regionType
            };
            terrain[x][y] = terrainObject;
            region.pixels.push(terrainObject);
        }
    }
    return {
        regions: VegetationRegions,
        rawTerrain: terrain
    };
}

export function generateNoiseMap(terrainParams: TerrainParameters): number[][] {
    const noise = new FastNoiseLite();
    noise.SetSeed(terrainParams.seed);
    noise.SetFractalGain(terrainParams.gain);
    noise.SetFractalOctaves(terrainParams.fractalOctaves);
    noise.SetFractalLacunarity(terrainParams.lacunarity);
    noise.SetFrequency(terrainParams.frequency);
    noise.SetDomainWarpAmp(terrainParams.domainWarpAmplification);
    noise._RotationType3D = FastNoiseLite.RotationType3D.ImproveXYPlanes;
    noise._TransformType3D = FastNoiseLite.TransformType3D.ImproveXYPlanes;
    noise._FractalType = FastNoiseLite.FractalType.FBm;
    noise._NoiseType = FastNoiseLite.NoiseType.OpenSimplex2S;
    noise._DomainWarpType = FastNoiseLite.DomainWarpType.OpenSimplex2;

    let noiseData: number[][] = [];
    for (let x = 0; x < terrainParams.width; ++x) {
        noiseData[x] = [];
        for (let y = 0; y < terrainParams.height; ++y) {
            const n = noise.GetNoise(x, y);
            //const n = noise.GetNoise(x, y, noise.GetNoise(x, y));
            noiseData[x][y] = n;
        }
    }
    return noiseData;
}

const deeperwater: VegetationRegion = {
    regionType: VegetationRegionTypes.deeperwater,
    pixels: [],
    minimumHeight: 0,
    maximumHeight: 0.42,
    colourScale: chroma.scale('00054D', '0E87CC'),
    colour: calculateColour
}
const shallowwater: VegetationRegion = {
    regionType: VegetationRegionTypes.shallowwater,
    pixels: [],
    minimumHeight: 0.42,
    maximumHeight: 0.5,
    colourScale: chroma.scale('0E87CC', '66D4B1'),
    colour: calculateColour
}
const beach: VegetationRegion = {
    regionType: VegetationRegionTypes.beach,
    pixels: [],
    minimumHeight: 0.5,
    maximumHeight: 0.55,
    colourScale: chroma.scale('E2CA76', 'FFF6D9'),
    colour: calculateColour
}
const inlandsand: VegetationRegion = {
    regionType: VegetationRegionTypes.inlandsand,
    pixels: [],
    minimumHeight: 0.55,
    maximumHeight: 0.58,
    colourScale: chroma.scale('CCBB88', 'FAE8BC'),
    colour: calculateColour
}
const shallowgreenery: VegetationRegion = {
    regionType: VegetationRegionTypes.shallowgreenery,
    pixels: [],
    minimumHeight: 0.58,
    maximumHeight: 0.66,
    colourScale: chroma.scale('ADB864', 'A9C08A', '228800'),
    colour: calculateColour
}
const densegreenery: VegetationRegion = {
    regionType: VegetationRegionTypes.densegreenery,
    pixels: [],
    minimumHeight: 0.66,
    maximumHeight: 0.7,
    colourScale: chroma.scale('74B052', '247309'),
    colour: calculateColour
}
const grove: VegetationRegion = {
    regionType: VegetationRegionTypes.grove,
    pixels: [],
    minimumHeight: 0.7,
    maximumHeight: 1,
    colourScale: chroma.scale('3E9650', '206708'),
    colour: calculateColour
}

const VegetationRegions = [deeperwater, shallowwater, beach, inlandsand, shallowgreenery, densegreenery, grove] as VegetationRegion[];

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
