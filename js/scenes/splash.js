/**
 * splash.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

game.SplashScene = me.ScreenObject.extend({

    init: function() {
        // use the update & draw functions
        this.parent(true); 
    },

    draw: function() {
        me.video.clearSurface(ctx, 'black'); 
    },
    /**        
     *  action to perform on state change
     */
    onResetEvent: function() {        
        ; // TODO
    },
    /**        
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
       ; // TODO
    }
});