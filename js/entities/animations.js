/**
 * animations.js
 *
 * Copyright (c) 2014 Dvubuz Games
 * 
 */

/* jshint -W030 */

game.Animations = game.Animations || {};
game.Animations = _.extend(game.Animations, {
    // types
    Blind: 'blind',
    Teleport: 'teleport',
    // props
    animationSpeed: 75,
    
});

game.Animations.Container = me.ObjectContainer.extend({
    /** 
     * constructor
     */
    init: function() {
        // call the constructor
        this.parent();
        // non collidable
        this.collidable = false;
        // make sure our object is always draw first
        this.z = _Globals.gfx.zAnimation;
        // give a name
        this.name = "Animations";

        // (default) event handler 
        this.eventHandler = null;       
    },

    play: function(anim, x, y, cb) {
        var self = this;

        //TODO: use entityPool instead of (new)

        var entity = new game.Animations.SpellEntity(x, y, {
            animation: anim, 
            callback: function() {
                self.removeChild(entity);
                cb && cb();
            }
        });
        this.addChild(entity);
    },

});


/**
 * Spellcasting animations
 */
game.Animations.SpellEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        settings.image = 'spells';
        settings.spritewidth = 56;
        settings.spriteheight = 56;
        x *= _Globals.gfx.tileWidth;
        y *= _Globals.gfx.tileHeight;
        x += _Globals.canvas.xOffset;
        y += _Globals.canvas.yOffset;
        this.parent(x, y, settings);

        this.collidable = false;
        this.z = _Globals.gfx.zAnimation + 1;
        this.type = 'animation';

        // setup animations
        this.renderable.animationspeed = game.Animations.animationSpeed;
        this.renderable.addAnimation(game.Animations.Teleport, [0, 1, 2, 3, 4, 5, 6, 7]);
        this.renderable.addAnimation(game.Animations.Blind, [0, 1, 2, 3, 4, 5, 6, 7]);

        // play animation
        this.renderable.setCurrentAnimation(settings.animation, function() {
            this.animationpause = true;
            settings.callback && settings.callback();
        });
    }
});