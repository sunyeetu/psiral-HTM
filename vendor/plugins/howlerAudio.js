/*
 * MelonJS Game Engine
 * Copyright (C) 2011 - 2013, Olivier BIOT
 * http://www.melonjs.org
 *
 * howler.js Audio plugin
 *
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
    /** @scope me.debug.Panel.prototype */
    {
        // minimum melonJS version expected
        version: "0.9.10",

        enabled: true,

        sounds: [],

        /** @ignore */
        init : function() {
            this.parent();

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
        patchSystemFn : function() {
            var self = this;
            
            me.plugin.patch(me.audio, "enable", function () { 
                self.enabled = true;
            });

            me.plugin.patch(me.audio, "disable", function () { 
                self.enabled = false;
            });

            me.plugin.patch(me.audio, "play", function (sound_id, loop, callback, volume) {
                if (!self.enabled)
                    return;
                
                self.sounds[sound_id].play();
            });                       
        }
    });


    /*---------------------------------------------------------*/
    // END END END
    /*---------------------------------------------------------*/
})(window);
