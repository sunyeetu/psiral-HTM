/**
 * board.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

game.BoardEntity = me.ObjectContainer.extend({
    init: function() {
        // call the constructor
        this.parent();
        // non collidable
        this.collidable = false;
        this.autoSort = false;
        // make sure our object is always draw first
        this.z = _Globals.gfx.zTile;
        // give a name
        this.name = "Board";

        this.touchRect = new me.Rect(
            new me.Vector2d(_Globals.canvas.xOffset, _Globals.canvas.yOffset), 
            _Globals.gfx.mapPixelWidth, 
            _Globals.gfx.mapPixelHeight);

        var width = game.map.width;
        var height = game.map.height;
        
        this.tileMap = [];

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var tile = null;

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
                    var t = new game.TileEntity(x, y, tile);
                    this.tileMap[x + y * width] = t;
                    this.addChild(t);
                }
            }
        }
        // me.game.sort();
        //me.game.sort.defer();       
    },

    setAlpha: function(alpha) {
        for (var i = this.tileMap.length - 1; i >= 0; i--) {
            this.tileMap[i].alpha = alpha;
        }
    },

    enableSelect: function(callback) {
        this.setAlpha(0.5);
        me.input.registerPointerEvent('mousedown', this.touchRect, this.onSelectTile.bind(this, callback));
    },

    disableSelect: function() {
        this.setAlpha(1.0);
        me.input.releasePointerEvent('mousedown', this.touchRect);
    },

    onSelectTile: function(callback, event) {
        var tileX = Math.floor((event.gameX - _Globals.canvas.xOffset) / _Globals.gfx.tileWidth);
        var tileY = Math.floor((event.gameY - _Globals.canvas.yOffset) / _Globals.gfx.tileHeight);
        var tileIdx = tileX + tileY * game.map.width;

        if (this.lastSelX) {
            var oldSelTileIdx = this.lastSelX + this.lastSelY * game.map.width;

            if (tileIdx === oldSelTileIdx) {
                // confirm selection
                this.tileMap[tileIdx].disableFade();
                this.lastSelX = null;
                callback && callback(tileX, tileY);
                return;
            } else {
                // deselect previously selected tile
                this.tileMap[oldSelTileIdx].disableFade();
                this.tileMap[oldSelTileIdx].alpha = 0.5;
            }
        }

        this.tileMap[tileIdx].enableFade();
        this.lastSelX = tileX;
        this.lastSelY = tileY;
    },

    onDestroyEvent: function() {
        // TODO:
        // cleanup
    }
});


game.TileEntity = me.AnimationSheet.extend({
    init: function(x, y, settings) {
        settings.image = 'boardtileset';
        settings.spritewidth = _Globals.gfx.tileWidth;
        settings.spriteheight = _Globals.gfx.tileHeight;
        x *= _Globals.gfx.tileWidth;
        y *= _Globals.gfx.tileHeight;
        x += _Globals.canvas.xOffset;
        y += _Globals.canvas.yOffset;
        this.parent(x, y, me.loader.getImage(settings.image), settings.spritewidth);

        this.z = _Globals.gfx.zTile;
        
        // setup animations
        //this.renderable.animationspeed = 450; // + Math.random() * 200;
        this.addAnimation('earth', [5]);
        this.addAnimation('water', [3]);
        this.addAnimation('fire', [2]);
        this.addAnimation('air', [4]);

        this.addAnimation('fountain', [0]);

        this.addAnimation('base1', [0]);
        this.addAnimation('base2', [0]);
        this.addAnimation('base3', [0]);
        this.addAnimation('base4', [0]);

        // TODO: alpha on player path
        // if (settings.name != 'earth' && settings.name != 'water') {
        //     this.renderable.alpha = 0.15;
        // }
        this.setCurrentAnimation(settings.name);
        this.animationpause = true;
        this.fadeInOut = false;
        this.fadeStep = 0.025;
    },

    enableFade: function() {
        this.fadeInOut = true;
        // this.alpha = 1.0;
        this.fadeStep = 0.025;
    },

    disableFade: function() {
        this.fadeInOut = false;
        this.alpha = 1.0;
    },

    update: function() {
        // this.parent();
        if (this.fadeInOut) {
            this.alpha -= this.fadeStep;
            if (this.alpha < 0.35) {
                this.alpha = 0.35;
                this.fadeStep = -this.fadeStep;
            } else if (this.alpha > 1.0) {
                this.alpha = 1.0;
                this.fadeStep = -this.fadeStep;
            }
        }

        return false;
    }
});