/**
 * menu.js
 *
 * Copyright (c) 2014 Dvubuz Games
 *
 */

/* jshint -W030 */

game.MenuScene = me.ScreenObject.extend({

    Screens: {
        Title: "title",
        // Options: "options",
        HowToPlay: "howtoplay",
        SelectCharacter: "selectchar"
    },

    init: function() {
        // use the update & draw functions
        this.parent(true); 
        // create stuff
        this.screens = {};
        this.currentScreen = null;
        this.currentScreenName = null;

        this.screens[this.Screens.Title] = new game.MenuScene.HUD.Title(this, {});
        // this.screens[this.Screens.Options] = new game.MenuScene.HUD.Options(this, {});
        this.screens[this.Screens.SelectCharacter] = new game.MenuScene.HUD.SelectCharacter(this, {});
        this.screens[this.Screens.HowToPlay] = new game.MenuScene.HUD.HowTo(this, {});
    },

    // draw: function(ctx) {
    //     me.video.clearSurface(ctx, 'black'); 
    // },
    /**
     * action to perform on state change
     */
    onResetEvent: function() {
        this.switchScreen(this.Screens.Title);

        // clear transparent background
        this.cls = new game.ClearScreen();
        me.game.world.addChild(this.cls);

        // play music
        me.audio.play('elementary_wave', true);
    },
    /**
     * action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // stop music
        me.audio.stop('elementary_wave');

        this.currentScreen && me.game.world.removeChild(this.currentScreen);
        // remove all screens
        for (var prop in this.screens) {
            this.screens[prop] = null;
        }
    },

    switchScreen: function(screen) {
        if (screen === this.currentScreenName)
            return;

        if (this.currentScreen) {
            me.game.world.removeChild(this.currentScreen, true);
        }

        this.currentScreenName = screen;
        this.currentScreen = this.screens[screen];
        
        _Globals.debug('selected scene:', this.currentScreenName);

        me.game.world.addChild(this.currentScreen);
        this.currentScreen.onResetEvent();
    },

    /************************************************************************
     * UI Events
     */
    
    onClick_Title: function() {
        this.switchScreen(this.Screens.Title);
    },

    onClick_Play: function() {
        this.switchScreen(this.Screens.SelectCharacter);
    },

    onClick_Options: function() {
        this.switchScreen(this.Screens.Options);
    },

    onClick_HowTo: function() {
        this.switchScreen(this.Screens.HowToPlay);
    },

    onClick_StartGame: function(data) {
        game.session.wizard = data[0];
        me.state.change(me.state.PLAY);
    }
});