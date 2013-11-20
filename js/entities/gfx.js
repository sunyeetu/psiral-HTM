/**
 * spells.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

game.GFX = game.GFX || {};

game.GFX.anims = {
    Teleport: 'teleport',
    Blind: 'blind',
};

game.GFX.animationSpeed = 75;

game.GFX.Container = me.ObjectContainer.extend({
    /** 
     * constructor
     */
    init: function() {
        // call the constructor
        this.parent();
        // non collidable
        this.collidable = false;
        // make sure our object is always draw first
        this.z = _Globals.gfx.zAnimation;
        // give a name
        this.name = "GFX";

        // (default) event handler 
        this.eventHandler = null;       
    },

    play: function(gfx, x, y, cb) {
        var self = this;

        var entity = new game.GFX.SpellEntity(x, y, {
            animation: gfx, 
            callback: function() {
                self.removeChild(entity);
                cb && cb();
            }
        });
        this.addChild(entity);
    },

});

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

