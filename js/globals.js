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
        width: 960,
        height: 704
    },
    gfx: {
    	mapWidth: 15,
    	mapHeight: 11,
    	tileWidth: 64,
    	tileHeight: 64,

    	baseZ: 19000,
    	zTile: 19010,
    	zActor: 19020,
        zHUD: 50000
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