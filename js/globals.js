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
        gameWidth: 952,
        gameHeight: 672,
        xOffset: 0,
        yOffset: 96, //56,
        yOffsetHUD: 4,
    },
    gfx: {
        mapWidth: 17,
        mapHeight: 10,
        tileWidth: 56,
        tileHeight: 56,
        mapPixelWidth: 952,
        mapPixelHeight: 560,
        animSpeed: 175,

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
    // gameplay consts
    chance: {
        Move1: 1,
        Move2: 2,
        Move3: 3,
        Move4: 4,
        Jump: 5,
        Skip: 6
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
        Earth: 'earth',
        Water: 'water',
        Fire: 'fire',
        Air: 'air'
    },    
};