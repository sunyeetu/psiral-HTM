/**
 * game.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0
    },
    
    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init("screen", _Globals.canvas.width, _Globals.canvas.height, true, 
            me.device.isMobile ? 2.0 : null)) {

            console.error("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (document.location.hash === "#debug") {
            window.onReady(function () {
                me.plugin.register.defer(debugPanel, "debug");
            });
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload(game.resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },

    // Run on game resources loaded.
    "loaded" : function () {
        me.state.set(me.state.MENU, new game.splashScene());
        me.state.set(me.state.PLAY, new game.playScene());

        // Start the game.
        me.state.change(me.state.PLAY);
    }
};
