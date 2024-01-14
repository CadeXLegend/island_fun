import { TerrainParameters, TerrainTile, RegionedTerrain, VegetationRegions, DirectionalNeighbours } from './terrain-types';
import p5 from 'p5';
import FastNoiseLite from 'fastnoise-lite';
import { Delaunay } from 'd3-delaunay';

export function generateTerrain(terrainParams: TerrainParameters, p5: p5): RegionedTerrain {
    let terrain: TerrainTile[][] = [];
    p5.noiseSeed(terrainParams.seed);
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
            let normalizedNoise = p5.map(noise.GetNoise(x, y), -1, 1, 0, 1);
            const region = VegetationRegions.find((region) => normalizedNoise < region.maximumHeight);
            if (region === undefined) {
                console.log('failed to generate')
                return {
                    regionTiles: VegetationRegions,
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
            const terrainObject: TerrainTile = {
                x: x,
                y: y,
                colour: colour,
                regionType: region.regionType,
                occupyingEntity: undefined,
                assignEntity: (entity) => {
                    if (entity.currentTile === undefined) {
                        return;
                    }
                    entity.currentTile.occupyingEntity = undefined;
                    entity.currentTile = terrainObject;
                    entity.currentTile.occupyingEntity = entity;
                }
            };
            terrain[x][y] = terrainObject;
            if (!region.terrainTiles[x]) {
                region.terrainTiles[x] = [];
            }
            region.terrainTiles[x].push(terrainObject);
        }
    }
    // post-gen operations
    let chosenVoronoiPoints: number[][] = [];
    for (let x = 0; x < terrainParams.width; ++x) {
        for (let y = 0; y < terrainParams.height; ++y) {
            const tile = terrain[x][y];
            tile.neighbours = {
                directionalNeighbours: {
                    [DirectionalNeighbours.Left]: terrain?.[tile.x - 1]?.[tile.y],
                    [DirectionalNeighbours.Right]: terrain?.[tile.x + 1]?.[tile.y],
                    [DirectionalNeighbours.Up]: terrain?.[tile.x]?.[tile.y + 1],
                    [DirectionalNeighbours.Down]: terrain?.[tile.x]?.[tile.y - 1],
                    [DirectionalNeighbours.UpperLeft]: terrain?.[tile.x - 1]?.[tile.y + 1],
                    [DirectionalNeighbours.UpperRight]: terrain?.[tile.x + 1]?.[tile.y + 1],
                    [DirectionalNeighbours.LowerLeft]: terrain?.[tile.x - 1]?.[tile.y - 1],
                    [DirectionalNeighbours.LowerRight]: terrain?.[tile.x + 1]?.[tile.y - 1]
                }
            }
        }
    }
    // generate voronoi for overall map
    while (chosenVoronoiPoints.length < 40) {
        const randNumber1 = Math.floor(Math.random() * terrainParams.width) + 1;
        const randNumber2 = Math.floor(Math.random() * terrainParams.height) + 1;
        if (chosenVoronoiPoints.indexOf([randNumber1, randNumber2]) === -1) {
            chosenVoronoiPoints.push([randNumber1, randNumber2]);
        }
    }
    const delaunay = Delaunay.from(chosenVoronoiPoints);
    const voronoi = delaunay.voronoi([0, 0, terrainParams.width, terrainParams.height]);
    
    for (let i = 0; i < VegetationRegions.length; ++i) {
        const regıon = VegetationRegions[i];
        const regionVoronoiMap: number[][] = [];
        while (regionVoronoiMap.length < 200) {
            const randNumber1 = Math.floor(Math.random() * regıon.terrainTiles.length) + 1;
            const randNumber2 = Math.floor(Math.random() * regıon.terrainTiles.length) + 1;
            if (regionVoronoiMap.indexOf([randNumber1, randNumber2]) === -1) {
                regionVoronoiMap.push([randNumber1, randNumber2]);
            }
        }
        const delaunay = Delaunay.from(regionVoronoiMap);
        const voronoi = delaunay.voronoi([0, 0, terrainParams.width, terrainParams.height]);
        regıon.voronoiMap = voronoi;
        regıon.voronoiCellsAmount = delaunay.points.length;
    }
    // end of generate voronoi
    // end of post-gen operations
    return {
        voronoiDiagram: voronoi,
        voronoiCellsAmount: delaunay.points.length,
        regionTiles: VegetationRegions,
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
