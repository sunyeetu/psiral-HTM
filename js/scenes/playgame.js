/**
 * playgame.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

game.playScene = me.ScreenObject.extend({

    init: function() {



    },

    update: function() {

    },

    draw: function() {

    },

    /**        
    *  action to perform on state change
    */
    onResetEvent: function() {        
        // reset the score
        game.data.score = 0;
        
        // add our HUD to the game world        
        me.game.add(new game.HUD.Container());

        me.levelDirector.loadLevel("terrain01");
    },


    /**        
    *  action to perform when leaving this screen (state change)
    */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(me.game.world.getEntityByProp("name", "HUD")[0]);
    }
});