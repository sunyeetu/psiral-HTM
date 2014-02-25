/**
 * menu.js
 *
 * Copyright (c) 2014 Dvubuz Games
 *
 */

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

        // create font to draw texts
        this.text = null;
        this.fontSmall = new me.Font('dafont', '12px', 'white', 'left');
        this.font = new me.Font('dafont', '15px', 'white', 'left');
        this.font.lineHeight = 1.4;
        this.fontBlack = new me.Font('dafont', '24px', 'black', 'left');
        this.fontShadow = new me.Font('dafont', '24px', 'white', 'left');
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

        // draw background
        var sx = _Globals.canvas.width / 2 - 900 / 2;
        var sy = 92;
        this.imageBackground = new me.SpriteObject(sx, sy, me.loader.getImage('menu_background'));
        this.addChild(this.imageBackground);        

        var parent = this;
        var props = {
            width: 167,
            height: 107,
            image: 'menu_buttons'
        };
        var btny = 510;
        var btnx = _Globals.canvas.width / 2 - props.width / 2;
        btnx -= props.width / 2;

        // add buttons
        this.btnPlay = new game.MenuScene.HUD.Clickable(btnx, btny, _.extend(_.clone(props), {
            frame: 0,
            onClick: function() {
                parent.onEvent('onClick_Play');
            }
        }))

        btnx += props.width;
        this.btnHowTo = new game.MenuScene.HUD.Clickable(btnx, btny, _.extend(_.clone(props), {
            frame: 2,
            onClick: function() {
                parent.onEvent('onClick_HowTo');
            }
        }));

        this.addChild(this.btnPlay);
        this.addChild(this.btnHowTo);

        this.sort();
    },
    /**
     * @override
     */
    draw: function(context) {
        this.parent(context);
        this.font.draw(context, 'by Dvubuz Games', 448, 632);
        this.fontSmall.draw(context, 'v' + _version.buildnumber, 
            _Globals.canvas.gameWidth - 15, _Globals.canvas.gameHeight - 26);
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
        var wx = _Globals.canvas.xOffset + 36, wy = _Globals.canvas.yOffset;
        this.actorsFrames = [[0, 4], [1, 5], [2, 6], [3, 7]];

        for (var i = 0; i < sequence.length; i++) {
            this.actors[sequence[i]] = new game.MenuScene.HUD.Clickable(wx, wy, {
                width: 220,
                height: 450,
                image: 'menu_characters',
                frame: this.actorsFrames[i],
                fade: false,
                onClick: this.touchWizard.bind(this, sequence[i])
            });            
            this.addChild(this.actors[sequence[i]]);

            wx += 220;
        }

        // add buttons
        // var btnX = _Globals.canvas.width / 2 - 167 / 2;
        var btnX = _Globals.canvas.gameWidth - 167;

        this.btnStart = new game.MenuScene.HUD.Clickable(btnX, _Globals.canvas.height - 124, {
                width: 167,
                height: 107,                
                image: 'menu_buttons',
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
       
        // text positions
        this.xText = _Globals.canvas.xOffset + 50;
        this.yText = _Globals.canvas.height - 110;

        // back to title screen
        this.backBtnRect = new me.Rect(new me.Vector2d(_Globals.canvas.gameWidth - 74, 28),
            60, 40);
        
        me.input.registerPointerEvent('mousedown', this.backBtnRect, function() {
            me.input.releasePointerEvent('mousedown', parent.backBtnRect);

            parent.onEvent('onClick_Title');

            // play sound
            me.audio.play('click', false);            
        });        

        this.sort();
    },
    /**
     * @override
     * Release wizards onClick events before destroying object container
     */
    destroy: function() {
        for (var i in this.actors) {
            this.actors[i].clear();
            this.removeChild(this.actors[i]);
        }
        this.parent();
    },
    /**
     * @override
     */
    draw: function(context) {
        this.parent(context);

        var width = 300; //this.font.measureText(context, nls.get('menu.select_character'));
        var xpos = _Globals.canvas.xOffset + 50; // _Globals.canvas.width / 2 - width / 2;
        this.fontShadow.draw(context, nls.get('menu.select_character'), xpos + 1, 28 + 1);
        this.fontBlack.draw(context, nls.get('menu.select_character'), xpos, 28);
        this.fontShadow.draw(context, nls.get('menu.back'), this.backBtnRect.pos.x + 1, this.backBtnRect.pos.y + 1);
        this.fontBlack.draw(context, nls.get('menu.back'), this.backBtnRect.pos.x, this.backBtnRect.pos.y);
    }, 

    touchWizard: function(who) {
        var self = this;
        var actor = this.actors[who];

        var j = 0;
        for (var i in this.actors) {
            this.actors[i].setAnimationFrame(0);
            j++;
        }

        // mark selected character
        this.selectedActor = who;
        actor.setAnimationFrame(1);
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