/**
 * globals.js
 *
 * Copyright (c) 2014 Dvubuz Games
 *
 */

var _Globals = {
    canvas: {
        width: 1024,
        height: 672,
        gameWidth: 952,
        gameHeight: 672,
        xOffset: 36,
        yOffset: 96, //56,
        xOffsetHUD: 36,
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
        zHUDStats: 19019,
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
        Numb: 3,
        Mana1: 4,
        Mana2: 5,
        Jump: 6,
    },
    spells: {
        Abyss: 10,
        Stone: 20,
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

    // DBG
    isDebug: false,

    debug: function() {
        if (this.isDebug) {
            if (arguments.length > 1) {
                console.log(arguments);
            } else {
                console.log(arguments[0]);
            }
        }
    },    
};