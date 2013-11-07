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

    debug: false,

    // Run on page load.
    "onload": function () {
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
            this.debug = true;
        }

        // Specify the rendering method for layers 
        // if false, visible part of the layers are rendered dynamically (default)
        // if true, the entire layers are first rendered into an offscreen canvas
        // the "best" rendering method depends of your game
        // (amount of layer, layer size, amount of tiles per layer, etc…)
        // note : rendering method is also configurable per layer by adding this property to your layer (in Tiled)
        me.sys.preRender = false;
        me.sys.gravity = 0;
        me.sys.fps = 40;

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
    "loaded": function () {
        me.state.set(me.state.MENU, new game.SplashScene());
        me.state.set(me.state.PLAY, new game.PlayScene());

        // setup PLAYER 
        this.session = {};
        this.session.wizard = _Globals.wizards.Earth;

        // Start the game.
        me.state.change(me.state.PLAY);
    },
    /**
     * Get X cooridnate relevant to tilemap position
     */
    getRealX: function(x) {
        return _Globals.canvas.xOffset + x;
    },
    /** 
     * Get Y cooridnate relevant to tilemap position
     */
    getRealY: function(y) {
        return _Globals.canvas.yOffset + y;
    }
};
