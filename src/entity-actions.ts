import { Entity, EntityType } from "./existence-types";
import { DirectionFromInputMap } from "./inputkey-types";
import { VegetationRegionTypes, VegetationRegionsMapped } from "./terrain-types";
import { Sketch } from "./sketch";
import { player } from "./entities";
import { isKey } from "./utilities";

const spawnedEntities: Entity[] = [];

export function Spawn(typeOfEntity: EntityType, sketch: Sketch) {
    if (typeOfEntity === EntityType.Player) {
        if (player.currentTile === undefined) {
            const beach = VegetationRegionsMapped[VegetationRegionTypes.beach];
            const spawnLocation = Math.round(sketch.random(0, beach.terrainTiles.length - 1));
            player.currentTile = beach.terrainTiles[spawnLocation];
            beach.terrainTiles[spawnLocation].occupyingEntity = player;
            // player.dirtied = true;
        }
        spawnedEntities.push(player);
    }
}

export function RenderEntities(sketch: Sketch) {
    for (let i = 0; i < spawnedEntities.length; ++i) {
        // if (spawnedEntities[i].dirtied) {
        // console.log('rendering dirtied entity');
        spawnedEntities[i].render(sketch);
        // }
    }
}

export function Move(entity: Entity, sketch: Sketch) {
    if (entity.type === EntityType.Player) {
        MovePlayer(entity, sketch);
    }
}

function MovePlayer(entity: Entity, sketch: Sketch) {
    if (entity.currentTile === undefined) {
        return;
    }
    if (entity.currentTile.neighbours === undefined) {
        return;
    }

    for (const [key, value] of Object.entries(DirectionFromInputMap)) {
        if (!isKey(DirectionFromInputMap, key)) {
            return;
        }

        if (sketch.keyIsDown(key)) {
            const tile = entity.currentTile.neighbours.directionalNeighbours[value];
            if (tile === undefined) {
                return;
            }
            if (tile.regionType === (VegetationRegionTypes.shallowwater || VegetationRegionTypes.deeperwater)) {
                return;
            }
            if(tile.occupyingEntity !== undefined)
            {
                return;
            }

            tile.assignEntity(entity);
        }
    }
}
