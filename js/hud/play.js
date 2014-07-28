/**
 * play.js
 *
 * Copyright (c) 2014 Dvubuz Games
 *
 */

/* jshint -W030 */

game.HUD = game.HUD || {};
/**
 * Status HUD
 */
game.HUD.Stats = me.ObjectContainer.extend({
    init: function() {
        // call the constructor
        this.parent();
        
        // non collidable
        this.collidable = false;
        
        // make sure our object is always draw first
        this.z = _Globals.gfx.zHUDStats;

        // give a name
        this.name = "HUD";

        this.x = _Globals.canvas.xOffsetHUD;
        this.y = _Globals.canvas.yOffsetHUD;
        this.xStep = 176;
        this.cxScreen = _Globals.canvas.gameWidth / 2;

        var parent = this;
        var wizards = [
            _Globals.wizards.Earth,
            _Globals.wizards.Water,
            _Globals.wizards.Fire,
            _Globals.wizards.Air
        ];
        var wx = this.x;
        var wy = this.y;
        var face;
        var faceWidth = 56;
        this.faceWidth = faceWidth;

        // hold all UI elements added
        this.sprites = {};
        var sprite;

        wizards.forEach(function(w) {
            sprite = new me.AnimationSheet(wx, wy, me.loader.getImage('hud_faces'), faceWidth);

            switch(w) {
                case _Globals.wizards.Earth:
                    sprite.setAnimationFrame(0);
                break;
                case _Globals.wizards.Water:
                    sprite.setAnimationFrame(1);
                break;
                case _Globals.wizards.Fire:
                    sprite.setAnimationFrame(2);
                break;
                case _Globals.wizards.Air:
                    sprite.setAnimationFrame(3);
                break;
                default:
                    throw "HUD: Unknown wizard " + w;
            }
            
            sprite.animationpause = true;
            parent.sprites[w] = sprite;
            parent.addChild(sprite);

            wx += parent.xStep;
        });

        // text placeholder
        var pcX = this.x + _Globals.canvas.gameWidth - 237;
        var pcY = wy + 8;
        parent.addChild(new me.SpriteObject(pcX, pcY, me.loader.getImage('hud_text')));
        // font to draw texts
        this.text = null;
        this.font = new me.Font('dafont', '14px', 'white', 'left');
        this.font.textBaseline  = 'top';
        this.font.lineHeight = 1.2;
        this.xText = pcX + 5;
        this.yText = pcY + 7;

        // fade props
        this.fadeOutEnabled = false;
        this.fadeStep = 0.0095;
        this.fadeOutCallback = null;
        this.fadeFactor = 1.0;

        //
        //
        // audio controls
        game.MenuScene.HUD.Audio.show.call(this);
    },

    draw: function(context) {
        this.parent(context);
        if (this.text) {
            this.font.draw(context, this.text, this.xText, this.yText);
        }
    },

    drawText: function(text) {
        this.text = text;
    },

    clearText: function() {
        this.text = null;
    },

    updateMana: function(wizard, amount) {
        var i;

        // TODO: use local references instead of getEntityByProp
        var bars = this.getEntityByProp('name', 'manabar_' + wizard);
        for (i = bars.length - 1; i >= 0; i--) {
            this.removeChild(bars[i]);
        }

        var mx;
        var icon;
        switch(wizard) {
            case _Globals.wizards.Earth:
                mx = 0;
                icon = 0;
            break;
            case _Globals.wizards.Water:
                mx = this.xStep;
                icon = 1;
            break;
            case _Globals.wizards.Fire:
                mx = this.xStep * 2;
                icon = 2;
            break;
            case _Globals.wizards.Air:
                mx = this.xStep * 3;
                icon = 3;
            break;
            default:
                throw "HUD: Unknown wizard " + wizard;
        }

        mx += this.x + this.faceWidth + 2;

        var manabar;

        // draw mana bars
        for(i = 0; i < amount; i++) {
            manabar = new me.AnimationSheet(mx, this.y + 28, me.loader.getImage('hud_mana'), 10);
            manabar.setAnimationFrame(icon);
            manabar.animationpause = true;
            manabar.name = 'manabar_' + wizard;
            manabar.isEntity = true;
            this.addChild(manabar);

            mx += 10 + 1;
        }        
        // draw empty mana bars (MaxMana=10)
        for(i = 0; i < 10 - amount; i++) {
            manabar = new me.AnimationSheet(mx, this.y + 28, me.loader.getImage('hud_mana'), 10);
            manabar.setAnimationFrame(4);
            manabar.animationpause = true;
            manabar.name = 'manabar_' + wizard;
            manabar.isEntity = true;
            this.addChild(manabar);

            mx += 10 + 1;
        }         
    },

    fadeOut: function(step, callback, without) {
        this.fadeOutEnabled = true;
        this.fadeStep = step || 0.0095;
        this.fadeOutCallback = callback;
        this.fadeFactor = 1.0;
        this.fadeWithout = without;
    },

    update: function() {

        if (this.fadeOutEnabled) {
            this.fadeFactor -= this.fadeStep * me.timer.tick;
            if (this.fadeFactor < 0) {
                this.fadeFactor = 0;
                this.fadeOutEnabled = false;
                // this.fadeStep = -this.fadeStep;
                this.fadeOutCallback && this.fadeOutCallback(this);
            }

            // TODO: refactor this loop
            var wizards = _.without(game.gamemaster.WizardsList, this.fadeWithout);
            for (var i = wizards.length - 1; i >= 0; i--) {
                var bars = this.getEntityByProp('name', 'manabar_' + wizards[i]);
                for (var j = bars.length - 1; j >= 0; j--) {
                    bars[j].alpha = this.fadeFactor;
                }
                this.sprites[wizards[i]].alpha = this.fadeFactor;
            }
        }

        this.parent();
        return false;
    }
});
/**
 * Base UI Dialog container 
 */
game.HUD.Container = me.ObjectContainer.extend({
    init: function(eventHandler, settings) {
        // call the constructor
        this.parent();
        
        // non collidable
        this.collidable = false;
        
        // make sure our object is always draw first
        this.z = _Globals.gfx.zHUD;

        // give a name
        this.name = "HUD";

        // (default) event handler 
        this.eventHandler = eventHandler;

        // background
        settings.dlg_type = settings.dlg_type || 'dlg_small';
        if (settings.dlg_type === 'dlg_small') {
            this.width = 448;
            this.height = 120;
        } else { // if (settings.dlg_type === 'dlg_big') {
            settings.dlg_type = 'dlg_big';
            this.width = 503;
            this.height = 120;
        }

        this.cx = _Globals.canvas.xOffsetHUD + _Globals.canvas.gameWidth / 2 - this.width / 2;
        this.cy = _Globals.canvas.gameHeight - 120;
        this.endx = this.cx + this.width;
        this.endy = this.cy + this.height;

        this.imageBackground = new me.SpriteObject(this.cx, this.cy, me.loader.getImage(settings.dlg_type));
        this.imageBackground.alpha = 0.95;
        this.addChild(this.imageBackground);

        // wizard face
        this.faceWidth = 79;
        this.imageFaceSlot = new me.AnimationSheet(this.cx + 14, this.cy + 14, 
            me.loader.getImage('dlg_faces'), 
            this.faceWidth);

        switch(settings.wizard) {
            case _Globals.wizards.Earth:
                this.imageFaceSlot.setAnimationFrame(0);
            break;
            case _Globals.wizards.Water:
                this.imageFaceSlot.setAnimationFrame(1);
            break;
            case _Globals.wizards.Fire:
                this.imageFaceSlot.setAnimationFrame(2);
            break;
            case _Globals.wizards.Air:
                this.imageFaceSlot.setAnimationFrame(3);
            break;
            default:
                throw "HUD: Unknown wizard " + settings.wizard;
        }
        this.imageFaceSlot.animationpause = true;
        this.imageFaceSlot.z =  _Globals.gfx.zHUD + 1;
        this.addChild(this.imageFaceSlot);

        // dialog center
        this.xcenter = this.cx + this.width / 2;
        this.ycenter = this.cy + this.height / 2;        
    },
    // Propagate UI event to handler
    onEvent: function(name) {
        if (this.eventHandler) {
            this.eventHandler[name].call(this.eventHandler, Array.prototype.slice.call(arguments, 1));
        }
    }
});
/**
 * Clickable UI element
 */
game.HUD.Clickable = me.GUI_Object.extend({   
    init: function(x, y, settings) {
        settings = settings || {};
        if (!settings.image)
            throw "Clickable image not specified!";

        settings.spritewidth = settings.spritewidth || 64;
        settings.spriteheight = settings.spriteheight || 64;
        this.parent(x, y, settings);
        this.z = settings.z || (_Globals.gfx.zHUD + 1);
        this.handler = settings.onClick;
    },
    onClick: function(event) {
        // play sound
        me.audio.play('click', false);
        
        this.handler && this.handler(event);
        // don't propagate the event
        return false;
    }
});
/**
 * Clickable Animation UI element
 */
game.HUD.ClickableAnimation = me.AnimationSheet.extend({
    init: function(x, y, settings) {

        // default size
        settings.width = settings.width || 64;
        settings.height = settings.height || 64;
        // init base obj
        this.parent(x, y, me.loader.getImage(settings.image), settings.width, settings.height);
        
        this.handler = settings.onClick;
        this.z = settings.z || (_Globals.gfx.zHUD + 5);

        // override animation speed
        settings.speed = settings.speed || 75;
        this.addAnimation('main', settings.frames, settings.speed);
        this.setCurrentAnimation('main');
        if (settings.paused === true)
            this.animationpause = true;

        this.fadeout = settings.fadeout || false;
        this.fadeoutspeed = settings.fadeoutspeed || 0.035;
        this.stopFrame = (typeof settings.stopFrame === "undefined") ? false : settings.stopFrame;
        this.blend = false;

        var parent = this;

        // click event
        this.touchRect = new me.Rect(new me.Vector2d(x, y), settings.width, settings.height);
        this.setClickable(true);
    },

    setClickable: function(enabled) {
        if (enabled === true) {
            me.input.registerPointerEvent('mousedown', this.touchRect, this.onClick.bind(this));
            this.clickable = true;
        } else {
            me.input.releasePointerEvent('mousedown', this.touchRect);
            this.clickable = false;
        }
    },
    
    onClick: function() {
        me.input.releasePointerEvent('mousedown', this.touchRect);

        // play sound
        me.audio.play('click', false);
        
        if (this.stopFrame !== false) {
            this.animationpause = true;
            this.setAnimationFrame(this.stopFrame);
        }

        if (this.fadeout === true) {
            this.blend = true;
            this.animationpause = true;
        } else {
           this.handler && this.handler(); 
        }
    },

    setFadeout: function(enabled) {
        this.fadeout = enabled;
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
                this.visible = false;
                this.blend = false;
                this.handler && this.handler(); // XXX: no handler
            }
        }
        return true;
    }
});
/**
 * Dialog: Select Chance or Spell dialog
 */
game.HUD.SelectMove = game.HUD.Container.extend({
    init: function(eventHandler, settings) {
        this.parent(eventHandler, settings);

        var parent = this;
        this.iconWidth = 148;
        this.iconHeight = 85;
        this.iconX = this.cx + 112;
        this.iconY = this.cy + this.height / 2 - this.iconHeight / 2;

        this.btnDice = new game.HUD.ClickableAnimation(this.iconX, this.iconY, {
            image: 'dlg_btn_choice',
            width: this.iconWidth,
            height: this.iconHeight,
            frames: [0],
            paused: true,
            fadeout: false, // no fade
            fadeoutspeed: 0.1,
            onClick: function(event) {
                parent.btnDice.setClickable(false);
                parent.btnSpell.setClickable(false);

                parent.onEvent('onSelectDice');
            }
        });
        this.addChild(this.btnDice);

        this.btnSpell = new game.HUD.ClickableAnimation(this.iconX + this.iconWidth + 8, this.iconY, {
            image: 'dlg_btn_choice',
            width: this.iconWidth,
            height: this.iconHeight,
            frames: [1],
            paused: true,
            fadeout: false, // no fade
            fadeoutspeed: 0.1,
            onClick: function(event) {
                parent.btnDice.setClickable(false);
                parent.btnSpell.setClickable(false);

                parent.onEvent('onSelectSpell');
            }
        });
        this.addChild(this.btnSpell);
    }
});
/**
 * Dialog: Throw dice 
 */
game.HUD.ThrowDice = game.HUD.Container.extend({
    init: function(eventHandler, settings) {
        this.parent(eventHandler, settings);

        var parent = this;
        this.iconWidth = 149;
        this.iconHeight = 85;
        this.iconX = this.cx + this.width / 2 - this.iconWidth / 2 + this.faceWidth / 2;
        this.iconY = this.cy + this.height / 2 - this.iconHeight / 2;

        var icon_image;
        var frame = 0;

        switch(settings.chance) {
            case _Globals.chance.Move1:
                frame = 3;
            break;
            case _Globals.chance.Move2:
                frame = 4;
            break;
            case _Globals.chance.Numb:
                frame = 5;
            break;
            case _Globals.chance.Mana1:
                frame = 6;
            break;
            case _Globals.chance.Mana2:
                frame = 7;
            break;
            case _Globals.chance.Jump:
                frame = 8;
            break;            
        }

        // add dice background layer
        this.btnChoice = new game.HUD.ClickableAnimation(this.iconX, this.iconY, {
            image: 'dlg_btn_choice',
            width: this.iconWidth,
            height: this.iconHeight,
            frames: [2],
            paused: true,
            fadeout: false,
            fadeoutspeed: 0.1,
            onClick: function(event) {
                parent.diceAnim.onClick();
            }
        });
        this.addChild(this.btnChoice);

        // // chance icon to reveal
        // var icon = new game.HUD.ClickableAnimation(this.iconX, this.iconY, {
        //     image: 'dlg_btn_choice',
        //     width: this.iconWidth,
        //     height: this.iconHeight,
        //     frames: [frame],
        //     paused: true,
        //     fadeout: false,
        //     fadeoutspeed: 0.1,
        //     onClick: function(event) {
        //         parent.onEvent('onDiceThrown');
        //     }
        // });
        // // only clickable when the dice side is revealed
        // icon.setClickable(false);
        
        // play sound
        me.audio.play('rolldice', true);
        
        this.diceAnim = new game.HUD.ClickableAnimation(this.iconX + 50, this.iconY + 20, {
            image: 'dlg_dice_anim',
            z: _Globals.gfx.zHUD + 6,
            width: 52,
            height: 49,
            frames: [0, 1, 2, 3, 4, 5],
            speed: 100,
            fadeout: false,
            stopFrame: (settings.chance - 1), // set dice side
            onClick: function(event) {
                parent.diceAnim.animationpause = true;

                // hide dice
                parent.btnChoice.visible = false;
                parent.diceAnim.visible = false;

                // show item that wizard got on throw
                var icon = new game.HUD.ClickableAnimation(parent.iconX, parent.iconY, {
                    image: 'dlg_btn_choice',
                    width: parent.iconWidth,
                    height: parent.iconHeight,
                    frames: [frame],
                    paused: true,
                    fadeout: false,
                    fadeoutspeed: 0.1,
                    onClick: function(event) {
                        parent.onEvent('onDiceThrown');
                    }
                });
                parent.addChild(icon);

                // disable exit btn
                parent.btnExit.setClickable(false);
                parent.btnExit.visible = false;

                // play sound
                me.audio.stop('rolldice');
                me.audio.play('rolldice2', false);
            }
        });            
        this.addChild(this.diceAnim);

        // add exit button
        this.btnExit = new game.HUD.ClickableAnimation(this.endx - 55, this.iconY + 10, {
            image: 'dlg_btn_back',
            width: 38,
            height: 65,
            frames: [0],
            fadeout: false,
            fadeoutspeed: 0.1,
            onClick: function() {
                me.audio.stop('rolldice');
                parent.onEvent('onCancelSelect');
            }
        });
        this.addChild(this.btnExit);
    }
});
/**
 * Dialog: Select spell
 * TODO: refactor!
 */
game.HUD.SelectSpell = game.HUD.Container.extend({

    init: function(eventHandler, settings) {
        var i;

        settings = settings || {};
        settings.dlg_type = 'dlg_big';
        this.parent(eventHandler, settings);

        this.iconWidth = 74;
        this.iconHeight = 85;        

        var parent = this;
        var special;

        this.spells = [
            {
                frames: [0],
                type: _Globals.spells.Abyss,
                onClick: function() {parent.onEvent('onCastSpell', _Globals.spells.Abyss); }
            },
            {
                image: 'dlg_btn_spells',
                width: this.iconWidth,
                height: this.iconHeight,
                frames: [1],
                type: _Globals.spells.Stone,
                onClick: function() {parent.onEvent('onCastSpell', _Globals.spells.Stone); }
            },
            {
                frames: [2],
                fadeout: false,
                type: _Globals.spells.Clay,
                onClick: function() {parent.onEvent('onCastSpell', _Globals.spells.Clay); }
            },
        ];

        switch(settings.wizard) {
            case _Globals.wizards.Earth:
            special = {
                frames: [3],
                type: _Globals.spells.Path,
                onClick: function() {parent.onEvent('onCastSpell', _Globals.spells.Path); }
            };
            break;
            case _Globals.wizards.Water:
            special = {
                frames: [4],
                type: _Globals.spells.Freeze,
                onClick: function() {parent.onEvent('onCastSpell', _Globals.spells.Freeze); }
            };
            break;
            case _Globals.wizards.Fire:
            special = {
                frames: [5],
                type: _Globals.spells.Blind,
                onClick: function() {parent.onEvent('onCastSpell', _Globals.spells.Blind); }
            };
            break;
            case _Globals.wizards.Air:
            special = {
                frames: [6],
                type: _Globals.spells.Teleport,
                onClick: function() {parent.onEvent('onCastSpell', _Globals.spells.Teleport); }
            };       
            break;
        }
        
        this.spells.push(special);

        // set common animation properties
        for (i = this.spells.length - 1; i >= 0; i--) {
            _.extend(this.spells[i], {
                image: 'dlg_btn_spells',
                width: this.iconWidth,
                height: this.iconHeight,
                fadeout: true,
                fadeoutspeed: 0.1,
            });
        }

        // adjust positions
        var startx = this.cx + this.faceWidth + 56;
        var starty = this.cy + this.height / 2 - this.iconHeight / 2;

        this.icons = [];
        for(i = 0; i < this.spells.length; i++) {
            var icon = new game.HUD.ClickableAnimation(startx, starty, this.spells[i]);
            if (!game.gamemaster.isCanCast(settings.wizard, this.spells[i].type)) {
                icon.alpha = 0.5;
                icon.setFadeout(false);
            }
            this.addChild(icon);
            
            this.icons[i] = icon; // cache

            startx += this.iconWidth + 4;
        }
        // add exit button
        startx += 4;

        this.btnCancel = new game.HUD.ClickableAnimation(startx, starty + 10, {
            image: 'dlg_btn_back',
            width: 38,
            height: 65,
            frames: [0],
            fadeout: false,
            fadeoutspeed: 0.1,
            onClick: function() {
                // disable spells buttons
                for(i = 0; i < parent.spells.length; i++) {
                    parent.icons[i].setClickable(false);
                }
                parent.btnCancel.setClickable(false);

                parent.onEvent('onCancelSelect');
            }
        });
        this.addChild(this.btnCancel);        
    }
});