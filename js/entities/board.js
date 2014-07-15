/**
 * board.js
 *
 * Copyright (c) 2014 Dvubuz Games
 *
 */

/* jshint -W030 */

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

        // current max alpha value for tiles - TODO: fix tiles alpa restore
        this.alphaMax = 1.0;

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
                var tileType = game.map.getTile(x, y);
                //TODO: remove fountain tiles beneath
                if (tileType !== 0) {
                    var tile = new game.TileEntity(x, y, {type: tileType});
                    this.tileMap[x + y * width] = tile;
                    this.addChild(tile);
                }
            }
        }
        
        // draw fountain
        var fx = 7 * _Globals.gfx.tileWidth + _Globals.canvas.xOffset;
        var fy = 4 * _Globals.gfx.tileHeight + _Globals.canvas.yOffset;
        var fountain = new me.AnimationSheet(fx, fy, me.loader.getImage('fountain'), 168);
        fountain.addAnimation('main', [0, 1, 2, 3], 450);
        fountain.setCurrentAnimation('main');
        fountain.z = _Globals.gfx.zHUD;
        this.addChild(fountain);
        
        // sort all sprites
        this.sort(); //defer();
    },

    fadeTiles: function(how, callback) {
        // all tiles
        var size = game.map.width * game.map.height;
        for (var i = size - 1; i >= 1; i--) {
            if (how === 'in') {
                this.tileMap[i].enableFadeIn();
            } else if (how === 'out') {
                this.tileMap[i].enableFadeOut();
            }
        }
        // last tile
        if (how === 'in') {
            this.tileMap[0].enableFadeIn(callback);
        } else if (how === 'out') {
            this.tileMap[0].enableFadeOut(callback);
        }      
    },

    changeTiles: function(type, path, callback) {
        var i, tx, ty;

        if (Object.prototype.toString.call(path) === '[object Array]') {
            // array of tiles
            for (i = path.length - 1; i >= 1; i--) {
                this.tileMap[path[i].x + path[i].y * game.map.width].changeWith(type);
            }
            tx = path[0].x;
            ty = path[0].y;
        } else if (typeof path === 'object') {
            tx = path.x;
            ty = path.y;
        } else if (typeof path === 'function') {
            // all tiles
            var size = game.map.width * game.map.height;
            for (i = size - 1; i >= 1; i--) {
                this.tileMap[i].changeWith(type);
            }
            tx = 0;
            ty = 0;
            // cb is 2nd parameter
            callback = path;
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
        } else if (typeof path === 'object') {
            tx = path.x;
            ty = path.y;
        }
        // single tile
        this.tileMap[tx + ty * game.map.width].restore(function() {
            callback && callback();
        });
    },

    setAlpha: function(alpha, path) {
        var i;
        //if (Object.prototype.toString.call(buffs) === '[object Array]') {
        if (path) {
            for (i = path.length - 1; i >= 0; i--) {
                this.tileMap[path[i].x + path[i].y * game.map.width].alpha = alpha;
            }
        } else {
            for (i = this.tileMap.length - 1; i >= 0; i--) {
                this.tileMap[i].alpha = alpha;
            }
        }
    },

    clearAlpha: function() {
        this.setAlpha(1.0);
    },

    enableSelect: function(wizard, spell, callback, cancelCallback) {
        this.setAlpha(0.5);
        me.input.registerPointerEvent('mousedown', this.touchRect, this.onSelectTile.bind(this, wizard, spell, callback));
        me.input.registerPointerEvent('mousedown', 
            this.cancelTouchRect, this.onCancelSelectTile.bind(this, cancelCallback));
    },

    disableSelect: function() {
        this.setAlpha(1.0);
        me.input.releasePointerEvent('mousedown', this.touchRect);
        me.input.releasePointerEvent('mousedown', this.cancelTouchRect);
    },

    onSelectTile: function(wizard, spell, callback, event) {
        var tileX = Math.floor((event.gameX - _Globals.canvas.xOffset) / _Globals.gfx.tileWidth);
        var tileY = Math.floor((event.gameY - _Globals.canvas.yOffset) / _Globals.gfx.tileHeight);
        
        // do not allow occupied tiles to be selected
        if (!game.gamemaster.isCanCastAt(wizard, spell, tileX, tileY))
            return;

        var tileIdx = tileX + tileY * game.map.width;

        if (typeof this.lastSelX !== 'undefined') {
            var oldSelTileIdx = this.lastSelX + this.lastSelY * game.map.width;

            if (tileIdx === oldSelTileIdx) {
                // confirm and cleanup selection
                this.tileMap[tileIdx].disableFade();
                this.lastSelX = undefined;
                // notify caller
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
        // this.originalType = settings.type;

        this.setCurrentAnimation(this.getNameFromType(settings.type));
        this.animationpause = true;
        this.fadeIn = false;
        this.fadeOut = false;
        this.fadeStep = 0.0095;
        this.fadeInCallback = null;
        this.fadeOutCallback = null;
    },

    getNameFromType: function(type) {
        switch(type) {
            case game.map.Tiles.Earth: return 'earth';
            case game.map.Tiles.Water: return 'water';
            case game.map.Tiles.Fire: return 'fire';
            case game.map.Tiles.Air: return 'air';
            case game.map.Tiles.Fountain: return 'fountain';
            case game.map.Tiles.Clay: return 'clay';
            case game.map.Tiles.Base1: return 'base1';
            case game.map.Tiles.Base2: return 'base2';
            case game.map.Tiles.Base3: return 'base3';
            case game.map.Tiles.Base4: return 'base4';
            case game.map.Tiles.Abyss: return 'abyss';
            case game.map.Tiles.Frozen: return 'frozen';
            case game.map.Tiles.Stone: return 'base1'; // XXX
        }
        throw "Board: unknown tile type " + type;
    },

    restore: function(callback) {
        // var type = this.originalType;
        var type = game.map.getTile(this.tileX, this.tileY, true);
        this.changeWith(type, function() {
            // notify when transition is completed
            callback && callback();            
        });
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

    enableFade: function(fadeOutCallback, fadeInCallback, fadeIn, fadeOut) {
        this.fadeIn = fadeIn === false ? false : true;
        this.fadeOut = fadeOut === false ? false : true;
        // this.alpha = 1.0;
        this.fadeStep = 0.0095;

        // XXX: This can get ugly if called simultaneously from different places!!
        this.fadeOutCallback = fadeOutCallback;
        this.fadeInCallback = fadeInCallback;
    },

    disableFade: function(alpha) {
        this.fadeIn = false;
        this.fadeOut = false;
        this.alpha = alpha || 1.0;
    },

    enableFadeOut: function(callback) {
        this.enableFade(function(self) {
            self.disableFade(0.01);
            // notify when fade out is completed
            callback && callback();            
        }, undefined, false, true);
    },

    enableFadeIn: function(callback) {
        this.enableFade(undefined, function(self) {
            self.disableFade(1.0);
            // notify when fade in is completed
            callback && callback();            
        }, true, false);
    },    

    update: function() {
        // this.parent();
        if (this.fadeOut) {
            this.alpha -= this.fadeStep * me.timer.tick;
            if (this.alpha < 0.1) {
                this.alpha = 0.1;
                this.fadeStep = -this.fadeStep;
                this.fadeOutCallback && this.fadeOutCallback(this);
            }
        } 
        if (this.fadeIn) {
            this.alpha -= this.fadeStep * me.timer.tick;
            if (this.alpha > 1.0) {
                this.alpha = 1.0;
                this.fadeStep = -this.fadeStep;
                this.fadeInCallback && this.fadeInCallback(this);
            }
        }

        return false;
    }
});