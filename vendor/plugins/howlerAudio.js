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

            if (!audioFormat) 
                throw "howlerAudio: audioFormat parameter not specified!";

            this.audioFormat = audioFormat;
            //TODO validate

            //patch patch patch !
            this.patchSystemFn();            
        },

        load: function(resources) {
            // parse the resources
            for(res in resources) {
                if (resources[res].type == 'audio') {
                    console.log(resources[res]);

                    this.sounds[resources[res].name] = new Howl({
                        urls: [resources[res].src + resources[res].name + '.ogg']
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
                // TODO
            });

            me.plugin.patch(me.audio, "isAudioEnable", function () {
                return enabled;
            });

            me.plugin.mute(me.audio, "mute", function (sound_id) {
                // TODO
            });

            me.plugin.mute(me.audio, "muteAll", function () {
                // TODO
            });

            me.plugin.mute(me.audio, "pause", function (sound_id) {
                // TODO
            });

            me.plugin.mute(me.audio, "pauseTrack", function () {
                // TODO
            });

            me.plugin.patch(me.audio, "play", function (sound_id, loop, callback, volume) {
                if (!self.enabled)
                    return;
                
                self.sounds[sound_id].play();
            });

            me.plugin.patch(me.audio, "playTrack", function (sound_id, volume) {
                // TODO
            });

            me.plugin.patch(me.audio, "resumeTrack", function (sound_id) {
                // TODO
            });

            me.plugin.patch(me.audio, "setVolume", function (volume) {
                // TODO
            });

            me.plugin.patch(me.audio, "stop", function (sound_id) {
                // TODO
            }); 

            me.plugin.patch(me.audio, "stopTrack", function () {
                // TODO
            });

            me.plugin.patch(me.audio, "unload", function (sound_id) {
                // TODO
            }); 

            me.plugin.patch(me.audio, "unloadAll", function () {
                // TODO
            });

            me.plugin.patch(me.audio, "unmute", function (sound_id) {
                // TODO
            });

            me.plugin.patch(me.audio, "unmuteAll", function () {
                // TODO
            });
        }
    });

    /*---------------------------------------------------------*/
    // END END END
    /*---------------------------------------------------------*/
})(window);
