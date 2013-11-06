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
        wizards[who].lastdice = 0;
        // XXX length = 0
        wizards[who].log = {};
        wizards[who].log.moves = []; 
        wizards[who].log.casts = []; 
        wizards[who].log.dice = [];
    }

    function throwDice() {
        // TODO: increase randomness pool
        var side = Math.floor(Math.random() * 6) + 1;
        return side;
    }

    /**
     * Public interface
     */    
    var _instance = {

        Props: {
            Mana: 'mana',
            AllMoves: 'moves',
            LastMove: 'lastmove',
            AllCasts: 'casts',
            LastCast: 'lastcast',
            AllDice: 'dice',
            LastDice: 'lastdice'
        },

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

        // getChanceFrom: function(dice) {
        //     switch(dice) {
        //         case 1: return _Globals.chance.Move1;
        //         case 2: return _Globals.chance.Move2;
        //         case 3: return _Globals.chance.Move3;
        //         case 4: return _Globals.chance.Move4;
        //         case 5: return _Globals.chance.Jump;
        //         case 6: return _Globals.chance.Skip;
        //         default:
        //             throw dice + " is not a valid chance!";
        //         break;
        //     }
        // },

        nextMove: function() {
            console.log('-----------next turn--------------------');
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

            // get chance before actually the user requests it
            // this.setData(current, this.Props.LastDice, throwDice());
            wizards[current].lastdice = throwDice();

            if (wizards[current].control == Controls.Human) {
                this.onEvent('moveHuman');
            } else if (wizards[current].control == Controls.AI) {
                this.onEvent('moveAI');
            } else {
                throw "Invalid actor control!";
            }
        },

        getData: function(wizard, what) {
            switch(what) {
                case this.Props.AllDice:
                    return wizards[wizard].log.dice;
                case this.Props.LastDice:
                    console.log('getting chance ' + wizards[wizard].lastdice);
                    return wizards[wizard].lastdice;
                default:
                throw "Sorry, not implemented!"
            }
        },

        setData: function(wizard, what, data) {
            switch(what) {
                case this.Props.LastMove:
                    wizards[wizard].log.moves.push(data);
                break;
                case this.Props.LastDice:
                    wizards[wizard].lastdice = data;
                    wizards[wizard].log.dice.push(data);
                break;
                default:
                throw "Sorry, not implemented!"
            }            
        }
    };
    game.gamemaster = _instance;

    function Wizard() {

    }

}(game || {}));