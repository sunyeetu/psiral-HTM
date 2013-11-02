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

        var idx;
        var tile = null;
        var width = game.map.width;
        var height = game.map.height;
        console.log(game.map.Tiles);

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                tile = null;
                if (game.map.isTile(x, y, game.map.Tiles.Earth)) {
                    tile = new game.TileEntity(x, y, {name: 'earth'});

                } else if (game.map.isTile(x, y, game.map.Tiles.Water)) {
                    tile = new game.TileEntity(x, y, {name: 'water'});

                } else if (game.map.isTile(x, y, game.map.Tiles.Fire)) {
                    tile = new game.TileEntity(x, y, {name: 'fire'});

                } else if (game.map.isTile(x, y, game.map.Tiles.Air)) {
                    tile = new game.TileEntity(x, y, {name: 'air'});

                }

                if (tile != null) {
                    me.game.add(tile, 19000);
                }
            }
        }        

    },

    update: function() {
        return false;
    },

});