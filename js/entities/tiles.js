/**
 * tiles.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

game.TileEntity = me.ObjectEntity.extend({
    
    init: function(x, y, settings) {

        settings.image = 'boardtileset';
        settings.spritewidth = 64;
        settings.spriteheight = 64;
        console.log("x: %s, y: %s", x, y);
        x *= 64;
        y *= 64;

        this.parent(x, y, settings);
        
        // Add the animations
        this.renderable.animationspeed = 250;
        this.renderable.addAnimation('earth', [0, 1, 2, 3, 4, 5, 6, 7]);
        this.renderable.setCurrentAnimation('earth');

    },

    update: function() {
        this.parent();
        return true;
    }

});