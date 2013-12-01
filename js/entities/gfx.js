/**
 * spells.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under a Creative Commons Attribution-NoDerivatives 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/4.0/.
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
/**
 * Clear background. Taken from the following places (with minor adjustments):
 * http://pastie.org/4752451
 * https://groups.google.com/forum/#!searchin/melonjs/transparent$20background/melonjs/9khmjV8ytIo/3H68gG6xycMJ
 */
game.GFX.ClearScreen = me.Renderable.extend({
    init: function() {
        // var w = me.device.isMobile ? Math.floor(me.video.getWidth() * 1.99) : me.video.getWidth();
        // var h = me.device.isMobile ? Math.floor(me.video.getHeight() * 1.99) : me.video.getHeight();
        var w = me.video.getWidth();
        var h = me.video.getHeight();
        this.parent(new me.Vector2d(0, 0), w, h);
        this.z = -Infinity;
        this.isPersistent = true;
        this.visible = true;
    },

    update: function() {
        // iOS 6 canvas bugfix
        // http://blog.jackadam.net/2010/the-unfortunate-state-of-canvas-animations-on-the-iphone-ipad/
        if (me.device.isMobile) {
            var canvas = me.video.getScreenCanvas();
            canvas.width = canvas.width + 0;
        }
        return true;
    },

    draw: function(context) {
        context.clearRect(0, 0, this.width, this.height);
    }
});
