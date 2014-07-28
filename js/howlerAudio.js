/*
 * MelonJS Game Engine
 * Copyright (C) 2011 - 2013, Olivier BIOT
 * http://www.melonjs.org
 *
 * howler.js Audio plugin
 * https://github.com/goldfire/howler.js
 *
 * Plugin coded by Petar Petrov
 * https://github.com/petarov
 */

/* jshint -W030 */
/* jshint -W083 */

(function(w) {
    
    me.audio = me.audio || {};
    
    /**
     * @class
     * @public
     * @extends me.plugin.Base
     * @memberOf me
     * @constructor
     */
    w.howlerAudio = me.plugin.Base.extend({
        // minimum melonJS version expected
        version: "0.9.10",

        enabled: true,

        sounds: [],

        callbacksRegister: {},

        audioFormat: null,

        /** @ignore */
        init : function(audioFormat) {
            this.parent();
            // parse list of sound formats
            this.reinit(audioFormat);
            //patch patch patch !
            this.patchSystemFn();            
        },

        reinit: function(audioFormat) {
            if (!audioFormat) 
                throw "howlerAudio: audioFormat parameter not specified!";
            
            if (typeof audioFormat !== "string")   {
                // throw "howlerAudio: audioFormat parameter must be string!";
                // if no param is given to init we use ogg by default
                audioFormat = 'ogg';
            }
            // convert it into an array
            this.audioFormat = audioFormat.split(',');
            for (var fmt in this.audioFormat) {
                this.audioFormat[fmt] = '.' + this.audioFormat[fmt];
            }

            return this.enabled;
        },

        load: function(resources) {
            if (!this.enabled)
                return;

            // parse the resources
            var srcUrls = [];

            for(var res in resources) {
                if (resources[res].type === 'audio') {

                    srcUrls.length = 0;
                    for (var i = 0; i < this.audioFormat.length; i++) {
                        srcUrls.push(resources[res].src + resources[res].name + this.audioFormat[i]);
                    }
                    // console.log(srcUrls);
                    // init callback register
                    this.callbacksRegister[resources[res].name] = function() {
                        // empty
                    };
                    // load sound
                    this.sounds[resources[res].name] = new Howl({
                        urls: srcUrls,
                        // volume: Howler.volume(),
                        buffer: resources[res].stream === true ? true : false,
                        onend: this.callbacksRegister[resources[res].name]
                    });
                }
            }
        },
        /**
         * patch system fn to draw debug information
         */
        patchSystemFn: function() {
            var self = this;
            
            me.plugin.patch(me.audio, "enable", function () { 
                self.enabled = true;
            });

            me.plugin.patch(me.audio, "disable", function () { 
                self.enabled = false;
            });

            me.plugin.patch(me.audio, "getCurrentTrack", function () {
                if (!self.enabled) return;
                console.error("howlerAudio: getCurrentTrack() Not implemented!");
            });
            /**
             * @return {Number} current volume value in Float [0.0 - 1.0].
             */
            me.plugin.patch(me.audio, "getVolume", function () {
               if (!self.enabled) return;
                return Howler.volume();
            });

            me.plugin.patch(me.audio, "isAudioEnable", function () {
                return self.enabled;
            });

            me.plugin.patch(me.audio, "mute", function (sound_id, mute) {
                if (!self.enabled) return;
                // self.sounds[sound_id].mute(true);
                self.sounds[sound_id].volume(0);
            });

            me.plugin.patch(me.audio, "muteAll", function () {
                if (!self.enabled) return;
                Howler.mute();
            });

            me.plugin.patch(me.audio, "pause", function (sound_id) {
                if (!self.enabled) return;
                Howler.pause();
            });

            me.plugin.patch(me.audio, "pauseTrack", function () {
                if (!self.enabled) return;
                console.error("howlerAudio: pauseTrack() Not implemented!");
            });
            /**
             * play the specified sound
             * @param  {String}   sound_id audio clip id
             * @param  {Boolean}  loop     loop audio
             * @param  {Function} callback callback function when sound finished playing
             * @param  {Number}   volume   Float specifying volume (0.0 - 1.0 values accepted)
             */
            me.plugin.patch(me.audio, "play", function (sound_id, loop, callback, volume) {
                if (!self.enabled) return;
                
                var snd = self.sounds[sound_id];

                if (loop) {
                    snd.loop(loop);
                }
                if (volume) {
                    snd.volume(volume);
                }

                // TODO: this is not quite correct!
                if (callback) {
                    snd.off('end', self.callbacksRegister[sound_id]);
                    self.callbacksRegister[sound_id] = callback;
                    snd.on('end', self.callbacksRegister[sound_id]);
                }

                return snd.play();
            });

            me.plugin.patch(me.audio, "playTrack", function (sound_id, volume) {
                if (!self.enabled) return;
                console.error("howlerAudio: playTrack() Not implemented!");
            });

            me.plugin.patch(me.audio, "resumeTrack", function (sound_id) {
                if (!self.enabled) return;
                console.error("howlerAudio: resumeTrack() Not implemented!");
            });

            me.plugin.patch(me.audio, "setVolume", function (volume) {
                if (!self.enabled) return;
                Howler.volume(volume);
            });

            me.plugin.patch(me.audio, "stop", function (sound_id) {
                if (!self.enabled) return;
                self.sounds[sound_id].stop();
            }); 

            me.plugin.patch(me.audio, "stopTrack", function () {
                if (!self.enabled) return;
                console.error("howlerAudio: stopTrack() Not implemented!");
            });

            me.plugin.patch(me.audio, "unload", function (sound_id) {
                self.sounds[sound_id] && self.sounds[sound_id].unload();
            }); 

            me.plugin.patch(me.audio, "unloadAll", function () {
                for(var snd in self.sounds) {
                    self.sounds[snd].unload();
                }
            });

            me.plugin.patch(me.audio, "unmute", function (sound_id) {
                if (!self.enabled) return;
                // self.sounds[sound_id].mute(false);
                self.sounds[sound_id].volume(Howler.volume());
            });

            me.plugin.patch(me.audio, "unmuteAll", function () {
                if (!self.enabled) return;
                Howler.unmute();
            });
        }
    });

    /*---------------------------------------------------------*/
    // END END END
    /*---------------------------------------------------------*/
})(window);