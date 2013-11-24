/**
 * l10n.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

(function L10N(w) {

    var en = {
        'menu': {
            "wiz_earth": "Entria posses the ultimate creator knowledge. She has the power to create beings and shape nature in any way she desires.", 
            "wiz_fire": "",
            "wiz_water": "An old and powerful wizard. Rumors are he has been one of the first to roam the young Universe. \
            He destroyed the wizard Carpes, father of Valeriya. Azalsor is a wizard of wisdom and he will not jump into a fight unless he has no other choice.",
            "wiz_air": ""
        }

    };

    var current = null;

    /**
     * Public interface
     */
    var _instance = {
        init: function(locale) {
            console.log(locale);
            switch(locale) {
                case 'en':
                default:
                    current = en;
                return;
            }
            throw locale + " is unsupported locale!";
        },

        get: function(what) {
            var parts = what.split('.');
            var obj = current[parts[0]];
            for (var i = 1; i < parts.length; i++) {
                obj = obj[parts[i]];
                // if (typeof obj !== '[Object object]') {
                // }
            }
            return (obj ? obj : '');
        }
    };
    w.nls = _instance;  
}(window));
