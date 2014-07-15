/**
 * gamemaster.js
 *
 * Copyright (c) 2014 Dvubuz Games
 *
 */

/* jshint -W086 */

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
        var side = Math.floor(Math.random() * 8) + 1;
        // double the chance to get move1 or mana1
        switch(side) {
            case 7: return 1;
            case 8: return 4;
        }
        // chance: {
        //     Move1: 1,
        //     Move2: 2,
        //     Numb: 3,
        //     Mana1: 4,
        //     Mana2: 5,
        //     Jump: 6,
        // },
        return side;
    }

    function getSpellCost(spell) {
        switch(spell) {
            case _Globals.spells.Abyss: return 4;
            case _Globals.spells.Stone: return 3;
            case _Globals.spells.Clay: return 2;
            case _Globals.spells.Blind: return 6;
            case _Globals.spells.Freeze: return 6;
            case _Globals.spells.Teleport: return 7;
            case _Globals.spells.Path: return 5;
        }
        throw "GM: Unknown spell " + spell;
    }

    function getSpellDuration(spell) {
        switch(spell) {
            case _Globals.spells.Abyss: return 3;
            case _Globals.spells.Stone: return 3;
            case _Globals.spells.Clay: return 2;
            case _Globals.spells.Blind: return 3;
            case _Globals.spells.Freeze: return 3;
            case _Globals.spells.Teleport: return -1;
            case _Globals.spells.Path: return 3;
        }
        throw "GM: Unknown spell " + spell;
    }

    /**
     * Plain, old, FSM AI impl.
     * Ref: 
     *   AI decisions are described under chapter [2.5 AI] in the game spec.
     */
    var _ai = {

        paths: {},

        rivals: null,

        dist_13: 27, // ⅓ of the path passed
        dist13: 14, // ⅓ path

        init: function(gamemaster) {
            this.gm = gamemaster;
            this.rivals = {};
            this.rivals[_Globals.wizards.Earth] = _Globals.wizards.Air;
            this.rivals[_Globals.wizards.Air] = _Globals.wizards.Earth;
            this.rivals[_Globals.wizards.Water] = _Globals.wizards.Fire;
            this.rivals[_Globals.wizards.Fire] = _Globals.wizards.Water;
        },

        decide: function(who) {
            this._analyse();
            switch(who) {
                case _Globals.wizards.Earth: return this._earth();
                case _Globals.wizards.Water: return this._water();
                case _Globals.wizards.Fire: return this._fire();
                case _Globals.wizards.Air: return this._air();
                default:
                    throw "GM: In _ai, Invalid wizard - " + who;
            }
        },

        _analyse: function() {
            this.paths[_Globals.wizards.Earth] = game.map.getPath(_Globals.wizards.Earth);
            this.paths[_Globals.wizards.Water] = game.map.getPath(_Globals.wizards.Water);
            this.paths[_Globals.wizards.Fire] = game.map.getPath(_Globals.wizards.Fire);
            this.paths[_Globals.wizards.Air] = game.map.getPath(_Globals.wizards.Air);
        },
        /**
         * 2.5.1 Common decisions
         */
        _common: function(who, enemies) {
            var path, casts, i, j;
            var pos = game.map.getPos(who);
            var decision = {};
            decision.dice = false;
            decision.pos = pos;
            
            _Globals.debug('AI: mana ', who, wizards[who].mana);

            /**
             * 2.5.1.1 Passive
             */

            if (wizards[who].mana < 3) {
                // if no mana available or it is too low (< 3) just throw the dice.
                decision.dice = true;
                return decision;
            }
            //TODO: review casts and costs!

            // XXX: TESTS REMOVE
            // decision.dice = true;
            // return decision;

            var nextTile = game.map.getNextMove(who, 1);

            // if next walkable tile is Abyss just throw the dice. 
            if (path && game.map.isTile(nextTile.x, nextTile.y, game.map.Tiles.Abyss)) {
                decision.dice = true;
                return decision;
            }

            /**
             * 2.5.1.2 Offensive
             */
            
            // Find the first rival (primary has precedence) that has 4 or less tiles left to reach the fountain
            // console.log('AI: ' + who + ' searches ------------------------');
            var target;
            for (i = enemies.length - 1; i >= 0; i--) {
                if (this.paths[enemies[i]].length <= 5) {
                    // console.log(enemies[i] + ' is close');
                    if (!target || enemies[i] === this.rivals[who]) {
                        // take into account if any abyss spells are already casted on enemy path
                        if (!game.map.isTileOnPath(this.paths[enemies[i]], _Globals.spells.Abyss)) {
                            // console.log('found ' + enemies[i]);
                            target = enemies[i];
                        }
                    }
                    
                }
            }
            if (target) {
                path = this.paths[target];
                casts = [_Globals.spells.Abyss, _Globals.spells.Clay];

                for (j = 0; j < casts.length; j++) {
                    // TODO: optimize loops
                    for (i = 0; i < path.length; i++) {
                        if (this.gm.isCanCastAt(who, casts[j], path[i].x, path[i].y)) {

                            decision.cast = true;
                            decision.spell = {
                                type: casts[j],
                                where: path[i]
                            };
                            return decision;
                        }
                    }
                }
            }

            // Find the first rival (primary has precedence) that’s moved ⅓ of the way to the fountain. 
            target = undefined;
            for (i = enemies.length - 1; i >= 0; i--) {
                if (this.paths[enemies[i]].length <= this.dist_13) { 
                    // console.log(enemies[i] + ' is close');
                    if (!target || enemies[i] === this.rivals[who]) {
                        // take into account if any abyss spells are already casted on enemy path
                        if (!game.map.isTileOnPath(this.paths[enemies[i]], _Globals.spells.Abyss)) {
                            // console.log('found ' + enemies[i]);
                            target = enemies[i];
                        }
                    }
                    
                }
            }
            if (target) {
                path = this.paths[target];
                if (path.length >= 2) {
                    casts = [_Globals.spells.Abyss, _Globals.spells.Clay];
                    var len = Math.min(path.length - 1, 2);

                    for (i = 0; i <= len; i++) {
                        if (this.gm.isCanCastAt(who, _Globals.spells.Abyss, path[i].x, path[i].y)) {

                            decision.cast = true;
                            decision.spell = {
                                type: _Globals.spells.Abyss,
                                where: path[i]
                            };
                            return decision;
                        }
                    }
                }
            }

            /**
             * 2.5.1.3 Defensive
             */
            
            path = this.paths[who];

            // Cast Stone if 2 tiles before reaching the fountain and Mana > 3
            if (path.length <= 3) {
                for (i = 0; i < path.length; i++) {
                    if (!game.map.isTile(path[i].x, path[i].y, game.map.Tiles.Stone) && 
                        this.gm.isCanCastAt(who, _Globals.spells.Stone, path[i].x, path[i].y)) {

                        decision.cast = true;
                        decision.spell = {
                            type: _Globals.spells.Stone,
                            where: path[i]
                        };
                        return decision;
                    }
                }
            }

            // Check if next tile is Frozen. Cast Stone if Mana > 3 
            // TODO: find first 2 tiles?
            var tile = game.map.findFirstTile(path, game.map.Tiles.Frozen, 1);
            if (tile && who !== _Globals.wizards.Water) {
                var cast;
                cast = (this.gm.isCanCast(who, _Globals.spells.Clay)) ? _Globals.spells.Clay : cast;
                cast = (this.gm.isCanCast(who, _Globals.spells.Stone)) ? _Globals.spells.Stone : cast;
                
                //TODO: maybe get next tile and check if a lesser spell like Clay can be caseted

                if (cast) {
                    decision.cast = true;
                    decision.spell = {
                        type: cast,
                        where: tile
                    };
                    return decision;
                }
            }

            // default - throw dice
            decision.dice = true;

            return decision;
        },
        /**
         * 2.5.2 Earth (Entria-Sil)
         */
        _earth: function() {
            var who = _Globals.wizards.Earth;
            var enemies = _.without(this.gm.WizardsList, who);
            var decision = this._common(who, enemies);

            // Cast Path, if path to fountain is less than 4 tiles ahead.
            if (decision.dice && this.gm.isCanCast(who, _Globals.spells.Path)) {
                var pathSpell = _.extend(_.clone(decision), {
                    cast: true,
                    spell: {
                        type: _Globals.spells.Path,
                        // where: null
                    }
                });

                var path = this.paths[who];
                if (path.length <= 5) {
                    if (game.map.isTileOnPath(path, game.map.Tiles.Abyss))
                        return pathSpell;
                }
            }

            //TODO:
            
            return decision;
        },
        /**
         * 2.5.3 Water (Azalsor)
         */
        _water: function() {
            var who = _Globals.wizards.Water;
            var enemies = _.without(this.gm.WizardsList, who);
            var decision = this._common(who, enemies);

            // if (decision.dice)
            //     return decision;

            // If all 3 rivals stand on water tiles 
            // Check if primary rival is on Water and if the others will reach Water in 2 tiles
            if (this.gm.isCanCast(who, _Globals.spells.Freeze)) {
                var freeze = _.extend(_.clone(decision), {
                    cast: true,
                    spell: {
                        type: _Globals.spells.Freeze,
                        // where: null
                    }
                });

                // console.log('casting freeze');
                var count = 0;
                var isTarget = false;
                for (var i = enemies.length - 1; i >= 0; i--) {
                    // TODO: optimize
                    var path = game.map.getPath(enemies[i], true); //this.paths[enemies[i]];
                    if (game.map.isTileOnPath(path, game.map.Tiles.Water, 2)) {
                        count++;
                        isTarget = !isTarget ? (enemies[i] === this.rivals[who]) : isTarget;
                    }
                }
                // console.log(' water count = ' + count);
                if (count === 3 || (count === 2 && isTarget))
                    return freeze;
            }

            //TODO:

            return decision;
        },
        /**
         * 2.5.4 Fire (Valeriya)
         */
        _fire: function() {
            var who = _Globals.wizards.Fire;
            var enemies = _.without(this.gm.WizardsList, who);
            var decision = this._common(who, enemies);

            
            if (this.gm.isCanCast(who, _Globals.spells.Blind)) {

                var blind = _.extend(_.clone(decision), {
                    cast: true,
                    spell: {
                        type: _Globals.spells.Blind,
                        // where: null
                    }
                });

                // Cast Blind, if path to goal is less than 4 tiles.
                if (this.paths[who].length <= 4)
                    return blind;

                // Cast Blind, if behind from at least 2 rivals and they are more than ⅓ of the path towards the fountain.
                var count = 0;
                var isTarget = false;
                for (var i = enemies.length - 1; i >= 0; i--) {
                    var path = this.paths[enemies[i]];
                    if (this.paths[who].length > path.length && path.length <= this.dist_13) {
                        count++;
                        // isTarget = !isTarget ? (enemies[i] === this.rivals[who]) : isTarget;
                    }
                }
                // console.log(' fire count = ' + count);
                if (count > 1) { // || (count == 2 && isTarget)) {
                    return blind;
                }                
            }            

            //TODO:
            return decision;
        },
        /**
         * 2.5.5 Air (Rafel)
         */
        _air: function() {
            var who = _Globals.wizards.Air;
            var enemies = _.without(this.gm.WizardsList, who);
            var decision = this._common(who, enemies);
          
            if (this.gm.isCanCast(who, _Globals.spells.Teleport)) {

                var teleport = _.extend(_.clone(decision), {
                    cast: true,
                    spell: {
                        type: _Globals.spells.Teleport,
                        // where: null
                    }
                });                

                // teleport, if path to goal is less than 4 tiles.
                if (this.paths[who].length <= 4)
                    return teleport;

                // teleport, if behind from at least 2 rivals and they are more than ⅓ of the path towards the fountain.
                var count = 0;
                var isTarget = false;
                for (var i = enemies.length - 1; i >= 0; i--) {
                    var path = this.paths[enemies[i]];
                    if (this.paths[who].length > path.length && path.length <= this.dist_13) {
                        count++;
                        // isTarget = !isTarget ? (enemies[i] === this.rivals[who]) : isTarget;
                    }
                }
                // console.log(' air count = ' + count);
                if (count > 1) { // || (count == 2 && isTarget)) {
                    return teleport;
                }
            }

            //TODO:

            return decision;
        }
    };

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

            _ai.init(this);
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
                _Globals.debug('------ Turn ' +  match.turn + ' starts ------');

                // check which spells expire
                
                game.map.walkBuffs(function(buff) {
                    if (buff.turn < match.turn) {
                        game.map.restoreTile(buff.x, buff.y);
                        game.map.removeTileBuff(buff.x, buff.y);
                        //TODO: Fix bug with tiles getting full alpha after spell expires
                        self.onEvent('onExpireSpell', buff.type, {x: buff.x, y: buff.y});
                    }
                });
                
                // notify listener on next game turn
                this.onEvent('onNextTurn', match.turn);
                return;
            }

            var current = match.sequence[match.move.current];

            // get chance before actually the user requests it
            // this.setData(current, this.Props.LastDice, throwDice());
            wizards[current].lastdice = throwDice();
            // _Globals.debug('generating chance: ', wizards[current].lastdice);

            if (wizards[current].skipTurnUntil > match.turn || !this.isCanMove(current)) {
                this.onEvent('onSkipMove', current, this.getWizardName(current));
                return;
            }

            if (wizards[current].control === Controls.Human) {
                this.onEvent('onMoveHuman', current, this.getWizardName(current));
            } else if (wizards[current].control === Controls.AI) {
                var decision = _ai.decide(current);
                this.onEvent('onMoveAI', current, this.getWizardName(current), decision);
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
                        if (who !== _Globals.wizards.Water) {
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
                            if (who !== _Globals.wizards.Water) {
                                // make plr step on the first frozen tile found
                                if (i + 1 < path.length) {
                                    path.splice(i + 1);
                                }
                                // there are no more tiles ahead, so we seem to be at the end
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
        /**
         * Recursive call that check which is the last possible tile that a wizard can teleport to
         * @param  {String}  who   One of the available wizard types
         * @param  {Number}  steps How many steps ahead to look
         * @return {Object}  Destination x,y object or False 
         */
        isCanTeleport: function(who, steps) {
            var dest = game.map.getNextMove(who, steps);

            // check if wizard would teleport to abyss tile. teleport to last tile that is not abyss
            if (game.map.isTileBuff(dest.x, dest.y, game.map.Tiles.Abyss)) {
                if (steps > 0) {
                    return this.isCanTeleport(who, steps - 1);
                } else {
                    return false;
                }
            }
            return dest;
        },

        isCanCastAt: function(who, spell, x, y) {
            // start places and fountain are not selectable
            if (game.map.isTileSelectable(x, y)) {
                _Globals.debug('GM: nocast: unselectable ', x, y);
                return false;
            }

            // check if there's enough mana
            if (!this.isCanCast(who, spell)) {
                _Globals.debug('GM: nocast: not enough mana!', who, spell);
                return false;
            }

            // TODO: unless on Path!

            if (spell === _Globals.spells.Abyss) {
                // do not allow occupied tiles to be selected
                if (game.map.isTileOccupied(x, y) || game.map.isTileBuff(x, y, _Globals.spells.Path)) {
                    _Globals.debug('GM: nocast: occupied ', x, y);
                    return false;
                }

            } else if (spell === _Globals.spells.Clay) {
                // cast clay anywhere you want but on a stone, abyss or path casted tile
                return !(game.map.isTile(x, y, game.map.Tiles.Stone)) && 
                        !(game.map.isTile(x, y, game.map.Tiles.Abyss)) && 
                        !(game.map.isTileBuff(x, y, _Globals.spells.Path));

            } else if (spell === _Globals.spells.Stone) {
                // stone is allowed everywhere unless on Abyss or Path casted
                return !(game.map.isTile(x, y, game.map.Tiles.Abyss)) && 
                        !(game.map.isTileBuff(x, y, _Globals.spells.Path));
            }

            // cast only on allowed tiles
            var tile = game.map.getTile(x, y);
            var myTile = this.getWizardTile(who);
            if (tile !== myTile && tile !== game.map.Tiles.Clay) {
                if (!game.map.isTile(x, y, this.getWizardTile(who))) {
                    _Globals.debug('GM: nocast: not a wizard tile ', x, y, who, tile);
                    return false;
                }
            }

            return true;
        },

        isCanCast: function(who, spell) {
            var w = wizards[who];
            switch(spell) {
                case _Globals.spells.Blind:
                    return who === _Globals.wizards.Fire && w.mana >= getSpellCost(spell);
                case _Globals.spells.Freeze:
                    return who === _Globals.wizards.Water && w.mana >= getSpellCost(spell);
                case _Globals.spells.Teleport:
                    return who === _Globals.wizards.Air && w.mana >= getSpellCost(spell);
                case _Globals.spells.Path:
                    return who === _Globals.wizards.Earth && w.mana >= getSpellCost(spell);
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
                }
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
                    throw "GM: Sorry, not implemented!";
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
                    throw "GM: Sorry! Not implemented!";
            }            
        },

        doCast: function(who, spell, tiles) {
            var i;
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
                    game.map.setTile(tiles.x, tiles.y, game.map.Tiles.Abyss);
                    // set new buff
                    game.map.setTileBuff(tiles.x, tiles.y, buff);
                break;

                case _Globals.spells.Stone:
                    game.map.setTile(tiles.x, tiles.y, game.map.Tiles.Stone);
                    // set new buff
                    game.map.setTileBuff(tiles.x, tiles.y, buff);                     
                break;

                // case _Globals.spells.Change:
                //     var rnd = Math.floor(Math.random() * 4);
                //     switch(rnd) {
                //         case 0: game.map.setTile(tiles.x, tiles.y, game.map.Tiles.Earth, true); break;
                //         case 1: game.map.setTile(tiles.x, tiles.y, game.map.Tiles.Water, true); break;
                //         case 2: game.map.setTile(tiles.x, tiles.y, game.map.Tiles.Fire, true); break;
                //         case 3: game.map.setTile(tiles.x, tiles.y, game.map.Tiles.Air, true); break;
                //         // case 4: game.map.setTile(tiles.x, tiles.y, game.map.Tiles.Frozen, true); break;
                //     }
                //     // remove previous buff
                //     game.map.removeTileBuff(tiles.x, tiles.y);
                //     // spell lasts forever
                //     return;

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
                    for (i = tiles.length - 1; i >= 0; i--) {
                        game.map.setTile(tiles[i].x, tiles[i].y, game.map.Tiles.Frozen);
                        // set new buff
                        game.map.setTileBuff(tiles[i].x, tiles[i].y, _.clone(buff));
                    }
                break;

                case _Globals.spells.Teleport:
                    // nothing
                break;

                case _Globals.spells.Path:
                    for (i = tiles.length - 1; i >= 0; i--) {
                        // game.map.setTile(tiles[i].x, tiles[i].y, game.map.Tiles.Earth, true);
                        // // remove previous buff
                        // game.map.removeTileBuff(tiles[i].x, tiles[i].y);
                        game.map.setTile(tiles[i].x, tiles[i].y, game.map.Tiles.Earth);
                        // remove previous buff
                        game.map.setTileBuff(tiles[i].x, tiles[i].y, _.clone(buff));
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