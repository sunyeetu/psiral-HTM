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
            me.device.isMobile ? 1.99 : null)) {

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
        me.sys.fps = 60;
        // disable interpolation when scaling
        me.video.setImageSmoothing(false);        

        // Initialize the audio.
        // me.audio.init("mp3,ogg");
        me.audio.disable();

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload(game.resources);

        // register plugins
        me.plugin.register(FnDelay, "fnDelay");

        // load some sfx
        // me.plugin.register(howlerAudio, "howlerAudio", "ogg,mp3");
        // me.plugin.howlerAudio.load(game.resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);

        // var done = function() {
        //     console.log('ok')
        // };
        // me.audio.play('burp', false, done);
        // me.audio.play('burp', false, function() {
        //     console.log("aghaa");
        // });
        // me.audio.play('burp', false);
        // me.audio.play('song18_0', false);
        
        // game.map.reset(); 
        // game.map.setTileBuffs(4, 3, {type: 'bad', val: 231});
        // var bufs = game.map.getTileBuffs(4, 3);
        // console.log(bufs);
        // console.log(game.map.isTileBuffs(4, 3));
        // console.log(game.map.isTileBuffs(4, 4));
        // console.log(game.map.isTileBuffs(4, 3, 'bad'));

    },

    // Run on game resources loaded.
    "loaded": function () {
        me.state.set(me.state.MENU, new game.MenuScene());
        me.state.set(me.state.PLAY, new game.PlayScene());

        // setup PLAYER 
        this.session = {};
        this.session.wizard = _Globals.wizards.Earth;

        // Start the game.
        me.state.change(me.state.MENU);
        // me.state.change(me.state.PLAY);
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
