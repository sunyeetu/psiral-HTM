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
        this.dialog_background = new me.SpriteObject(this.cx, this.cy, me.loader.getImage("dialog"));
        this.addChild(this.dialog_background);

        this.iconWidth = 64;
        this.iconHeight = 64;
    },

    // XXX: there must be a better way to pass handlers than this!
    setEventHandler: function(eventHandler) {
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
 * Select Chance or Spell dialog
 */
game.HUD.PlayerTurnDialog = game.HUD.Container.extend({
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
 * Dialog Background
 */
game.HUD.DialogXX = me.Renderable.extend({        
    /** 
     * constructor
     */
    init: function(x, y) {
        // call the parent constructor 
        // (size does not matter here)
        this.parent(new me.Vector2d(x, y), 10, 10); 
        // make sure we use screen coordinates
        this.floating = true;
        this.z = Infinity;

        this.sprite = new me.SpriteObject(x, y, me.loader.getImage("dialog"));
        me.game.world.addChild(this.sprite);
    },

    /**
     * update function
     */
    update: function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        // if (this.score !== game.data.score) {        
        //         this.score = game.data.score;
        //         return true;
        // }
        return true;
    },

});