import p5 from 'p5';
import { RegionedTerrain, TerrainParameters } from './terrain-types';
import { generateTerrain } from './terrain-generation';
import { Move, RenderEntities, Spawn } from './entity-actions';
import { player } from './entities';
import { EntityType } from './existence-types';

export class Sketch extends p5 {
  constructor() {
    super(() => { });
  }
  dirtied: boolean = false;
  terrainParams: TerrainParameters;
  regionedTerrain: RegionedTerrain;
  drawnMap: p5.Graphics;
  canvas: p5.Renderer;
  setup(): void {
    this.canvas = this.createCanvas(1024, 1024);
    this.pixelDensity(1);
    this.noStroke();
    drawMap();
    this.updatePixels();
    Spawn(EntityType.Player, this);
  }

  updateLive: boolean = false;
  mouseClicked(): void {
    this.updateLive = !this.updateLive;
  }

  draw(): void {
    if (!this.updateLive) {
      if (this.dirtied) {
        redrawMap();
        this.dirtied = false;
      }
      return;
    }
    if (this.dirtied) {
      redrawMap();
      this.dirtied = false;
    }
    drawHoverText();
    RenderEntities(this);
    Move(player, this);
  }
}

const sketch = new Sketch();

let t: number = 0;
// let lastposx: number = 0;
// let lastposy: number = 0;
const textOffset: number = 12;
function drawHoverText() {
  // if (lastposx === sketch.mouseX &&
  //   lastposy === sketch.mouseY) {
  //   return;
  // }
  let regionString = '';
  if (sketch.mouseX >= sketch.terrainParams.width ||
    sketch.mouseY >= sketch.terrainParams.height ||
    sketch.mouseX < 0 ||
    sketch.mouseY < 0) {
    t = 0;
    return;
  }
  t = 255;
  // lastposx = sketch.mouseX;
  // lastposy = sketch.mouseY;
  const tile = sketch.regionedTerrain.rawTerrain[sketch.mouseX][sketch.mouseY];
  if (tile.occupyingEntity === undefined) {
    regionString = tile.regionType.toString();
  }
  else {
    regionString = tile.occupyingEntity.label;
  }
  sketch.stroke(0, 255);
  sketch.strokeWeight(1.4);
  sketch.fill(255, t);
  sketch.textSize(11);
  sketch.textStyle(sketch.BOLD);
  sketch.textAlign(sketch.CENTER);
  sketch.text(regionString, sketch.mouseX, sketch.mouseY - textOffset);
  sketch.dirtied = true;
}

function drawMap() {
  sketch.terrainParams = {
    height: sketch.height,
    width: sketch.width,
    seed: sketch.random(), // 200 is really nice
    frequency: 0.001, // zoom distance
    gain: 0.5,
    lacunarity: 4,
    domainWarpAmplification: 1,
    fractalOctaves: 5
  };
  sketch.regionedTerrain = generateTerrain(sketch.terrainParams, sketch);
  for (let x = 0; x < sketch.terrainParams.width; ++x) {
    for (let y = 0; y < sketch.terrainParams.height; ++y) {
      sketch.set(x, y, sketch.regionedTerrain.rawTerrain[x][y].colour)
    }
  }
  sketch.updatePixels();
  sketch.drawnMap = sketch.createGraphics(sketch.terrainParams.width, sketch.terrainParams.height);
  sketch.drawnMap.copy(sketch.canvas,
    0, 0, sketch.terrainParams.width, sketch.terrainParams.height,
    0, 0, sketch.terrainParams.width, sketch.terrainParams.height);
}

function redrawMap() {
  sketch.copy(sketch.drawnMap,
    0, 0, sketch.terrainParams.width, sketch.terrainParams.height,
    0, 0, sketch.terrainParams.width, sketch.terrainParams.height)
}
