/**
 * tiles.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

game.TileEntity = me.ObjectEntity.extend({
    
    init: function(x, y, settings) {
        settings.image = 'boardtileset';
        settings.spritewidth = _Globals.gfx.tileWidth;
        settings.spriteheight = _Globals.gfx.tileHeight;
        x *= _Globals.gfx.tileWidth;
        y *= _Globals.gfx.tileHeight;
        x += _Globals.canvas.xOffset;
        y += _Globals.canvas.yOffset;
        this.parent(x, y, settings);

        this.collidable = false;
        this.z = _Globals.gfx.zTile;
        
        // setup animations
        this.renderable.animationspeed = 450; // + Math.random() * 200;
        this.renderable.addAnimation('earth', [0]);
        this.renderable.addAnimation('water', [8]);
        this.renderable.addAnimation('fire', [16]);
        this.renderable.addAnimation('air', [24]);

        this.renderable.addAnimation('fountain', [40]);

        this.renderable.addAnimation('base1', [48]);
        this.renderable.addAnimation('base2', [49]);
        this.renderable.addAnimation('base3', [50]);
        this.renderable.addAnimation('base4', [51]);
        this.renderable.setCurrentAnimation(settings.name);
    },

    update: function() {
        this.parent();
        return true;
    }

});