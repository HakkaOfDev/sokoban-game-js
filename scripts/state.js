"use strict";

class State {
    /**
     * @param {{x:number,y:number}} playerPosition
     * @param {{x:number,y:number} | undefined} boxPosition
     */
    constructor(playerPosition, boxPosition = undefined) {
        this.playerPosition = playerPosition;
        this.boxPosition = boxPosition;
    }

    /**
     * @private
     * @returns {{x:number, y:number}}
     */
    getPlayerPosition() {
        return this.playerPosition;
    }

    /**
     * @private
     * @returns {{x:number, y:number} | undefined}
     */
    getBoxPosition() {
        return this.boxPosition;
    }
}
