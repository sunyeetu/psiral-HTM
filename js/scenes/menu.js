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

    // draw: function(ctx) {
    //     me.video.clearSurface(ctx, 'black'); 
    // },
    /**        
     *  action to perform on state change
     */
    onResetEvent: function() {
        this.hudTitle = new game.MenuScene.HUD.Title(this, {});
        me.game.world.addChild(this.hudTitle);

        // clear transparent background
        this.cls = new game.GFX.ClearScreen();
        me.game.world.addChild(this.cls);        

        // play music
        me.audio.play('elementary_wave', true);
    },
    /**        
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // stop music
        me.audio.stop('elementary_wave');

        this.hudTitle && me.game.world.removeChild(this.hudTitle);
        this.hudChar && me.game.world.removeChild(this.hudChar);
        this.hudChar && me.game.world.removeChild(this.cls);
    },

    /************************************************************************
     * UI Events
     */
    
    onClick_Title: function() {
        me.game.world.removeChild(this.hudChar);
        this.hudChar = null;
        this.hudTitle = new game.MenuScene.HUD.Title(this, {});
        me.game.world.addChild(this.hudTitle);
    },

    onClick_Play: function() {
        me.game.world.removeChild(this.hudTitle);
        this.hudTitle = null;
        this.hudChar = new game.MenuScene.HUD.SelectCharacter(this, {});        
        me.game.world.addChild(this.hudChar);
    },

    onClick_HowTo: function() {
        console.log('howto');
        // TODO
    },

    onClick_StartGame: function(data) {
        game.session.wizard = data[0];
        me.state.change(me.state.PLAY);
    }      
});