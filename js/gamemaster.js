/**
 * gamemaster.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

(function GameMaster(game) {
    /**
     * This is the Game Master. 
     * He knows about logic. He knows what has happened. He knows what will happen.
     * But he doesn't know about your vectors and spritesheets.
     */

    /**
     * Constants
     */
    var MaxMana = 10;

    var Controls = {
        Human: 1,
        AI: 2,
    };

    var AI = {
        Explorer: 1,
        Ruler: 2,
    };

    var wizards = {};

    var match = {
        move: {
            current: 0,
            next: 1
        },
        turn: 0
    };

    /**
     * Private routines
     */    

    function resetWizard(who) {
        // XXX better way?
        wizards[who] = {};
        wizards[who].control = Controls.AI;
        wizards[who].mana = MaxMana;
        // XXX length = 0
        wizards[who].log = {};
        wizards[who].log.moves = []; 
        wizards[who].log.casts = []; 
        wizards[who].log.dice = [];
    }

    /**
     * Public interface
     */    
    var _instance = {
        /**
         * Reset vars and prepare for a new game
         */
        reset: function(playerWizard, handler) {
            resetWizard(_Globals.wizards.Earth);
            resetWizard(_Globals.wizards.Water);
            resetWizard(_Globals.wizards.Fire);
            resetWizard(_Globals.wizards.Air);
            // hi, human!
            wizards[playerWizard].control = Controls.Human;
            // reset match
            match.move.current = _Globals.wizards.Earth;
            match.move.next = _Globals.wizards.Water;
            match.move.last = _Globals.wizards.Air;
            match.turn = 0;
            // propagate events to
            this.eventHandler = handler;
        },
        /** 
         * Propagate UI event to handler
         */
        onEvent: function(name) {
            if (this.eventHandler) {
                this.eventHandler[name].call(this.eventHandler, Array.prototype.slice.call(arguments, 1));
            }
        },

        throwDice: function() {
            // TODO: increase randomness pool
            var side = Math.floor(Math.random() * 6) + 1;
            return side;
        },

        nextMove: function() {
            var current = match.move.current;
            match.move.current = match.move.next;

            switch(match.move.next) {
                case _Globals.wizards.Earth:
                match.move.next = _Globals.wizards.Water;
                break;
                case _Globals.wizards.Water:
                match.move.next = _Globals.wizards.Fire;
                break;
                case _Globals.wizards.Fire:
                match.move.next = _Globals.wizards.Air;
                break;
                case _Globals.wizards.Air:
                match.move.next = _Globals.wizards.Earth;
                break;
            }

            if (wizards[current].control == Controls.Human) {
                var chance = this.throwDice();
                this.onEvent('moveHuman', chance);
            } else if (wizards[current].control == Controls.AI) {
                this.onEvent('moveAI', chance);
            } else {
                throw "Invalid actor control!";
            }
        },

        update: function() {
            if (this.turns.next > this.turns.current) {
                this.execute();
                this.turns.current = this.turns.next;
            }
        }
    };
    game.gamemaster = _instance;

    function Wizard() {

    }

}(game || {}));