/**
 * menu_hud.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

game.MenuScene.HUD = game.MenuScene.HUD || {};

game.MenuScene.HUD.ButtonWidth = 160;
game.MenuScene.HUD.ButtonHeight = 60;
game.MenuScene.HUD.ButtonFadeSpeed = 0.075;

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
                this.alpha = 0;
                this.blend = false;
                this.handler && this.handler();
            }
        }
        return true;
    }    
});
/**
 * Menu UI Container
 */
game.MenuScene.HUD.Base = me.ObjectContainer.extend({
    init: function(eventHandler, settings) {
        // call the constructor
        this.parent();
        
        // non collidable
        this.collidable = false;
        
        // make sure our object is always draw first
        this.z = _Globals.gfx.zHUD;
        this.sortOn = "y";
        // give a name
        this.name = "menu-HUD";

        // (default) event handler 
        this.eventHandler = eventHandler;

        // draw background
        // this.imageBackground = new me.SpriteObject(0, 0, me.loader.getImage('menu-background'));
        // this.addChild(this.imageBackground);

        // create font to draw texts
        this.text = null;
        this.font = new me.Font('dafont', '16px', 'white', 'left');
        this.font.lineHeight = 1.2;
        this.fontBlack = new me.Font('dafont', '24px', 'black', 'left');
        this.xText = 0;
        this.yText = 0;        
        // sort renderable        
        this.sort();
    },
    /**
     * @override
     */
    draw: function(context) {
        this.parent(context);
        if (this.text) {
            this.font.draw(context, this.text, this.xText, this.yText);
        }
    },    
    // Propagate UI event to handler
    onEvent: function(name) {
        if (this.eventHandler) {
            this.eventHandler[name].call(this.eventHandler, Array.prototype.slice.call(arguments, 1));
        }
    },

    drawText: function(text) {
        this.text = text;
    },

    clearText: function() {
        this.text = null;
    }        
});
/**
 * Title HUD
 */
game.MenuScene.HUD.Title = game.MenuScene.HUD.Base.extend({
        init: function(eventHandler, settings) {
        // call the constructor
        this.parent(eventHandler, settings);

        // draw title
        this.titleTouchRect = new me.Rect(new me.Vector2d(50, 100), 350, 150);
        this.imageTitle = new me.SpriteObject(50, 100, me.loader.getImage('menu-title'));
        this.addChild(this.imageTitle);        

        var parent = this;

        // add buttons
        this.btnPlay = new game.MenuScene.HUD.Clickable(100, 240, {
            image: 'menu-buttons',
            frame: 0,
            onClick: function() {
                parent.onEvent('onClick_Play');
            }
        });
        this.btnHowTo = new game.MenuScene.HUD.Clickable(100, 320, {
            image: 'menu-buttons',
            frame: 1,
            onClick: function() {
                parent.onEvent('onClick_HowTo');
            }
        });

        this.addChild(this.btnPlay);
        this.addChild(this.btnHowTo);

        this.sort();
    }
});
/**
 * Select Character HUD
 */
game.MenuScene.HUD.SelectCharacter = game.MenuScene.HUD.Base.extend({
        init: function(eventHandler, settings) {
        // call the constructor
        this.parent(eventHandler, settings);

        var parent = this;
        var sequence = [_Globals.wizards.Earth, _Globals.wizards.Water, _Globals.wizards.Fire, _Globals.wizards.Air];

        this.actors = {};
        this.touchRects = {};
        this.selectedActor = null;
        
        // draw wizards

        // for (var i in this.actors) {
        //     this.addChild(this.actors[i]);

        //     var pos = this.actors[i].getPosition();
        //     this.touchRects[i] = new me.Rect(new me.Vector2d(pos.x, pos.y), pos.w, pos.h);
        //     me.input.registerPointerEvent('mousedown', this.touchRects[i], this.touchWizard.bind(this, i));
        // }
     
        var wx = _Globals.canvas.xOffset + 45, wy = _Globals.canvas.yOffset;
        this.actorsFrames = [[0, 1], [2, 3], [4, 5], [6, 7]];

        for (var i = 0; i < sequence.length; i++) {
            this.actors[sequence[i]] = new game.MenuScene.HUD.Clickable(wx, wy, {
                width: 208,
                height: 444,
                image: 'menu_characters',
                frame: this.actorsFrames[i],
                fade: false,
                onClick: this.touchWizard.bind(this, sequence[i], this.actorsFrames[i])
            });            
            this.addChild(this.actors[sequence[i]]);

            wx += 208 + 15;
        }

        // add buttons
        // var btnX = _Globals.canvas.width / 2 - 167 / 2;
        var btnX = _Globals.canvas.gameWidth - 167 - 15;

        this.btnStart = new game.MenuScene.HUD.Clickable(btnX, _Globals.canvas.height - 127, {
                width: 167,
                height: 107,                
                image: 'menu_btn_play',
                frame: 0,
                onceClick: false,
                onClick: function() {
                    if (parent.selectedActor) {
                        parent.onEvent('onClick_StartGame', parent.selectedActor);
                    }
                }
        });
        this.btnStart.visible = false;
        this.addChild(this.btnStart);

        // back to title screen
        // me.input.registerPointerEvent('mousedown', this.titleTouchRect, function() {
        //     me.input.releasePointerEvent('mousedown', parent.titleTouchRect);
        //     parent.onEvent('onClick_Title');
        // });
        
        // text positions
        this.xText = _Globals.canvas.xOffset + 30;
        this.yText = _Globals.canvas.height - 110;

        this.sort();
    },
    /**
     * @override
     * Release wizards onClick events before destroying object container
     */
    destroy: function() {
        for (var i in this.actors) {
            this.actors[i].clear();
        }
        this.parent();
    },
    /**
     * @override
     */
    draw: function(context) {
        this.parent(context);

        var width = 300; //this.font.measureText(context, nls.get('menu.select_character'));
        var xpos = _Globals.canvas.width / 2 - width / 2;
        this.fontBlack.draw(context, nls.get('menu.select_character'), xpos, 28);
    }, 

    touchWizard: function(who, frames) {
        var self = this;
        var actor = this.actors[who];

        var j = 0;
        for (var i in this.actors) {
            this.actors[i].setAnimationFrame(this.actorsFrames[j][0]);
            j++;
        }

        // mark selected character
        this.selectedActor = who;
        actor.setAnimationFrame(frames[1]);
        // show play button
        this.btnStart.visible = true;
        
        switch(who) {
            case _Globals.wizards.Earth:
                this.drawText(nls.get('menu.wiz_earth'));
            break;
            case _Globals.wizards.Water:
                this.drawText(nls.get('menu.wiz_water'));
            break;
            case _Globals.wizards.Fire:
                this.drawText(nls.get('menu.wiz_fire'));
            break;
            case _Globals.wizards.Air:
                this.drawText(nls.get('menu.wiz_air'));
            break;
        }
    }
});