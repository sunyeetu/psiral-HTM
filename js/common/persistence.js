/**
 * persistence.js
 *
 * Copyright (c) 2014 Dvubuz Games
 *
 */

(function Persistence(w) {

    var ls, cs;
    try {
        ls = w.localStorage;
    } catch(e) {
    }
    if (typeof ls === 'undefined') {
        cs = chrome.storage.local;
    }
    var enabled = (typeof cs !== 'undefined' || typeof ls !== 'undefined');

    function _put(key, value) {
        if (ls) {
            ls.setItem(key, JSON.stringify(value));
        } else if (cs) {
            var obj = {};
            obj[key] = value;
            cs.set(obj, function() {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                }
            });
        }
    }
    function _get(key, cb) {
        if (ls) {
            cb(JSON.parse(ls.getItem(key)));
        } else if (cs) {
            cs.get(key, function (result) {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                }
                cb(result);
            });
        }
    }

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

        listener: null,

        init: function(masterKey, cb) {
            if (!enabled) {
                this.reset();
                return;
            }

            // should only be used for unit tests
            if (masterKey) {
                this._KEY = masterKey;
            }
            var self = this;
            _get(this._KEY, function(data) {
                if (!data || (Object.keys(data).length === 0 &&
                  data.constructor === Object)) {
                    self.reset();
                } else {
                    self.data = data;
                }
                cb();
            });
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

            var oldValue = this.data[key];
            this.data[key] = value;

            if (this._autocommit)
                this.commit();

            if (this.listener && oldValue !== value) {
                this.listener(key, value, oldValue);
            }

            return this;
        },

        commit: function() {
            if (!enabled) return;

            _put(this._KEY, this.data);
            return this;
        },

        setListener: function(callback) {
            if (typeof callback === 'function') {
                this.listener = callback;
            }
        }
    };
    Object.defineProperty(_instance, 'autoCommit', {
        get: function() { return _instance._autocommit; },
        set: function(autoCommit) { _instance._autocommit = autoCommit; }
    });
    w.persistence = _instance;
}(window));
