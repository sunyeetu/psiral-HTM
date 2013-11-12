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
        turn: 0,
        sequence: [_Globals.wizards.Earth, _Globals.wizards.Water, _Globals.wizards.Fire, _Globals.wizards.Air]
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

    function getSpellCost(spell) {
        switch(spell) {
            case _Globals.spells.Abyss:
                return 2;
            case _Globals.spells.Change:
                return 2;
            case _Globals.spells.Clay:
                return 2;
            case _Globals.spells.Blind:
                return 2;
            case _Globals.spells.Freeze:
                return 2;
            case _Globals.spells.Teleport:
                return 2;
            break;
            case _Globals.spells.Path:
                return 2;
        }

        throw "GM: Unknown spell " + spell;
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
            match.move.current = -1;
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

        nextMove: function() {
            console.log('-----------turn start ' +  match.turn + ' --------------------');
            
            if (++match.move.current >= match.sequence.length) {
                match.move.current = 0;
            }
            match.turn++;

            var current = match.sequence[match.move.current];

            // get chance before actually the user requests it
            // this.setData(current, this.Props.LastDice, throwDice());
            wizards[current].lastdice = throwDice();

            if (wizards[current].control == Controls.Human) {
                this.onEvent('onMoveHuman');
            } else if (wizards[current].control == Controls.AI) {
                this.onEvent('onMoveAI');
            } else {
                throw "GM: Invalid actor control!";
            }

            console.log('-----------turn end ' +  (match.turn-1) + ' --------------------');
        },

        getData: function(wizard, what) {
            switch(what) {
                case this.Props.Mana:
                    return wizards[wizard].mana;
                case this.Props.AllDice:
                    return wizards[wizard].log.dice;
                case this.Props.LastDice:
                    console.log('getting chance ' + wizards[wizard].lastdice);
                    return wizards[wizard].lastdice;
                default:
                throw "GM: Sorry, not implemented!"
            }
        },

        setData: function(wizard, what, data) {
            switch(what) {
                case this.Props.Mana:
                    wizards[wizard].mana = data;
                case this.Props.LastMove:
                    wizards[wizard].log.moves.push(data);
                break;
                case this.Props.LastDice:
                    wizards[wizard].lastdice = data;
                    wizards[wizard].log.dice.push(data);
                break;
                default:
                throw "GM: Sorry, not implemented!"
            }            
        },

        isCanCast: function(wizard, spell) {
            var w = wizards[wizard];
            switch(spell) {
                case _Globals.spells.Blind:
                    return wizard == _Globals.wizards.Fire && w.mana >= getSpellCost(spell);
                case _Globals.spells.Freeze:
                    return wizard == _Globals.wizards.Water && w.mana >= getSpellCost(spell);
                case _Globals.spells.Teleport:
                    return wizard == _Globals.wizards.Air && w.mana >= getSpellCost(spell);
                case _Globals.spells.Path:
                    return wizard == _Globals.wizards.Earth && w.mana >= getSpellCost(spell);
                default:
                    return w.mana >= getSpellCost(spell);
            }
            return false;
        },

        doCast: function(wizard, spell) {
            //TODO
            var w = wizards[wizard];
            w.mana -= getSpellCost(spell);
            //TODO save cast in logs
        }
    };
    Object.defineProperty(_instance, 'currentWizard', {
        get: function() { return match.sequence[match.move.current]; }
    });
    Object.defineProperty(_instance, 'currentTurn', {
        get: function() { return match.turn; }
    });

    game.gamemaster = _instance;

}(game || {}));