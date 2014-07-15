/**
 * widgets.js
 *
 * Copyright (c) 2014 Dvubuz Games
 * 
 */

/* jshint -W030 */

game.MenuScene.HUD = game.MenuScene.HUD || {};
game.MenuScene.HUD = _.extend(game.MenuScene.HUD, {
    ButtonWidth: 160,
    ButtonHeight: 60,
    ButtonFadeSpeed: 0.075
});

/**
 * Clickable UI element
 */
game.MenuScene.HUD.Clickable = me.AnimationSheet.extend({
    init: function(x, y, settings) {
        settings.width = settings.width || game.MenuScene.HUD.ButtonWidth;
        settings.height = settings.height || game.MenuScene.HUD.ButtonHeight;
        this.parent(x, y, me.loader.getImage(settings.image), settings.width, settings.height);
        
        this.handler = settings.onClick;
        settings.z = settings.z || (_Globals.gfx.zHUD + 5);
        
        // override animation speed
        if (Object.prototype.toString.call(settings.frame) === '[object Array]') {
            this.addAnimation('main', settings.frame);
        } else {
            this.addAnimation('main', [settings.frame]);
        }
        this.setCurrentAnimation('main');
        this.animationpause = true;
        // reset blending
        this.fade = (typeof settings.fade !== 'undefined') ? settings.fade : true;
        this.fadeoutspeed = settings.fadeoutspeed || game.MenuScene.HUD.ButtonFadeSpeed;
        this.blend = false;
        this.alpha = 1.0;
        this.clickOnce = (typeof settings.clickOnce !== 'undefined') ? settings.clickOnce : true;

        this.touchRect = new me.Rect(new me.Vector2d(x, y), settings.width, settings.height);

        var parent = this;
        me.input.registerPointerEvent('mousedown', this.touchRect, function() {
            if (this.clickOnce)
                me.input.releasePointerEvent('mousedown', parent.touchRect);

            // play sound
            me.audio.play('click', false);

            if (parent.fade === true) {
                parent.blend = true;
            } else {
                parent.handler && parent.handler();
            }
        });
    },

    setFrame: function(frame) {
        this.animationpause = false;
        this.setAnimationFrame(frame);
        this.animationpause = true;
    },

    onClick: function(handler) {
        this.handler = handler;
    },

    clear: function() {
        me.input.releasePointerEvent('mousedown', this.touchRect);
    },

    update: function() {
        this.parent();
        /**
         * Notify caller that animation has been clicked only
         * after the fadeout post animation completes.
         */
        if (this.blend) {
            this.alpha -= this.fadeoutspeed * me.timer.tick;
            if (this.alpha <= 0) {
                this.alpha = 1.0; // reset 
                this.blend = false;
                this.handler && this.handler();
            }
        }
        return true;
    }    
});