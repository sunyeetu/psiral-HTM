/**
 * l10n.js
 *
 * Copyright (c) 2014 Dvubuz Games
 *
 */

/* jshint -W086 */

(function L10N(w) {

    var en = {
        'menu': {
            "wiz_earth": "Entria posses the ultimate creator knowledge. She has the power to create \n" +
            "beings and shape nature in any way she desires. She is the manifestation of life. \n" +
            "Her eternity is envied by Rafel who secretly plots to destroy her.", 

            "wiz_fire": "The youngest among wizards. Valeriya is the only daughter of Carpes, ultimate \n" +
            "ruler of fire. In the beginning of time, Carpes fought Azalsor but lost. He was \n" +
            "destroyed but his daughter was saved by the young fires. Now after a thousand \n" + 
            "human years she is ready to challenge Azalsor.",

            "wiz_water": "An old and powerful wizard. Rumors are he has been one of the first to roam \n" +
            "the young Universe. He destroyed the wizard Carpes, father of Valeriya. \n" +
            "Azalsor is a wizard of wisdom and he will not jump into a fight unless he has \n" +
            "no other choice.",

            "wiz_air": "Rafel is a male wizard born out of the fight between Azalsor and Carpes. \n" +
            "Water and fire clashed and out of the dynamic of the this great battle the wizard \n" +
            "of air was born. The most beautiful of his kind. He carries the grace of being and \n" +
            "the seeds of life. But his looks are deceiving. He will absorb the very life out of \n" +
            "his enemies. He devours their energy in order to content his lust for eternal youth.",

            "select_character": "Choose your wizard",
            "back": "Back",

            "howto_turns_title": "Turns \n \n",
            "howto_turns": "Game starts with the four wizards positioned at each of the corners of the board. \n" +
            "The goal is to reach the fountain of endless energy in the center of the board. \n" +
            "Wizards move only forward on predefined spiral-alike paths. Paths can be seen on each player's move. \n" +
            "On each turn, players can choose whether to throw the dice of chance or cast a spell. \n",

            "howto_chance_title": "Chance \n \n",
            "howto_chance": "Throw the dice and let Chance determines what happens next. \n ",
            "howto_chance_texts": [
                "Move 1 tile ahead",
                "Move 2 tiles ahead",
                "Skip 1 turn",
                "Mana +1",
                "Mana +2",
                "Jump 2 tiles ahead. \nIf destination tile is Abyss, teleport\nwill fail.",
            ],

            "howto_spells_mana_title": "Spells & Mana \n \n",
            "howto_spells_mana": "Each wizard starts with 10 points of mana. Mana does not replenish over time! \n" +
            "The only way to replenish mana is to get +1 or +2 mana when throwing the dice. \n" +
            "Wizards have two types of spells available - common and special. Common can be casted by all wizards \n" +
            "and special is a spell available only to a particular wizard. \n \n",

            "howto_rules": "Rules \n \n",
            "howto_rules_texts": [
                "Creates a hole on a target tile. Rival players\ncannot cross that tile unless they jump.\n(Costs 4 Mana)",
                "Wizards that stand on this tile are immune\nto any spell.\n(Costs 3 Mana)",
                "All types of spells can be casted upon\nwizards standing on this tile.\n(Costs 2 Mana)",
                "Makes 4 tiles ahead of the wizard Earth tiles.\nNo buffs can be casted.\n(Costs 5 Mana) (Entria-Sil)",
                "Wizards standing on water tile or stepping\non frozen tiles will skip 3 complete turns.\n(Costs 6 Mana) (Azalsor)",
                "Blinds all rival wizards. They will skip 3\ncomplete turns.\n(Costs 6 Mana) (Valeriya)",
                "Teleports wizard 3 tiles ahead. If destination\ntile has Abyss casted on it," +
                "the wizard will\nteleport to the previous tile.\n(Costs 7 Mana) (Rafel)",
            ],
   
            "howto_story_title": "Story \n \n",
            "howto_story": "It is very rare for humans to achieve the status of a higher being. This requires absolute devotion to the ethereal. \n" +
            "To the very fabrics that space constitutes of. Those who learn how to thread these fabrics, \n" +
            "twist them and control them, will then get elevated closer to the higher presence. \n",

            "how_to_play_title": "How to play"
        },

        'play': {
            "next_turn": "Turn {} starts",
            "smove": "\'s move",
            "skips_move": " skips this move",
            "no_mana": "Not enough mana to cast!",
            "select_tile": "Select a target tile to cast \n spell on. \n (Click here to cancel)",
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
            var i;
            var parts = what.split('.');
            var obj = current[parts[0]];
            
            for ( i = 1; i < parts.length; i++) {
                obj = obj[parts[i]];
            }
            
            // format
            if (obj && arguments.length > 1) {
                var args = Array.prototype.slice.call(arguments, 1);
                for (i = 0; i < args.length; i++) {
                    obj = obj.replace('{}', args[i]);
                }
            }
            return (obj ? obj : '');
        }
    };
    w.nls = _instance;  
}(window));
