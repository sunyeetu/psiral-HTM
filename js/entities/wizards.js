/**
 * wizards.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

game.WizardEntity = me.ObjectEntity.extend({
    /** 
     * constructor
     */
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.setVelocity(1, 1);
        this.collidable = false;
        this.z = 19000;
    },

    /**
     * update function
     */
    update : function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        // if (this.score !== game.data.score) {        
        //         this.score = game.data.score;
        //         return true;
        // }
        // 
        // check & update player movement
        // this.updateMovement();

        // console.log('sd');

        this.parent();
        return true;
    },

    /**
     * Events handling
     */
    
    onMove: function(path) {
        //TODO:
    },

    onCastSpell: function(target) {

    },



});

game.EarthWizardEntity = game.WizardEntity.extend({

    init: function(x, y, settings) {
        settings.image = 'earth_wizard';
        settings.spritewidth = 64;
        settings.spriteheight = 64;
        // x = 64;
        // y = 64;
        this.parent(x, y, settings);
        
        // setup animations
        this.renderable.animationspeed = 75; // + Math.random() * 200;
        this.renderable.addAnimation('walk_up', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
        this.renderable.addAnimation('walk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17]);
        this.renderable.addAnimation('walk_down', [18, 19, 20, 21, 22, 23, 24, 25, 26]);
        this.renderable.addAnimation('walk_right', [27, 28, 29, 30, 31, 32, 33, 34, 35]);
        this.renderable.setCurrentAnimation('walk_right');
    },

    // update: function() {
    //     console.log('sdf');
    //     return this.parent();
    // }

});