/**
 * game.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under a Creative Commons Attribution-NoDerivatives 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/4.0/.
 */

var game = {

    onload: function () {

        if (!me.video.init("screen", _Globals.canvas.width, _Globals.canvas.height, false, 
            me.device.isMobile ? 1.99 : null)) {
            console.error("Your browser does not support HTML5 canvas!");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (document.location.hash === "#debug") {
            window.onReady(function () {
                me.plugin.register.defer(debugPanel, "debug");
            });
            this.debug = _Globals.isDebug;
        }

        // Specify the rendering method for layers 
        // if false, visible part of the layers are rendered dynamically (default)
        // if true, the entire layers are first rendered into an offscreen canvas
        // the "best" rendering method depends of your game
        // (amount of layer, layer size, amount of tiles per layer, etc…)
        // note : rendering method is also configurable per layer by adding this property to your layer (in Tiled)
        me.sys.preRender = false;
        me.sys.gravity = 0;
        me.sys.fps = 60;
        // disable interpolation when scaling
        me.video.setImageSmoothing(false);

        // Disable melonJS audio. This should prevent audio resorce from being loaded.
        me.audio.disable();

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // load game resources
        me.loader.preload(game.resources);

        // register plugins
        me.plugin.register(FnDelay, "fnDelay");

        // register custom Audio plugin
        me.plugin.register(howlerAudio, "howlerAudio", "mp3,ogg");
        if (_Globals.isDebug) {
            // no audio in debug mode
            me.audio.disable();
        }
        me.plugin.howlerAudio.load(game.resources);

        // Init global locales
        nls.init('en');        

        me.state.set(me.state.LOADING, new game.SplashScreen());
        me.state.change(me.state.LOADING);

        me.state.onPause = function() {
            me.audio.muteAll();
        }
        me.state.onResume = function() {
            me.audio.unmuteAll();
        }
    },

    // Run on game resources loaded.
    loaded: function () {
        me.state.set(me.state.MENU, new game.MenuScene());
        me.state.set(me.state.PLAY, new game.PlayScene());

        // setup 
        this.session = {};
        
        if (_Globals.isDebug) {
            this.session.wizard = _Globals.wizards.Water;
            // me.state.change(me.state.MENU);
            me.state.change(me.state.PLAY);
            return;
        }

        me.state.change(me.state.MENU);
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
