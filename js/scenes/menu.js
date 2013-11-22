/**
 * menu.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */
game.MenuScene = me.ScreenObject.extend({

    init: function() {
        // use the update & draw functions
        this.parent(true); 
        // create stuff
        
    },

    draw: function(ctx) {
        me.video.clearSurface(ctx, 'black'); 
    },
    /**        
     *  action to perform on state change
     */
    onResetEvent: function() {
        this.hudTitle = new game.MenuScene.HUD.Title(this, {});
        this.hudChar = new game.MenuScene.HUD.SelectCharacter(this, {});

        me.game.world.addChild(this.hudTitle);
    },
    /**        
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        me.game.world.removeChild(this.hudTitle);
        me.game.world.removeChild(this.hudChar);
    },

    /************************************************************************
     * UI Events
     */
    
    onClick_Play: function() {
        me.game.world.removeChild(this.hudTitle);
        me.game.world.addChild(this.hudChar);
    },

    onClick_HowTo: function() {
        console.log('howto');
    },

    onClick_StartGame: function() {
        console.log('start game');
    }      
});