/**
 * hud.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

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
        this.z = _Globals.gfx.zHUD;

        // give a name
        this.name = "HUD";

        this.x = 0;
        this.y = _Globals.canvas.yOffsetHUD;
        this.xStep = _Globals.canvas.width / 4;

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

        wizards.forEach(function(w) {
            var sprite = new me.AnimationSheet(wx, wy, me.loader.getImage('wizards_faces'), 48);

            switch(w) {
                case _Globals.wizards.Earth:
                    sprite.setAnimationFrame(3);
                break;
                case _Globals.wizards.Water:
                    sprite.setAnimationFrame(1);
                break;
                case _Globals.wizards.Fire:
                    sprite.setAnimationFrame(0);
                break;
                case _Globals.wizards.Air:
                    sprite.setAnimationFrame(2);
                break;
                default:
                    throw "Unknown wizard in HUD!";
                break;
            }  
            
            sprite.animationpause = true;
            sprite.z =  _Globals.gfx.zHUD + 1;
            parent.addChild(sprite);

            wx += parent.xStep;
        });
    }
});
/**
 * Base UI Dialog container 
 */
game.HUD.Container = me.ObjectContainer.extend({
    init: function(eventHandler) {
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
        this.width = 505;
        this.height = 150;
        this.cx = _Globals.canvas.width / 2 - this.width / 2;
        this.cy = _Globals.canvas.height / 2 - this.height / 2;
        this.endx = this.cx + this.width;
        this.endy = this.cy + this.height;
        this.xcenter = this.cx +  this.width / 2;
        this.ycenter = this.cy +  this.height / 2;

        this.imageBackground = new me.SpriteObject(this.cx, this.cy, me.loader.getImage('dialog'));
        this.addChild(this.imageBackground);

        // wizard face
        var slot = "slot_empty";
        switch(game.session.wizard) {
            case _Globals.wizards.Earth:
            slot = 'slot_earth';
            break;
            case _Globals.wizards.Water:
            slot = 'slot_water';
            break;
            case _Globals.wizards.Fire:
            slot = 'slot_fire';
            break;
            case _Globals.wizards.Air:
            slot = 'slot_air';
            break;
        }
        this.imageFaceSlot = new me.SpriteObject(this.cx - 50, this.cy - 50, me.loader.getImage(slot));
        this.imageFaceSlot.z =  _Globals.gfx.zHUD + 1;
        this.addChild(this.imageFaceSlot);

        this.iconWidth = 64;
        this.iconHeight = 64;
    },
    // Propagate UI event to handler
    onEvent: function(name) {
        if (this.eventHandler) {
            console.log(name);
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

        settings.spritewidth = 64;
        settings.spriteheight = 64;
        this.parent(x, y, settings);
        this.z = _Globals.gfx.zHUD + 1;
        this.handler = settings.onClick;
    },
    onClick: function(event) {
        this.handler && this.handler(event);
        // don't propagate the event
        return false;
    }
});
/**
 * Clickable Animation UI element
 */
game.HUD.ClickableAnimation = me.AnimationSheet.extend({
    init: function(x, y, settings, container) {
        this.parent(x, y, me.loader.getImage(settings.image), 64);
        
        this.handler = settings.onClick;
        this.z = _Globals.gfx.zHUD + 5;
        // override animation speed
        this.addAnimation('main', [0, 1, 2, 3, 4, 5], 75);
        this.setCurrentAnimation('main');
        this.fadeout = settings.fadeout || false;
        this.fadeoutspeed = settings.fadeoutspeed || 0.035;
        this.stopFrame = settings.stopFrame || false;
        this.blend = false;

        var parent = this;
        /**
         * We got a lil' hack here due to the fact that clickable animations are not available
         * in MelonJS, yet. So, simply draw a clickable GUI_Object behind the animation. :)
         */
        var dummyClickable = new game.HUD.Clickable(x, y, {
            image: 'button_ok',
            onClick: function(event) {
                container.removeChild(this);

                if (parent.stopFrame) {
                    parent.setAnimationFrame(parent.stopFrame);
                    parent.animationpause = true;
                }

                if (parent.fadeout === true) {
                    parent.blend = true;
                    parent.animationpause = true;
                } else {
                   parent.handler && parent.handler(event); 
                }
            }
        });
        /**
         * Important: This will not be visible to the caller!
         * We rely on the dummyClickable.onClick() to clean it up from the container.
         */
        container.addChild(dummyClickable);
    },
    update: function() {
        this.parent();
        /**
         * Notify caller that animation has been clicked only
         * after the fadeout post animation completes.
         */
        if (this.blend) {
            this.alpha -= this.fadeoutspeed;
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
    init: function(eventHandler) {
        this.parent(eventHandler);

        var parent = this;

        this.addChild(
            new game.HUD.Clickable(this.cx + this.iconWidth * 2, this.cy + this.iconHeight / 2, {
                image: 'icon_chance',
                onClick: function(event) {
                    parent.onEvent('onSelectDice');
                }
            }));
        this.addChild(
            new game.HUD.Clickable(this.endx - this.iconWidth * 3, this.cy + this.iconHeight / 2, {
                image: 'icon_spell',
                onClick: function(event) {
                    parent.onEvent('onSelectSpell');
                }
            }));

        // this.visible = false;
    }
});
/**
 * Dialog: Throw dice 
 */
game.HUD.ThrowDice = game.HUD.Container.extend({
    init: function(eventHandler, extraData) {
        this.parent(eventHandler);

        var parent = this;
        var dx = this.xcenter - this.iconWidth / 2;
        var dy = this.ycenter - this.iconHeight / 2;
        var icon_image;

        switch(extraData.chance) {
            case _Globals.chance.Move1:
                icon_image = 'icon_move1';
            break;
            case _Globals.chance.Move2:
                icon_image = 'icon_move2';
            break;
            case _Globals.chance.Move3:
                icon_image = 'icon_move3';
            break;
            case _Globals.chance.Move4:
                icon_image = 'icon_move4';
            break;
            case _Globals.chance.Jump:
                icon_image = 'icon_jump';
            break;
            case _Globals.chance.Skip:
                icon_image = 'icon_pass';
            break;            
        }

        var icon = new game.HUD.Clickable(dx, dy, {
                image: icon_image,
                onClick: function(event) {
                    parent.onEvent('onDiceThrown');
                }
            });
        // only clickable when the dice side is revealed
        icon.isClickable = false;

        this.diceAnim = new game.HUD.ClickableAnimation(dx, dy, {
            image: 'dice',
            fadeout: true,
            stopFrame: (extraData.chance - 1), // set dice side
            onClick: function(event) {
                parent.diceAnim.animationpause = true;
                parent.addChild(icon);
                icon.isClickable = true;
            }
        }, parent);

        this.addChild(this.diceAnim);
    }
});
/**
 * Dialog: Select spell
 */
game.HUD.SelectSpell = game.HUD.Container.extend({
    init: function(eventHandler) {
        this.parent(eventHandler);

        var parent = this;
        var spells = [
            {
                image: 'icon_spell_abyss', 
                notify: function() {parent.onEvent('onCastSpell', _Globals.spells.Abyss); }
            },
            {
                image: 'icon_spell_change', 
                notify: function() {parent.onEvent('onCastSpell', _Globals.spells.Change); }
            },
            {
                image: 'icon_spell_clay', 
                notify: function() {parent.onEvent('onCastSpell', _Globals.spells.Clay); }
            },
        ];

        var special;
        switch(game.session.wizard) {
            case _Globals.wizards.Earth:
            special = {
                image: 'icon_spell_path',
                notify: function() {parent.onEvent('onCastSpell', _Globals.spells.Path); }
            };
            break;
            case _Globals.wizards.Water:
            special = {
                image: 'icon_spell_blind',
                notify: function() {parent.onEvent('onCastSpell', _Globals.spells.Blind); }
            };
            break;
            case _Globals.wizards.Fire:
            special = {
                image: 'icon_spell_freeze',
                notify: function() {parent.onEvent('onCastSpell', _Globals.spells.Freeze); }
            };
            break;
            case _Globals.wizards.Air:
            special = {
                image: 'icon_spell_teleport',
                notify: function() {parent.onEvent('onCastSpell', _Globals.spells.Teleport); }
            };       
            break;
        }
        spells.push(special);                

        var startx = this.cx + this.iconWidth;

        for(var i = 0; i < spells.length; i++) {
            this.addChild(
                new game.HUD.Clickable(startx, this.cy + this.iconHeight / 2, {
                    image: spells[i].image,
                    onClick: spells[i].notify
                }));
            startx += this.iconWidth + 4;
        }
    }
});