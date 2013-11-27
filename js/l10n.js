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
            "wiz_earth": "Entria posses the ultimate creator knowledge. She has the power to create beings \n \
            and shape nature in any way she desires. She is the manifestation of life. \n \
            Her eternity is envied by Rafel who secretly plots to destroy her.", 

            "wiz_fire": "The youngest among wizards. Valeriya is the only daughter of Capres, ultimate \n \
            ruler of fire. In the beginning of time, Carpes fought Azalsor but lost. \n \
            He was destroyed but his daughter was saved by the young fires. \n \
            Now after a thousand human years she is ready to challenge Azalsor.",

            "wiz_water": "An old and powerful wizard. Rumors are he has been one of the first to roam \n \
            the young Universe. He destroyed the wizard Carpes, father of Valeriya. \n \
            Azalsor is a wizard of wisdom and he will not jump into a fight unless \n \
            he has no other choice.",

            "wiz_air": "Rafel is a male wizard born out of the fight between Azalsor and Carpes. \n \
            Water and fire clashed and out of the dynamic of the this great battle the wizard \n \
            of air was born. The most beautiful of his kind. He carries the grace of being and \n \
            the seeds of life. But his looks are deceiving. He will absorb the very life out of his \n \
            enemies. He devours their energy in order to content his lust for eternal youth.",

            "select_character": "Choose your character"
        }
    };

    var current = null;

    /**
     * Public interface
     */
    var _instance = {
        init: function(locale) {
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
