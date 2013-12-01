/**
 * l10n.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under a Creative Commons Attribution-NoDerivatives 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/4.0/.
 */

(function L10N(w) {

    var en = {
        'menu': {
            "wiz_earth": "Entria posses the ultimate creator knowledge. She has the power to create \n \
            beings and shape nature in any way she desires. She is the manifestation of life. \n \
            Her eternity is envied by Rafel who secretly plots to destroy her.", 

            "wiz_fire": "The youngest among wizards. Valeriya is the only daughter of Capres, ultimate \n \
            ruler of fire. In the beginning of time, Carpes fought Azalsor but lost. He was \n \
            destroyed but his daughter was saved by the young fires. Now after a thousand \n \
            human years she is ready to challenge Azalsor.",

            "wiz_water": "An old and powerful wizard. Rumors are he has been one of the first to roam \n \
            the young Universe. He destroyed the wizard Carpes, father of Valeriya. \n \
            Azalsor is a wizard of wisdom and he will not jump into a fight unless he has \n \
            no other choice.",

            "wiz_air": "Rafel is a male wizard born out of the fight between Azalsor and Carpes. \n \
            Water and fire clashed and out of the dynamic of the this great battle the wizard \n \
            of air was born. The most beautiful of his kind. He carries the grace of being and \n \
            the seeds of life. But his looks are deceiving. He will absorb the very life out of \n \
            his enemies. He devours their energy in order to content his lust for eternal youth.",

            "select_character": "Choose your character",
            "back": "Back"
        },

        'play': {
            "next_turn": "Turn {} starts",
            "smove": "\'s move",
            "skips_move": " skips this move",
            "no_mana": "Not enough mana to cast!",
            "select_tile": "Select a target tile to cast \n spell on",
            "move1": " moves 1 tile",
            "move2": " moves 2 tiles",
            "numbed": " got numbed. \n Skips 1 move.",
            "mana1": " gains +1 mana",
            "mana2": " gains +2 mana",
            "teleport": " teleports 2 tiles",
            "teleport_blocked": " cannot teleport! \n Blocked.",
            "move_blocked": " cannot move \n ahead! Blocked.",
            "move_2win": " has reached the \n fountain. \n The story ends here.",
            "casts": "{} casts {}"
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
            }
            // format
            if (obj && arguments.length > 1) {
                var args = Array.prototype.slice.call(arguments, 1);
                for (var i = 0; i < args.length; i++) {
                    obj = obj.replace('{}', args[i]);
                }
            }
            return (obj ? obj : '');
        }
    };
    w.nls = _instance;  
}(window));
