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
        
        settings.spritewidth = 56;
        settings.spriteheight = 56;
        x *= _Globals.gfx.tileWidth;
        y *= _Globals.gfx.tileHeight;
        x += _Globals.canvas.xOffset;
        y += _Globals.canvas.yOffset;
        this.parent(x, y, settings);

        this.collidable = false;
        this.z = _Globals.gfx.zActor;
        this.type = 'wizard';
        
        this.mana = _Globals.defaults.mana;
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
     * Props
     */
    
    getMana: function() {
        return this.mana;
    },

    addMana: function(value) {
        this.mana += value;
        this.mana = this.mana > _Globals.defaults.manaMax ? _Globals.defaults.manaMax : this.mana;
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

/**
 * EARTH: Entria-Sil
 */
game.EarthWizardEntity = game.WizardEntity.extend({

    init: function(x, y, settings) {
        settings.image = 'earth_wizard';
        this.parent(x, y, settings);

        // setup props
        this.name = 'Entria-Sil';
        
        // setup animations
        this.renderable.animationspeed = 75; 
        this.renderable.addAnimation('stand_left', [9]);
        this.renderable.addAnimation('stand_right', [27]);
        this.renderable.addAnimation('stand_up', [0]);
        this.renderable.addAnimation('stand_down', [18]);
        this.renderable.addAnimation('walk_up', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
        this.renderable.addAnimation('walk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17]);
        this.renderable.addAnimation('walk_down', [18, 19, 20, 21, 22, 23, 24, 25, 26]);
        this.renderable.addAnimation('walk_right', [27, 28, 29, 30, 31, 32, 33, 34, 35]);

        this.renderable.setCurrentAnimation('stand_right');
    }

});

/**
 * WATER: Azalsor
 */
game.WaterWizardEntity = game.WizardEntity.extend({

    init: function(x, y, settings) {
        settings.image = 'earth_wizard';
        this.parent(x, y, settings);

        // setup props
        this.name = 'Azalsor';
        
        // setup animations
        this.renderable.animationspeed = 175; 
        this.renderable.addAnimation('stand_left', [9]);
        this.renderable.addAnimation('stand_right', [27]);
        this.renderable.addAnimation('stand_up', [0]);
        this.renderable.addAnimation('stand_down', [18]);        
        this.renderable.addAnimation('walk_up', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
        this.renderable.addAnimation('walk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17]);
        this.renderable.addAnimation('walk_down', [18, 19, 20, 21, 22, 23, 24, 25, 26]);
        this.renderable.addAnimation('walk_right', [27, 28, 29, 30, 31, 32, 33, 34, 35]);

        this.renderable.setCurrentAnimation('stand_left');
    }

});

/**
 * FIRE: Valeriya
 */
game.FireWizardEntity = game.WizardEntity.extend({

    init: function(x, y, settings) {
        settings.image = 'earth_wizard';
        this.parent(x, y, settings);

        // setup props
        this.name = 'Valeriya';
        
        // setup animations
        this.renderable.animationspeed = 175; 
        this.renderable.addAnimation('stand_left', [9]);
        this.renderable.addAnimation('stand_right', [27]);
        this.renderable.addAnimation('stand_up', [0]);
        this.renderable.addAnimation('stand_down', [18]);        
        this.renderable.addAnimation('walk_up', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
        this.renderable.addAnimation('walk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17]);
        this.renderable.addAnimation('walk_down', [18, 19, 20, 21, 22, 23, 24, 25, 26]);
        this.renderable.addAnimation('walk_right', [27, 28, 29, 30, 31, 32, 33, 34, 35]);

        this.renderable.setCurrentAnimation('stand_left');
    }

});

/**
 * AIR: Rafel
 */
game.AirWizardEntity = game.WizardEntity.extend({

    init: function(x, y, settings) {
        settings.image = 'earth_wizard';
        this.parent(x, y, settings);

        // setup props
        this.name = 'Rafel';
        
        // setup animations
        this.renderable.animationspeed = 175; 
        this.renderable.addAnimation('stand_left', [9]);
        this.renderable.addAnimation('stand_right', [27]);
        this.renderable.addAnimation('stand_up', [0]);
        this.renderable.addAnimation('stand_down', [18]);        
        this.renderable.addAnimation('walk_up', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
        this.renderable.addAnimation('walk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17]);
        this.renderable.addAnimation('walk_down', [18, 19, 20, 21, 22, 23, 24, 25, 26]);
        this.renderable.addAnimation('walk_right', [27, 28, 29, 30, 31, 32, 33, 34, 35]);

        this.renderable.setCurrentAnimation('stand_right');
    }

});