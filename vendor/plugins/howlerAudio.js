/*
 * MelonJS Game Engine
 * Copyright (C) 2011 - 2013, Olivier BIOT
 * http://www.melonjs.org
 *
 * howler.js Audio plugin
 * https://github.com/goldfire/howler.js
 *
 * Adapted by Petar Petrov
 */

(function($) {
    
    me.audio = me.audio || {};
    
    /**
     * @class
     * @public
     * @extends me.plugin.Base
     * @memberOf me
     * @constructor
     */
    howlerAudio = me.plugin.Base.extend(
    /** @scope me.plugin.audio.prototype */
    {
        // minimum melonJS version expected
        version: "0.9.10",

        enabled: true,

        sounds: [],

        audioFormat: null,

        /** @ignore */
        init : function(audioFormat) {
            this.parent();

            this.reinit(audioFormat);

            //patch patch patch !
            this.patchSystemFn();            
        },

        reinit: function(audioFormat) {
            if (!audioFormat) 
                throw "howlerAudio: audioFormat parameter not specified!";
            
            if (typeof audioFormat !== "string")   {
                // throw "howlerAudio: audioFormat parameter must be string!";
                // if no param is given to init we use mp3 by default
                audioFormat = 'mp3';
            }
            // convert it into an array
            this.audioFormat = audioFormat.split(',');
            for (fmt in this.audioFormat) {
                this.audioFormat[fmt] = '.' + this.audioFormat[fmt];
            };

            return this.enabled;
        },

        load: function(resources) {
            // parse the resources
            var srcUrls = [];

            for(res in resources) {
                if (resources[res].type == 'audio') {
                    console.log(resources[res]);

                    srcUrls.length = 0;
                    for (var i = 0; i < this.audioFormat.length; i++) {
                        srcUrls.push(resources[res].src + resources[res].name + this.audioFormat[i]);
                    };

                    this.sounds[resources[res].name] = new Howl({
                        urls: srcUrls
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
                // TODO
            });
            /**
             * @return {Number} current volume value in Float [0.0 - 1.0].
             */
            me.plugin.patch(me.audio, "getVolume", function () {
               if (!self.enabled)
                    return;
                return Howler.volume();
            });

            me.plugin.patch(me.audio, "isAudioEnable", function () {
                return enabled;
            });

            me.plugin.patch(me.audio, "mute", function (sound_id, mute) {
                if (!self.enabled)
                    return;
                this.sounds[sound_id].mute();
            });

            me.plugin.patch(me.audio, "muteAll", function () {
                if (!self.enabled)
                    return;
                Howler.mute();
            });

            me.plugin.patch(me.audio, "pause", function (sound_id) {
                if (!self.enabled)
                    return;
                Howler.pause();
            });

            me.plugin.patch(me.audio, "pauseTrack", function () {
                // TODO
            });
            /**
             * play the specified sound
             * @param  {String}   sound_id audio clip id
             * @param  {Boolean}  loop     loop audio
             * @param  {Function} callback callback function when sound finished playing
             * @param  {Number}   volume   Float specifying volume (0.0 - 1.0 values accepted)
             */
            me.plugin.patch(me.audio, "play", function (sound_id, loop, callback, volume) {
                if (!self.enabled)
                    return;
                
                var snd = self.sounds[sound_id];
                loop && snd.loop(loop);
                volume && snd.volume(volume);
                if (callback) {
                    snd.on('end', callback);
                } else {
                    //TODO: FIX event removal
                    snd.off('end', function() {});
                }
                snd.play();
            });

            me.plugin.patch(me.audio, "playTrack", function (sound_id, volume) {
                if (!self.enabled)
                    return;

                // TODO
            });

            me.plugin.patch(me.audio, "resumeTrack", function (sound_id) {
                // TODO
            });

            me.plugin.patch(me.audio, "setVolume", function (volume) {
                if (!self.enabled)
                    return;
                Howler.volume(volume);
            });

            me.plugin.patch(me.audio, "stop", function (sound_id) {
                if (!self.enabled)
                    return;
                self.sounds[sound_id].stop();
            }); 

            me.plugin.patch(me.audio, "stopTrack", function () {
                // TODO
            });

            me.plugin.patch(me.audio, "unload", function (sound_id) {
                self.sounds[sound_id] && self.sounds[sound_id].unload();
            }); 

            me.plugin.patch(me.audio, "unloadAll", function () {
                for(snd in sounds) {
                    sounds[snd].unload();
                }
            });

            me.plugin.patch(me.audio, "unmute", function (sound_id) {
                if (!self.enabled)
                    return;
                this.sounds[sound_id].unmute();
            });

            me.plugin.patch(me.audio, "unmuteAll", function () {
                if (!self.enabled)
                    return;
                Howler.unmute();
            });
        }
    });

    /*---------------------------------------------------------*/
    // END END END
    /*---------------------------------------------------------*/
})(window);
