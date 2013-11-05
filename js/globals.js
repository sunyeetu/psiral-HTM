/**
 * globals.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

var _Globals = {
    canvas: {
        width: 1024,
        height: 672,
        xOffset: 0,
        yOffset: 56
    },
    gfx: {
        mapWidth: 17,
        mapHeight: 10,
        tileWidth: 56,
        tileHeight: 56,
        animSpeed: 75,

        baseZ: 19000,
        zTile: 19010,
        zTileAnimation: 19015,
        zActor: 19020,
        zAnimation: 19030,
        zHUD: 50000
    },
    directions: {
        None: 0,
        Up: 1,
        Down: 2,
        Left: 3,
        Right: 4
    },    
    /**
     * Gameplay defaults
     */
    defaults: {
        mana: 10,
        manaMax: 10
    },
    spells: {
        Abyss: 10,
        Change: 20,
        Clay: 30,
        Blind: 40,
        Freeze: 50,
        Teleport: 60,
        Path: 70
    },
    wizards: {
        Earth: 1,
        Water: 2,
        Fire: 3,
        Air: 4
    },    
};