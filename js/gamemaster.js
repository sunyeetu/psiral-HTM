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
     * This is the Game Master. He doesn't know about your vectors and spritesheets.
     * He knows about logic. He knows what has happened. He knows what will happen.
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

    /**
     * Private routines
     */     

    var wizards = {};
    // var spells = [];
    var match = {
        move: {
            current: 0,
            next: 1
        },
        turn: 0,
        sequence: [_Globals.wizards.Earth, _Globals.wizards.Water, _Globals.wizards.Fire, _Globals.wizards.Air]
    };

    function resetWizard(who) {
        // XXX better way?
        wizards[who] = {};
        wizards[who].control = Controls.AI;
        wizards[who].mana = MaxMana;
        wizards[who].lastdice = 0;
        wizards[who].skipTurnUntil = -1;
        // XXX length = 0
        wizards[who].log = {};
        wizards[who].log.moves = []; 
        wizards[who].log.casts = []; 
        wizards[who].log.dice = [];
        // reset spells
        // spells.length = 0;
    }

    function throwDice() {
        // TODO: increase randomness pool
        var side = Math.floor(Math.random() * 6) + 1;
        return side;
    }

    function getSpellCost(spell) {
        switch(spell) {
            case _Globals.spells.Abyss:
                return 4;
            case _Globals.spells.Change:
                return 5;
            case _Globals.spells.Clay:
                return 3;
            case _Globals.spells.Blind:
                return 6;
            case _Globals.spells.Freeze:
                return 6;
            case _Globals.spells.Teleport:
                return 6;
            case _Globals.spells.Path:
                return 5;
        }
        throw "GM: Unknown spell " + spell;
    }

    function getSpellDuration(spell) {
        switch(spell) {
            case _Globals.spells.Abyss:
                return 2;
            case _Globals.spells.Change:
                return -1;
            case _Globals.spells.Clay:
                return 4;
            case _Globals.spells.Blind:
                return 4;
            case _Globals.spells.Freeze:
                return 4;
            case _Globals.spells.Teleport:
                return -1;
            case _Globals.spells.Path:
                return -1;
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

        WizardsList: [
            _Globals.wizards.Earth,
            _Globals.wizards.Water,
            _Globals.wizards.Fire,
            _Globals.wizards.Air
        ],

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
            match.move.current = match.sequence.length;
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

        getWizardName: function(wizard) {
            switch(wizard) {
                case _Globals.wizards.Earth: return 'Entria-Sil';
                case _Globals.wizards.Fire: return 'Valeriya';
                case _Globals.wizards.Water: return 'Azalsor';
                case _Globals.wizards.Air: return 'Rafel';
            }
        },

        getWizardTile: function(wizard) {
            switch(wizard) {
                case _Globals.wizards.Earth: return game.map.Tiles.Earth;
                case _Globals.wizards.Fire: return game.map.Tiles.Fire;
                case _Globals.wizards.Water: return game.map.Tiles.Water;
                case _Globals.wizards.Air: return game.map.Tiles.Air;
            }
        },        

        nextMove: function() {
            var self = this;

            if (++match.move.current >= match.sequence.length) {
                match.move.current = -1;
                match.turn++;
                _Globals.debug('-----------turn ' +  match.turn + ' start --------------------');

                // check which spells expire
                
                game.map.walkBuffs(function(buff) {
                    if (buff.turn < match.turn) {
                        game.map.restoreTile(buff.x, buff.y);
                        game.map.removeTileBuff(buff.x, buff.y);
                        //TODO: Fix bug with tiles getting full alpha after spell expires
                        self.onEvent('onExpireSpell', buff.type, {x: buff.x, y: buff.y});
                    }
                });
                
                // for (var i = spells.length - 1; i >= 0; i--) {
                //     if (spells[i].turn < match.turn) {
                //         // restore affected tiles
                //         if (spells[i].tiles) {
                //             for (var j = spells[i].tiles.length - 1; j >= 0; j--) {
                //                 game.map.restoreTile(spells[i].tiles[j].x, spells[i].tiles[j].y);
                //             }
                //         }
                //         // notify listener
                //         this.onEvent('onExpireSpell', spells[i].type, spells[i].tiles);
                //         // remove spell
                //         spells.splice(i, 1);
                //     }
                // }
                // notify listener on next game turn
                this.onEvent('onNextTurn', match.turn);
                return;
            }

            var current = match.sequence[match.move.current];

            // get chance before actually the user requests it
            // this.setData(current, this.Props.LastDice, throwDice());
            wizards[current].lastdice = throwDice();
            _Globals.debug('generating chance: ', wizards[current].lastdice);

            if (wizards[current].skipTurnUntil > match.turn || !this.isCanMove(current)) {
                this.onEvent('onSkipMove', current, this.getWizardName(current));
                return;
            }

            if (wizards[current].control == Controls.Human) {
                this.onEvent('onMoveHuman', current, this.getWizardName(current));
            } else if (wizards[current].control == Controls.AI) {
                this.onEvent('onMoveAI', current, this.getWizardName(current));
            } else {
                throw "GM: Invalid actor control!";
            }
        },

        isCanMove: function(who) {
            // check current tile position for blockers
            var pos = game.map.getPos(who);
            var buff = game.map.getTileBuff(pos.x, pos.y);
            if (buff) {
                switch(buff.type) {
                    case _Globals.spells.Freeze:
                        if (who != _Globals.wizards.Water) {
                            return false;
                        }
                    break;                    
                }
            }
            return true;
        },

        getWalkablePath: function(who, steps) {
            var path = game.map.getPath(who, steps);

            // check path for blockers
            for (var i = 0; i < path.length; i++) {
                var buff = game.map.getTileBuff(path[i].x, path[i].y);
                if (buff) {
                    switch(buff.type) {
                        case _Globals.spells.Abyss:
                            path.splice(i);
                            return path;
                        case _Globals.spells.Freeze:
                            if (who != _Globals.wizards.Water) {
                                // make plr step on the first frozen tile found
                                if (i + 1 < path.length) {
                                    path.splice(i + 1);
                                } else {
                                    path.splice(i);
                                }

                                return path;
                            }
                        break;
                    }
                }
            }
            return path;
        },

        setPosition: function(who, pos) {
            game.map.setPos(who, pos.x, pos.y);
            if (game.map.isTile(pos.x, pos.y, game.map.Tiles.Fountain)) {
                // notify
                this.onEvent('onReachGoal', who, this.getWizardName(who));
            }
        },

        isCanCastAt: function(who, spell, x, y) {
            // start places and fountain are not selectable
            if (game.map.isTileSelectable(x, y)) {
                _Globals.debug('nocast: unselectable ', x, y);
                return false;
            }

            if (spell == _Globals.spells.Abyss) {
                // do not allow occupied tiles to be selected
                if (game.map.isTileOccupied(x, y)) {
                    _Globals.debug('nocast: occupied ', x, y);
                    return false;
                }                
            } else if (spell == _Globals.spells.Clay) {
                // cast clay anywhere you want
                return true;
            }

            // cast only on allowed tiles
            var tile = game.map.getTile(x, y);
            var myTile = this.getWizardTile(who);
            if (tile != myTile) {
                if (!game.map.isTile(x, y, this.getWizardTile(who))) {
                    _Globals.debug('nocast: not a wizard tile ', x, y, who);
                    return false;
                }
            }

            return true;
        },

        isCanCast: function(who, spell) {
            var w = wizards[who];
            switch(spell) {
                case _Globals.spells.Blind:
                    return who == _Globals.wizards.Fire && w.mana >= getSpellCost(spell);
                case _Globals.spells.Freeze:
                    return who == _Globals.wizards.Water && w.mana >= getSpellCost(spell);
                case _Globals.spells.Teleport:
                    return who == _Globals.wizards.Air && w.mana >= getSpellCost(spell);
                case _Globals.spells.Path:
                    return who == _Globals.wizards.Earth && w.mana >= getSpellCost(spell);
                default:
                    return w.mana >= getSpellCost(spell);
            }
            return false;
        },

        /**
         * TODO: call below should not be called externally but only via onEvent() proxy
         */

        addMana: function(who, amount) {
            amount = amount ? amount : 1;
            wizards[who].mana += amount;
            wizards[who].mana = Math.min(wizards[who].mana, MaxMana);
        },

        skipTurn: function(who, amount) {
            if (Object.prototype.toString.call(who) === '[object Array]') {
                for (var i = who.length - 1; i >= 0; i--) {
                    this.skipTurn(who[i], amount);
                };
            } else {
                wizards[who].skipTurnUntil = match.turn + amount;
            }
        },

        getData: function(who, what) {
            switch(what) {
                case this.Props.Mana:
                    return wizards[who].mana;
                case this.Props.AllDice:
                    return wizards[who].log.dice;
                case this.Props.LastDice:
                    return wizards[who].lastdice;
                default:
                throw "GM: Sorry, not implemented!"
            }
        },

        setData: function(who, what, data) {
            switch(what) {
                case this.Props.Mana:
                    wizards[who].mana = data;
                case this.Props.LastMove:
                    wizards[who].log.moves.push(data);
                break;
                case this.Props.LastDice:
                    wizards[who].lastdice = data;
                    wizards[who].log.dice.push(data);
                break;
                default:
                throw "GM: Sorry! Not implemented!"
            }            
        },

        doCast: function(who, spell, tiles) {
            var w = wizards[who];
            w.mana -= getSpellCost(spell);
            
            // TODO save cast in wizard logs

            // new spell
            // XXX Note that, unless cloned, this will be ONE object instance assigned below!
            var buff = {
                type: spell,
                turn: match.turn + getSpellDuration(spell)
            };

            switch(spell) {
                case _Globals.spells.Abyss:
                    game.map.setTile(tiles.x, tiles.y, game.map.Tiles.Hole);
                    // set new buff
                    game.map.setTileBuff(tiles.x, tiles.y, buff);
                break;

                case _Globals.spells.Change:
                    var rnd = Math.floor(Math.random() * 4);
                    switch(rnd) {
                        case 0: game.map.setTile(tiles.x, tiles.y, game.map.Tiles.Earth, true); break;
                        case 1: game.map.setTile(tiles.x, tiles.y, game.map.Tiles.Water, true); break;
                        case 2: game.map.setTile(tiles.x, tiles.y, game.map.Tiles.Fire, true); break;
                        case 3: game.map.setTile(tiles.x, tiles.y, game.map.Tiles.Air, true); break;
                        // case 4: game.map.setTile(tiles.x, tiles.y, game.map.Tiles.Frozen, true); break;
                    }
                    // remove previous buff
                    game.map.removeTileBuff(tiles.x, tiles.y);               
                    // spell lasts forever
                    return;

                case _Globals.spells.Clay:
                    game.map.setTile(tiles.x, tiles.y, game.map.Tiles.Clay);
                    // set new buff
                    game.map.setTileBuff(tiles.x, tiles.y, buff);                    
                break;

                case _Globals.spells.Blind:
                    // skip 4 turns
                    game.gamemaster.skipTurn(_.without(this.WizardsList, who), getSpellDuration(spell));
                break;

                case _Globals.spells.Freeze:
                    for (var i = tiles.length - 1; i >= 0; i--) {
                        game.map.setTile(tiles[i].x, tiles[i].y, game.map.Tiles.Frozen);
                        // set new buff
                        game.map.setTileBuff(tiles[i].x, tiles[i].y, _.clone(buff));
                    }
                break;

                case _Globals.spells.Teleport:
                    // nothing
                break;

                case _Globals.spells.Path:
                    for (var i = tiles.length - 1; i >= 0; i--) {
                        game.map.setTile(tiles[i].x, tiles[i].y, game.map.Tiles.Earth, true);
                        // remove previous buff
                        game.map.removeTileBuff(tiles[i].x, tiles[i].y);                        
                    }
                break;
            }
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