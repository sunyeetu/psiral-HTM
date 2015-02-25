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
    ButtonFadeSpeed: 0.095
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

/**
 * Clickable UI element
 */
game.MenuScene.HUD.Audio = {

    show: function() {
        var parent = this;

        this.soundOn = persistence.get(persistence.SOUND);
        this.musicOn = persistence.get(persistence.MUSIC);

        var props = {
            width: 32,
            height: 32,
            image: 'hud_audio'
        };
        var btnx = _Globals.canvas.width - 32 - 6; // 50
        var btny = 8;// _Globals.canvas.height - 32 - 8;

        // sound
        this.btnSound = new game.MenuScene.HUD.Clickable(btnx, btny, _.extend(_.clone(props), {
            frame: [3, 2],
            onClick: function() {
                parent.soundOn = !parent.soundOn;
                parent.btnSound.setFrame(parent.soundOn ? 2 : 3);
                // save sound opt
                persistence.set(persistence.SOUND, parent.soundOn);
                persistence.commit();
            }
        }));
        parent.btnSound.setFrame(parent.soundOn ? 2 : 3);
        this.addChild(this.btnSound);

        // btnx += 32 + 8;
        btny += 32 + 7;

        // music
        this.btnMusic = new game.MenuScene.HUD.Clickable(btnx, btny, _.extend(_.clone(props), {
            frame: [1, 0],
            onClick: function() {
                parent.musicOn = !parent.musicOn;
                parent.btnMusic.setFrame(parent.musicOn ? 0 : 1);
                // save music opt
                persistence.set(persistence.MUSIC, parent.musicOn);
                persistence.commit();            
            }
        }));
        parent.btnMusic.setFrame(parent.musicOn ? 0 : 1);
        this.addChild(this.btnMusic);        
    },

    hide: function() {
        if (typeof this.btnSound === 'undefined') {
            return;
        }
        this.removeChild(this.btnSound);
        this.removeChild(this.btnMusic);
        this.btnSound = null;
        this.btnMusic = null;
    }
};