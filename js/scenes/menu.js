/**
 * menu.js
 *
 * Copyright (c) 2014 Dvubuz Games
 *
 */
game.MenuScene = me.ScreenObject.extend({

    Screens: {
        Title: "title",
        SelectCharacter: "selectchar",
        HowToPlay: "howtoplay"
    },

    init: function() {
        // use the update & draw functions
        this.parent(true); 
        // create stuff
        this.screens = {};
        this.currentScreen = null;
        this.currentScreenName = null;

        this.screens[this.Screens.Title] = new game.MenuScene.HUD.Title(this, {});
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
        // this.hudTitle && me.game.world.removeChild(this.hudTitle);
        // this.hudChar && me.game.world.removeChild(this.hudChar);
        // this.hudChar && me.game.world.removeChild(this.cls);
    },

    switchScreen: function(screen) {
        if (screen === this.currentScreenName)
            return;

        if (this.currentScreen) {
            me.game.world.removeChild(this.currentScreen, true);
        }

        this.currentScreenName = screen;
        this.currentScreen = this.screens[screen];
        console.log('adding ', this.currentScreenName);
        me.game.world.addChild(this.currentScreen);
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
        console.log('Options!');
        // this.switchScreen(this.Screens.SelectCharacter);
    },

    onClick_HowTo: function() {
        this.switchScreen(this.Screens.HowToPlay);
    },

    onClick_StartGame: function(data) {
        game.session.wizard = data[0];
        me.state.change(me.state.PLAY);
    }
});