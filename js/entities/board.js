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

        // cancel selection rectangle
        this.cancelTouchRect = new me.Rect(
            new me.Vector2d(0, 0), 
            _Globals.canvas.width, 
            _Globals.canvas.yOffset - 1);
        // select tile rectangle
        this.touchRect = new me.Rect(
            new me.Vector2d(_Globals.canvas.xOffset, _Globals.canvas.yOffset), 
            _Globals.gfx.mapPixelWidth, 
            _Globals.gfx.mapPixelHeight);

        var width = game.map.width;
        var height = game.map.height;
        
        this.tileMap = [];

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var tile = new game.TileEntity(x, y, {type: game.map.getTile(x, y)});
                this.tileMap[x + y * width] = tile;
                this.addChild(tile);
            }
        }
        //me.game.sort.defer();       
    },

    changeTiles: function(type, path, callback) {
        var tx, ty;

        if (Object.prototype.toString.call(path) === '[object Array]') {
            // array of tiles
            for (var i = path.length - 1; i >= 1; i--) {
                this.tileMap[path[i].x + path[i].y * game.map.width].changeWith(type);
            }
            tx = path[0].x;
            ty = path[0].y;
        } else {
            tx = path.x;
            ty = path.y;
        }
        // single tile
        this.tileMap[tx + ty * game.map.width].changeWith(type, function() {
            callback && callback();
        });
    },

    restoreTiles: function(path, callback) {
        var tx, ty;

        //TODO: restore only unchanged tiles
        
        if (Object.prototype.toString.call(path) === '[object Array]') {
            // array of tiles
            for (var i = path.length - 1; i >= 1; i--) {
                this.tileMap[path[i].x + path[i].y * game.map.width].restore();
            }
            tx = path[0].x;
            ty = path[0].y;
        } else {
            tx = path.x;
            ty = path.y;
        }
        // single tile
        this.tileMap[tx + ty * game.map.width].restore(function() {
            callback && callback();
        });
    },

    setAlpha: function(alpha, path) {
        //if (Object.prototype.toString.call(buffs) === '[object Array]') {
        if (path) {
            for (var i = path.length - 1; i >= 0; i--) {
                this.tileMap[path[i].x + path[i].y * game.map.width].alpha = alpha;
            }
        } else {
            for (var i = this.tileMap.length - 1; i >= 0; i--) {
                this.tileMap[i].alpha = alpha;
            }
        }
    },

    clearAlpha: function() {
        this.setAlpha(1.0);
    },

    enableSelect: function(callback, cancelCallback) {
        this.setAlpha(0.5);
        me.input.registerPointerEvent('mousedown', this.touchRect, this.onSelectTile.bind(this, callback));
        me.input.registerPointerEvent('mousedown', 
            this.cancelTouchRect, this.onCancelSelectTile.bind(this, cancelCallback));
    },

    disableSelect: function() {
        this.setAlpha(1.0);
        me.input.releasePointerEvent('mousedown', this.touchRect);
        me.input.releasePointerEvent('mousedown', this.cancelTouchRect);
    },

    onSelectTile: function(callback, event) {
        var tileX = Math.floor((event.gameX - _Globals.canvas.xOffset) / _Globals.gfx.tileWidth);
        var tileY = Math.floor((event.gameY - _Globals.canvas.yOffset) / _Globals.gfx.tileHeight);
        
        // do not allow occupied tiles to be selected
        if (game.map.isTileOccupied(tileX, tileY)) {
            //XXX: perhaps use this as spell cancellation
            return;
        }
        if (game.map.isTileSelectable(tileX, tileY)) {
            return;
        }

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

    onCancelSelectTile: function(callback, event) {
        if (this.lastSelX) {
            var oldSelTileIdx = this.lastSelX + this.lastSelY * game.map.width;
            this.tileMap[oldSelTileIdx].disableFade();
            this.lastSelX = null;
        }
        callback && callback();
    },

    onDestroyEvent: function() {
        // TODO: cleanup
    }
});
/**
 * Single Tile Entity
 */
game.TileEntity = me.AnimationSheet.extend({
    init: function(x, y, settings) {
        
        settings.image = 'boardtileset';
        settings.spritewidth = _Globals.gfx.tileWidth;
        settings.spriteheight = _Globals.gfx.tileHeight;

        this.tileX = x;
        this.tileY = y;

        x *= _Globals.gfx.tileWidth;
        y *= _Globals.gfx.tileHeight;
        x += _Globals.canvas.xOffset;
        y += _Globals.canvas.yOffset;

        this.parent(x, y, me.loader.getImage(settings.image), settings.spritewidth);

        this.z = _Globals.gfx.zTile;
        
        // setup animations
        this.addAnimation('earth', [5]);
        this.addAnimation('water', [3]);
        this.addAnimation('fire', [2]);
        this.addAnimation('air', [4]);
        this.addAnimation('frozen', [6]);
        this.addAnimation('abyss', [7]);
        this.addAnimation('fountain', [0]);
        this.addAnimation('clay', [1]);
        this.addAnimation('base1', [0]);
        this.addAnimation('base2', [0]);
        this.addAnimation('base3', [0]);
        this.addAnimation('base4', [0]);

        // save original type
        this.originalType = settings.type;

        this.setCurrentAnimation(this.getNameFromType(settings.type));
        this.animationpause = true;
        this.fadeInOut = false;
        this.fadeStep = 0.025;
        this.fadeInCallback = null;
        this.fadeOutCallback = null;
    },

    getNameFromType: function(type) {
        switch(type) {
            case  game.map.Tiles.Earth: return 'earth';
            case  game.map.Tiles.Water: return 'water';
            case  game.map.Tiles.Fire: return 'fire';
            case  game.map.Tiles.Air: return 'air';
            case  game.map.Tiles.Fountain: return 'fountain';
            case  game.map.Tiles.Clay: return 'clay';
            case  game.map.Tiles.Base1: return 'base1';
            case  game.map.Tiles.Base2: return 'base2';
            case  game.map.Tiles.Base3: return 'base3';
            case  game.map.Tiles.Base4: return 'base4';
            case  game.map.Tiles.Abyss: return 'abyss';
            case  game.map.Tiles.Frozen: return 'frozen';
        }
        throw "Board: unknown tile type " + type;
    },

    restore: function(callback) {
        this.changeWith(this.originalType, function() {
            // notify when transition is completed
            callback && callback();            
        })
    },

    changeWith: function(type, callback) {
        this.enableFade(function(self) {
            self.setCurrentAnimation(self.getNameFromType(type));
        }, 
        function(self) {
            self.disableFade();
            // notify when transition is completed
            callback && callback();
        });
    },

    enableFade: function(fadeOutCallback, fadeInCallback) {
        this.fadeInOut = true;
        // this.alpha = 1.0;
        this.fadeStep = 0.025;

        // XXX: This can get ugly if called simultaneously from different places!!
        this.fadeOutCallback = fadeOutCallback;
        this.fadeInCallback = fadeInCallback;
    },

    disableFade: function() {
        this.fadeInOut = false;
        this.alpha = 1.0;
    },

    update: function() {
        // this.parent();
        if (this.fadeInOut) {
            this.alpha -= this.fadeStep * me.timer.tick;
            if (this.alpha < 0.35) {
                this.alpha = 0.35;
                this.fadeStep = -this.fadeStep;
                this.fadeOutCallback && this.fadeOutCallback(this);
            } else if (this.alpha > 1.0) {
                this.alpha = 1.0;
                this.fadeStep = -this.fadeStep;
                this.fadeInCallback && this.fadeInCallback(this);
            }
        }

        return false;
    }
});