/**
 * game.js
 *
 * Copyright (c) 2014 Dvubuz Games
 *
 */

var game = {

    onload: function () {

        var el = document.getElementById('quit');
        if (typeof require !== 'undefined') {
            el.addEventListener('click', function() {
                if (el.dataset.confirm === '1') { 
                    //global.window.nwDispatcher.requireNwGui() (see https://github.com/rogerwang/node-webkit/issues/707
                    var gui = require('nw.gui');
                    gui.App.quit();
                } else {
                    el.innerHTML = 'Really Quit?';
                    el.dataset.confirm = '1';
                    setTimeout(function () {
                        el.innerHTML = 'Quit';
                        el.dataset.confirm = '0';
                    }, 3000);
                }
            }, false);
        } else {
            el.style.display = 'none';
        }

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
        me.plugin.register(howlerAudio, "howlerAudio", "ogg,m4a");

        // no audio in debug mode
        if (_Globals.isDebug) {
            me.audio.disable();
        }
        me.plugin.howlerAudio.load(game.resources);

        // Init global locales
        nls.init('en');        

        // Init local storage persistence
        persistence.init(null, function() {
            // start loading as soon as persistance is initialized
            if (!persistence.get(persistence.MUSIC)) {
                game.enableMusic(false);
            }
            if (!persistence.get(persistence.SOUND)) {
                game.enableSounds(false);
            }
                    
            me.state.set(me.state.LOADING, new game.SplashScene());
            me.state.change(me.state.LOADING);
        });
        persistence.setListener(function(key, value) {
            if (key === persistence.MUSIC) {
                game.enableMusic(value);
            } else if (key === persistence.SOUND) {
                game.enableSounds(value);
            }
        });

        me.state.onPause = function() {
            me.audio.muteAll();
        };
        me.state.onResume = function() {
            me.audio.unmuteAll();
        };
    },

    // Run on game resources loaded.
    loaded: function () {
        me.state.set(me.state.MENU, new game.MenuScene());
        me.state.set(me.state.PLAY, new game.PlayScene());

        // setup 
        this.session = {};
        
        if (_Globals.isDebug) {
            this.session.wizard = _Globals.wizards.Air;
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
    },

    enableMusic: function(value) {
        if (value) {
            me.audio.unmute('elementary_wave');
            me.audio.unmute('observingthestar');
            me.audio.unmute('lifeline');
        } else {
            me.audio.mute('elementary_wave');
            me.audio.mute('observingthestar');
            me.audio.mute('lifeline');
        }
    },

    enableSounds: function(value) {
        for (var i = 0, count = game.resources.length; i < count; i++) {
            var res = game.resources[i];
            if (res.type === 'audio' && !res.stream) {
                if (value) {
                    // console.log('unmute', res.name, Howler.volume());
                    me.audio.unmute(res.name);
                } else {
                    // console.log('mute', res.name);
                    me.audio.mute(res.name);
                }
            }
        }
    }
};

/**
 * Clear background. Taken from the following places (with minor adjustments):
 * http://pastie.org/4752451
 * https://groups.google.com/forum/#!searchin/melonjs/transparent$20background/melonjs/9khmjV8ytIo/3H68gG6xycMJ
 */
game.ClearScreen = me.Renderable.extend({
    init: function() {
        // var w = me.device.isMobile ? Math.floor(me.video.getWidth() * 1.99) : me.video.getWidth();
        // var h = me.device.isMobile ? Math.floor(me.video.getHeight() * 1.99) : me.video.getHeight();
        var w = me.video.getWidth();
        var h = me.video.getHeight();
        this.parent(new me.Vector2d(0, 0), w, h);
        this.z = -Infinity;
        this.isPersistent = true;
        this.visible = true;
    },

    update: function() {
        // iOS 6 canvas bugfix
        // http://blog.jackadam.net/2010/the-unfortunate-state-of-canvas-animations-on-the-iphone-ipad/
        if (me.device.isMobile) {
            var canvas = me.video.getScreenCanvas();
            canvas.width = canvas.width + 0;
        }
        return true;
    },

    draw: function(context) {
        context.clearRect(0, 0, this.width, this.height);
    }
});
