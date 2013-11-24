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
        this.parent(x, y, me.loader.getImage(settings.image), game.MenuScene.HUD.ButtonWidth);
        
        this.handler = settings.onClick;
        settings.z = settings.z || (_Globals.gfx.zHUD + 5);
        
        // override animation speed
        this.addAnimation('main', [settings.frame]);
        this.setCurrentAnimation('main');
        this.animationpause = true;
        // reset blending
        this.fadeoutspeed = settings.fadeoutspeed || game.MenuScene.HUD.ButtonFadeSpeed;
        this.blend = false;
        this.alpha = 1.0;

        this.touchRect = new me.Rect(new me.Vector2d(x, y), 
            game.MenuScene.HUD.ButtonWidth, 
            game.MenuScene.HUD.ButtonHeight);

        var parent = this;
        me.input.registerPointerEvent('mousedown', this.touchRect, function() {
            me.input.releasePointerEvent('mousedown', parent.touchRect);
            parent.blend = true;
        });
        
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
        this.imageBackground = new me.SpriteObject(0, 0, me.loader.getImage('menu-background'));
        this.addChild(this.imageBackground);
        // draw title
        this.titleTouchRect = new me.Rect(new me.Vector2d(50, 100), 350, 150);
        this.imageTitle = new me.SpriteObject(50, 100, me.loader.getImage('menu-title'));
        this.addChild(this.imageTitle);
        // create font
        // font to draw texts
        this.text = null;
        this.font = new me.Font('walkaway', '2.0em', 'white', 'center');
        // sort renderable        
        this.sort();

        this.yText = 0;
        this.xText = 0;
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

        this.actors = {};
        this.touchRects = {};
        this.selectedActor = null;
        
        // draw wizards
        var wx = 5, wy = 4;
        this.actors[_Globals.wizards.Earth] = new game.EarthWizardEntity(wx, wy, {});
        wx += 2;
        this.actors[_Globals.wizards.Water] = new game.WaterWizardEntity(wx, wy, {});
        wx += 2;
        this.actors[_Globals.wizards.Fire] = new game.FireWizardEntity(wx, wy, {});
        wx += 2;
        this.actors[_Globals.wizards.Air] = new game.AirWizardEntity(wx, wy, {});

        for (var i in this.actors) {
            this.addChild(this.actors[i]);

            var pos = this.actors[i].getPosition();
            this.touchRects[i] = new me.Rect(new me.Vector2d(pos.x, pos.y), pos.w, pos.h);
            me.input.registerPointerEvent('mousedown', this.touchRects[i], this.touchWizard.bind(this, i));
        }

        this.xText = 400;
        this.yText = 415;

        // add buttons
        this.btnStart = new game.MenuScene.HUD.Clickable(400, 
            _Globals.canvas.height - game.MenuScene.HUD.ButtonHeight * 2, 
            {
                image: 'menu-buttons',
                frame: 2,
                onClick: function() {
                    if (parent.selectedActor) {
                        parent.onEvent('onClick_StartGame', parent.selectedActor);
                    }
                }
        });
        // back to title screen
        me.input.registerPointerEvent('mousedown', this.titleTouchRect, function() {
            me.input.releasePointerEvent('mousedown', parent.titleTouchRect);
            parent.onEvent('onClick_Title');
        });

        this.sort();
    },
    /**
     * @override
     * Release wizards onClick events before destroying object container
     */
    destroy: function() {
        for (var i in this.actors) {
            me.input.releasePointerEvent('mousedown', this.touchRects[i]);
        }
        this.parent();
    },

    touchWizard: function(who) {
        var self = this;
        
        // me.input.releasePointerEvent('mousedown', this.touchRects[who]);
        
        // show start button
        if (!this.selectedActor) {
            this.addChild(this.btnStart);
        }
        this.addChild(this.btnStart);
        this.selectedActor = who;
        // dim all but selected
        for (var i in this.actors) {
            this.actors[i].setAlpha(0.5);
        }
        this.actors[who].setAlpha(1.0);

        // play select actors animation
        this.actors[who].playAnimation('walk_down', function() {
            self.actors[who].playAnimation('stand_down');
        });

        // switch(who) {
        //     case _Globals.wizards.Earth:
        //         this.drawText(nls.get('menu.wiz_earth'));
        //     break;
        //     case _Globals.wizards.Water:
        //         this.drawText(nls.get('menu.wiz_water'));
        //     break;
        //     case _Globals.wizards.Fire:
        //         this.drawText(nls.get('menu.wiz_fire'));
        //     break;
        //     case _Globals.wizards.Air:
        //         this.drawText(nls.get('menu.wiz_air'));
        //     break;
        // }
    }
});