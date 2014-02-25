/**
 * gfx.js
 *
 * Copyright (c) 2014 Dvubuz Games
 *
 */

game.GFX = game.GFX || {};

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
