import { EntityType, Player } from "./existence-types";
import { Sketch } from "./sketch";

export const player: Player = {
    label: "You",
    currentTile: undefined,
    size: 5,
    type: EntityType.Player,
    actionsCooldown: 1,
    // dirtied: false,
    render: (sketch: Sketch) => {
        if(player.currentTile === undefined)
        {
            return;
        }
        sketch.strokeWeight(0);
        sketch.fill(215, 18, 18, 255);
        sketch.circle(player.currentTile.x, player.currentTile.y, player.size);
        sketch.dirtied = true;
        // player.dirtied = false;
    }
};
