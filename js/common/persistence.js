/**
 * persistence.js
 *
 * Copyright (c) 2014 Dvubuz Games
 *
 */

(function Persistence(w) {

    var ls = w.localStorage;
    var enabled = !!ls;

    var _instance = {
        /**
         * Constants
         */
        _KEY: "psidata",
        SOUND: "sound",
        MUSIC: "music",

        /**
         * Private
         */
        _autocommit: false,

        _data: null,

        init: function(masterKey) {
            if (!enabled) {
                this.reset();
                return;
            }

            // should only be used for unit tests
            if (masterKey) {
                this._KEY = masterKey;
            }

            this.data = ls[this._KEY];
            if (!this.data) {
                this.reset();
            }
        },

        reset: function() {
            // set defaults
            this.data = {};
            this.data[_instance.SOUND] = true;
            this.data[_instance.MUSIC] = true;
            this.commit();
        },

        get: function(key, defValue) {
            var value = this.data[key];
            return value !== null ? value : defValue;
        },

        set: function(key, value) {
            if (!enabled) return;

            this.data[key] = value;
            console.log(this.data);
            
            if (this._autocommit)
                this.commit();

            return this;
        },

        commit: function() {
            if (!enabled) return;

            ls.setItem(this._KEY, JSON.stringify(this.data));
            return this;
        }
    };
    Object.defineProperty(_instance, 'autoCommit', {
        get: function() { return _instance._autocommit; },
        set: function(autoCommit) { _instance._autocommit = autoCommit; }
    }); 
    w.persistence = _instance;
}(window));