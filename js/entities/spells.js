/**
 * spells.js
 *
 * Copyright (c) 2014 Dvubuz Games
 * 
 */

game.GFX = game.GFX || {};

/**
 * Spellcasting animations
 */
game.GFX.SpellEntity = me.ObjectEntity.extend({
    
    init: function(x, y, settings) {
        settings.image = 'spells';
        settings.spritewidth = 56;
        settings.spriteheight = 56;
        x *= _Globals.gfx.tileWidth;
        y *= _Globals.gfx.tileHeight;
        x += _Globals.canvas.xOffset;
        y += _Globals.canvas.yOffset;
        this.parent(x, y, settings);

        this.collidable = false;
        this.z = _Globals.gfx.zAnimation + 1;
        this.type = 'gfx';

        // setup animations
        this.renderable.animationspeed = game.GFX.animationSpeed;
        this.renderable.addAnimation(game.GFX.anims.Teleport, [0, 1, 2, 3, 4, 5, 6, 7]);
        this.renderable.addAnimation(game.GFX.anims.Blind, [0, 1, 2, 3, 4, 5, 6, 7]);

        // play animation
        this.renderable.setCurrentAnimation(settings.animation, function() {
            this.animationpause = true;
            settings.callback && settings.callback();
        });
    }
});