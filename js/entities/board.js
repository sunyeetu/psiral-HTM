/**
 * board.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

game.BoardEntity = me.ObjectEntity.extend({

    init: function(x, y, settings) {
        this.parent(0, 0, {});

        var width = game.map.width;
        var height = game.map.height;
        var tile = null;

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                tile = null;

                if (game.map.isTile(x, y, game.map.Tiles.Earth)) {
                    tile = {name: 'earth'};
                } else if (game.map.isTile(x, y, game.map.Tiles.Water)) {
                    tile = {name: 'water'};
                } else if (game.map.isTile(x, y, game.map.Tiles.Fire)) {
                    tile = {name: 'fire'};
                } else if (game.map.isTile(x, y, game.map.Tiles.Air)) {
                    tile = {name: 'air'};
                } else if (game.map.isTile(x, y, game.map.Tiles.Fountain)) {
                    tile = {name: 'fountain'};                    
                } else if (game.map.isTile(x, y, game.map.Tiles.Base1)) {
                    tile = {name: 'base1'};
                } else if (game.map.isTile(x, y, game.map.Tiles.Base2)) {
                    tile = {name: 'base2'};
                } else if (game.map.isTile(x, y, game.map.Tiles.Base3)) {
                    tile = {name: 'base3'};
                } else if (game.map.isTile(x, y, game.map.Tiles.Base4)) {
                    tile = {name: 'base4'};
                }
                // add for drawing
                if (tile != null) {
                    me.game.world.addChild(new game.TileEntity(x, y, tile));
                }
            }
        }        

    },

    update: function() {
        return false;
    },

    onDestroyEvent: function() {
        // TODO:
        // cleanup
    }

});