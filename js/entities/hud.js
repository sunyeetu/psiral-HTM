/**
 * hud.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

game.HUD = game.HUD || {};

game.HUD.Container = me.ObjectContainer.extend({

    init: function() {
        // call the constructor
        this.parent();
        
        // persistent across level change
        this.isPersistent = true;
        
        // non collidable
        this.collidable = false;
        
        // make sure our object is always draw first
        this.z = _Globals.gfx.zHUD;

        // give a name
        this.name = "HUD";

        // (default) event handler 
        this.eventHandler = null;

        // background
        this.cx = _Globals.canvas.width / 2 - 505 / 2;
        this.cy = _Globals.canvas.height / 2 - 150 / 2;
        this.endx = this.cx + 505;
        this.endy = this.cy + 150;
        this.imageBackground = new me.SpriteObject(this.cx, this.cy, me.loader.getImage("dialog"));
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

    // XXX: there must be a better way to pass handlers than this!
    setup: function(eventHandler) {
        this.eventHandler = eventHandler;
    },
    // Propagate UI event to handler
    onEvent: function(name) {
        if (this.eventHandler) {
            this.eventHandler[name].call(this.eventHandler, Array.prototype.slice.call(arguments, 1));
        }
    }
});
/**
 * Clickable icon or button UI element
 */
game.HUD.Clickable = me.GUI_Object.extend({   
    init:function(x, y, settings) {
        settings = settings || {};
        settings.image = settings.image || "button_empty";
        settings.spritewidth = 64;
        settings.spriteheight = 64;
        this.parent(x, y, settings);
        this.z = _Globals.gfx.zHUD + 1;
        this.handler = settings.onClick;
    },
    onClick:function(event) {
        if (this.handler)
            this.handler(event);
        // don't propagate the event
        return false;
    }
});
/**
 * Dialog: Select Chance or Spell dialog
 */
game.HUD.PlayerTurn = game.HUD.Container.extend({
    init: function() {
        this.parent();

        var parent = this;

        this.addChild(
            new game.HUD.Clickable(this.cx + this.iconWidth * 2, this.cy + this.iconHeight / 2, {
                image: 'icon_chance',
                onClick: function(event) {
                    parent.onEvent('onSelectChance');
                }
            }));
        this.addChild(
            new game.HUD.Clickable(this.endx - this.iconWidth * 3, this.cy + this.iconHeight / 2, {
                image: 'icon_spell',
                onClick: function(event) {
                    parent.onEvent('onSelectSpell');
                }
            }));
    }
});
/**
 * Dialog: Throw dice 
 */
game.HUD.PlayerThrowDice = game.HUD.Container.extend({
    init: function() {
        this.parent();

        var parent = this;

        this.addChild(
            new game.HUD.Clickable(this.cx + this.iconWidth * 2, this.cy + this.iconHeight / 2, {
                image: 'icon_chance',
                onClick: function(event) {
                    parent.onEvent('onSelectChance');
                }
            }));
        this.addChild(
            new game.HUD.Clickable(this.endx - this.iconWidth * 3, this.cy + this.iconHeight / 2, {
                image: 'icon_spell',
                onClick: function(event) {
                    parent.onEvent('onSelectSpell');
                }
            }));
    }
});
/**
 * Dialog: Select spell
 */
game.HUD.PlayerSelectSpell = game.HUD.Container.extend({
    init: function() {
        this.parent();

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

        var startx = this.cx + 64;

        for(var i = 0; i < spells.length; i++) {
            this.addChild(
                new game.HUD.Clickable(startx, this.cy + this.iconHeight / 2, {
                    image: spells[i].image,
                    onClick: spells[i].notify
                }));
            startx += 64 + 4;
        }
    }
});