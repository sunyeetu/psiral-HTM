/**
 * play.js
 *
 * Copyright (c) 2014 Dvubuz Games
 *
 */

/* jshint -W030 */

game.PlayScene = me.ScreenObject.extend({

    SceneStates: {
        InitBoard: 1,
        GamePaused: 19,
        StartGame: 20,
        NextMove: 21,
        NextTurn: 22,
        
        HUDSelectMove: 30,
        HUDThrowDice: 32,
        HUDSelectSpell: 34,
        HUDSelectTile: 36,
        
        AIMove: 200,

        GameOver: 500,
        Tests: 1000,
    },

    HUD: {
        SelectMove: 10,
        SelectSpell: 20,
        ThrowDice: 30
    },

    waitBetweenMoves: _Globals.isDebug ? 150 : 1450,

    init: function() {
        // use the update & draw functions
        this.parent(true);
        this.state = this.SceneStates.InitBoard;
        this.stateUpdated = false;
        this.stopStates = false;
        // ui
        this.hud = {};
        this.hud.current = null;
        // holds references to entities
        this.actors = [];

        this.wizards = [
            _Globals.wizards.Earth,
            _Globals.wizards.Water,
            _Globals.wizards.Fire,
            _Globals.wizards.Air
        ];        
    },

    update: function() {
        var p;

        if (!this.stateUpdated || this.stopStates)
            return;

        this.stateUpdated = false;

        switch(this.state) {
            case this.SceneStates.StartGame:
                // p = game.map.getPath(game.session.wizard);
                // p = p[p.length - 2];
                // this.actors[game.session.wizard].setPosition(p.x, p.y);
                // game.gamemaster.setPosition(game.session.wizard, p);            
                this.setState(this.SceneStates.NextMove);
            break;

            // Gamemaster checks who's turn it is
            case this.SceneStates.NextMove:
                // start player turn in 750ms
                me.plugin.fnDelay.add(function() {
                    game.gamemaster.nextMove();
                }, this.waitBetweenMoves);

                // game.gamemaster.nextMove();
            break;

            case this.SceneStates.NextTurn:
                this.setState(this.SceneStates.NextMove);
            break;

            // Human player selects chance or spellcast
            case this.SceneStates.HUDSelectMove:
                this.showHUD(this.HUD.SelectMove);
            break;

            case this.SceneStates.HUDThrowDice:
                var curChance = game.gamemaster.getData(game.gamemaster.currentWizard, game.gamemaster.Props.LastDice);
                this.showHUD(this.HUD.ThrowDice, {
                    chance: curChance
                });
                // this.onDiceThrown();
            break;

            case this.SceneStates.HUDSelectSpell:
                this.showHUD(this.HUD.SelectSpell, {
                    mana: game.gamemaster.getData(game.gamemaster.currentWizard, game.gamemaster.Props.Mana)
                });
            break;

            case this.SceneStates.AIMove:
            // skip turn
                // this.setState(this.SceneStates.HUDSelectMove);
            break;

            case this.SceneStates.GameOver:
                // nothing
            break;

            case this.SceneStates.Tests:
                // XXX
                console.log('tests');

                // test near goal AI  ------------------------

                p = game.map.getPath(game.session.wizard);
                p = p[p.length - 7];
                this.actors[game.session.wizard].setPosition(p.x, p.y);
                game.gamemaster.setPosition(game.session.wizard, p);
                
                var whiz = _Globals.wizards.Water;
                p = game.map.getPath(whiz);
                p = p[p.length - 5];
                this.actors[whiz].setPosition(p.x, p.y);
                game.gamemaster.setPosition(whiz, p);

                // test Blind 1/3 Fire AI  ------------------------
                // var whiz = _Globals.wizards.Air;
                // var p = game.map.getPath(whiz);
                // p = p[p.length - 14];
                // this.actors[whiz].setPosition(p.x, p.y);
                // game.gamemaster.setPosition(whiz, p);

                // var whiz = _Globals.wizards.Water;
                // var p = game.map.getPath(whiz);
                // p = p[p.length - 14];
                // this.actors[whiz].setPosition(p.x, p.y);
                // game.gamemaster.setPosition(whiz, p); 
                
                // test Blind 1/3 Fire AI  ------------------------              
                // var whiz = _Globals.wizards.Fire;
                // var p = game.map.getPath(whiz);
                // p = p[p.length - 6];
                // this.actors[whiz].setPosition(p.x, p.y);
                // game.gamemaster.setPosition(whiz, p);

                // // test near goal Air AI  ------------------------
                // var whiz = _Globals.wizards.Air;
                // var p = game.map.getPath(whiz);
                // p = p[p.length - 6];
                // this.actors[whiz].setPosition(p.x, p.y);
                // game.gamemaster.setPosition(whiz, p);

                // test water - freeze AI ------------------------
                
                // var whiz = _Globals.wizards.Fire;
                // var p = game.map.getPath(whiz);
                // p = p[4];
                // this.actors[whiz].setPosition(p.x, p.y);
                // game.gamemaster.setPosition(whiz, p);
                
                // var whiz = _Globals.wizards.Air;
                // var p = game.map.getPath(whiz);
                // p = p[4];
                // this.actors[whiz].setPosition(p.x, p.y);
                // game.gamemaster.setPosition(whiz, p);

                // var whiz = _Globals.wizards.Earth;
                // var p = game.map.getPath(whiz);
                // p = p[2];
                // this.actors[whiz].setPosition(p.x, p.y);
                // game.gamemaster.setPosition(whiz, p);                

                // test zorder bug  ------------------------
                // var p = game.map.getPos(_Globals.wizards.Water);
                // p.y += 1;
                // this.actors[game.session.wizard].setPosition(p.x, p.y);

                // var whiz = _Globals.wizards.Water;
                // var p = game.map.getPath(whiz);
                // p = p[p.length - 8];
                // this.actors[whiz].setPosition(p.x, p.y);
                // game.gamemaster.setPosition(whiz, p);

                // var whiz = _Globals.wizards.Fire;
                // var p = game.map.getPath(whiz);
                // p = p[p.length - 10];
                // this.actors[whiz].setPosition(p.x, p.y);
                // game.gamemaster.setPosition(whiz, p);                 

                this.setState(this.SceneStates.NextMove);
            break;
        }
    },

    // draw: function(ctx) {
    //     me.video.clearSurface(ctx, 'transparent'); 
    // },
    /**        
     * Action to perform on state change
     */
    onResetEvent: function() {        
        // prep. new game
        game.map.reset();
        game.gamemaster.reset(game.session.wizard, this);

        // add stats HUD
        this.statsHUD = new game.HUD.Stats();
        me.game.world.addChild(this.statsHUD);        
        
        // add actor entities
        for (var i = this.wizards.length - 1; i >= 0; i--) {
            var who = this.wizards[i];
            var corner = game.map.getPos(who);

            switch(who) {
                case _Globals.wizards.Earth:
                    this.actors[who] = new game.EarthWizardEntity(corner.x, corner.y, {});
                break;
                case _Globals.wizards.Fire:
                    this.actors[who] = new game.FireWizardEntity(corner.x, corner.y, {});
                break;
                case _Globals.wizards.Water:
                    this.actors[who] = new game.WaterWizardEntity(corner.x, corner.y, {});
                break;
                case _Globals.wizards.Air:
                    this.actors[who] = new game.AirWizardEntity(corner.x, corner.y, {});
                break;
            }
            
            me.game.world.addChild(this.actors[who]);
            // draw mana bars
            this.statsHUD.updateMana(who, game.gamemaster.getData(who, game.gamemaster.Props.Mana));
        }

        // add game scene entities 
        this.gameboard = new game.BoardEntity();
        me.game.world.addChild(this.gameboard);

        // add gfx manager
        this.anims = new game.Animations.Container();
        me.game.world.addChild(this.anims);

        // clear transparent background
        this.cls = new game.ClearScreen();
        me.game.world.addChild(this.cls);

        // sort all objects
        me.game.world.sort();

        // play music
        me.audio.play('observingthestar', true);

        // Start game
        this.setState(this.SceneStates.StartGame);
        // this.setState(this.SceneStates.Tests);
    },
    /**        
     * Action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove actors
        var wizards = me.game.getEntityByProp('type', 'wizard') || [];
        for (var i = wizards.length - 1; i >= 0; i--) {
            me.game.world.removeChild(wizards[i]);
        }
        // clear huds
        me.game.world.removeChild(this.hud.playerSelectMove);
        me.game.world.removeChild(this.hud.playerSelectSpell);
    },
    /**
     * Set current gameplay state
     */
    setState: function(newState) {
        this.state = newState;
        this.stateUpdated = true;
    },
    /**
     * Create HUD and display it
     */
    showHUD: function(hud, extraData) {
        extraData = extraData || {};
        _.extend(extraData, {
            wizard: game.gamemaster.currentWizard
        });

        switch(hud) {
            case this.HUD.SelectMove:
                this.hud.current = new game.HUD.SelectMove(this, extraData);
            break;
            case this.HUD.SelectSpell:
                this.hud.current = new game.HUD.SelectSpell(this, extraData);
            break;
            case this.HUD.ThrowDice:
                this.hud.current = new game.HUD.ThrowDice(this, extraData);
            break;            
            default:
                throw hud + " is an invalid HUD!";
        }
        
        me.game.world.addChild(this.hud.current);
    },
    /**
     * Destroy currently displayed HUD
     */
    removeHUD: function() {
        // remove the HUD from the game world
        // var huds = me.game.world.getEntityByProp('name', 'HUD');
        // for (var i = 0; i < huds.length; i++) {
        //     console.log(huds[i]);
        //     me.game.world.removeChild(huds[i]);
        // }

        // hack!
        if (this.hud.current) {
            me.game.world.removeChild(this.hud.current);
            this.hud.current = null;
        }
    },

    /************************************************************************
     * UI Events
     */
    
    onSelectDice: function() {
        _Globals.debug('selected throw dice');
        this.removeHUD();
        this.setState(this.SceneStates.HUDThrowDice);
    },

    onSelectSpell: function() {
        _Globals.debug('selected spell');
        this.removeHUD();
        this.setState(this.SceneStates.HUDSelectSpell);
    },

    onCancelSelect: function() {
        _Globals.debug('cancel select');
        this.removeHUD();
        this.setState(this.SceneStates.HUDSelectMove);
    },    

    onDiceThrown: function() {
        var self = this;
        
        this.removeHUD();

        var path;
        var mana;
        var chance = game.gamemaster.getData(game.gamemaster.currentWizard, game.gamemaster.Props.LastDice);
        var wizardName = game.gamemaster.getWizardName(game.gamemaster.currentWizard);

        if (_Globals.isDebug) {
            // chance = _Globals.chance.Move2;
        }

        switch(chance) {
            case _Globals.chance.Move1:
                this.statsHUD.drawText(wizardName + nls.get('play.move1'));
                path = game.gamemaster.getWalkablePath(game.gamemaster.currentWizard, 1);
            break;
            case _Globals.chance.Move2:
                this.statsHUD.drawText(wizardName + nls.get('play.move2'));
                path = game.gamemaster.getWalkablePath(game.gamemaster.currentWizard, 2);
            break;
            case _Globals.chance.Numb:
                // nothing
                this.statsHUD.drawText(wizardName + nls.get('play.numbed'));
                self.setState(self.SceneStates.NextMove);            
            break;
            case _Globals.chance.Mana1:
                this.statsHUD.drawText(wizardName + nls.get('play.mana1'));
                mana = 1;
            break;
            case _Globals.chance.Mana2:
                this.statsHUD.drawText(wizardName + nls.get('play.mana2'));
                mana = 2;
            break;            
            case _Globals.chance.Jump:
                this.statsHUD.drawText(wizardName + nls.get('play.teleport'));
                
                var dest = game.gamemaster.isCanTeleport(game.gamemaster.currentWizard, 2);
                if (dest === false) {
                    me.plugin.fnDelay.add(function() {
                        self.statsHUD.drawText(wizardName + nls.get('play.teleport_blocked'));
                        self.setState(self.SceneStates.NextMove);
                    }, this.waitBetweenMoves);

                    return;                    
                }
                
                var pos = game.map.getPos(game.gamemaster.currentWizard);
                var actor = self.actors[game.gamemaster.currentWizard];
                // actor.setVisible(false);
                actor.visible = false;

                // play sound
                me.audio.play('teleport', false);

                this.anims.play(game.Animations.Teleport, pos.x, pos.y, function() {
                    // make wizard visible again at new position
                    actor.setPosition(dest.x, dest.y);
                    actor.visible = true;
                    // XXX update logs
                    game.gamemaster.setPosition(game.gamemaster.currentWizard, dest);
                    game.gamemaster.setData(game.gamemaster.currentWizard, game.gamemaster.Props.LastDice, chance);
                    game.gamemaster.setData(game.gamemaster.currentWizard, game.gamemaster.Props.LastMove, dest);                    

                    self.anims.play(game.Animations.Teleport, dest.x, dest.y, function() {
                        // on to next move
                        self.setState(self.SceneStates.NextMove);
                    });

                });
            break;
            default:
                throw "Invalid chance value - " + chance;
        }

        // path = game.gamemaster.getWalkablePath(game.gamemaster.currentWizard, 10);

        if (path) {
            if (path.length > 0) {
                this.actors[game.gamemaster.currentWizard].moveTo(path, function() {
                    var lastMove = path.pop();
                    // XXX update logs
                    game.gamemaster.setPosition(game.gamemaster.currentWizard, lastMove);
                    game.gamemaster.setData(game.gamemaster.currentWizard, game.gamemaster.Props.LastDice, chance);
                    game.gamemaster.setData(game.gamemaster.currentWizard, game.gamemaster.Props.LastMove, lastMove);
                    // done moving, on to next move
                    self.setState(self.SceneStates.NextMove);
                });
            } else {
                me.plugin.fnDelay.add(function() {
                    self.statsHUD.drawText(wizardName + nls.get('play.move_blocked'));
                    self.setState(self.SceneStates.NextMove);
                }, this.waitBetweenMoves);                
            }
        } else if (mana) {
            game.gamemaster.addMana(game.gamemaster.currentWizard, mana);
            this.statsHUD.updateMana(game.gamemaster.currentWizard, 
                game.gamemaster.getData(game.gamemaster.currentWizard, game.gamemaster.Props.Mana));
            self.setState(self.SceneStates.NextMove);
        }
    },

    onCastSpell: function(data) {
        var self = this;
        var type = data[0];
        var where = data[1];
        var isAI = !!data[2];
        var wizard = game.gamemaster.getWizardName(game.gamemaster.currentWizard);
        var pos;

        _Globals.debug('casting:', type);

        if (!game.gamemaster.isCanCast(game.gamemaster.currentWizard, type)) {
            _Globals.debug('Cannot cast. No mana or wrong cast!', type, game.gamemaster.currentWizard);
            // No mana! Go back to selection menu.
            this.statsHUD.drawText(nls.get('play.no_mana'));
            return;
        }

        this.removeHUD();

        var parent = this;
        var substractMana = true;

        /**
         * Multiple tiles spells
         */
        
        var affectedTiles;

        if (type === _Globals.spells.Path) {
            /**
             * Earth Wizard - Path
             */
            affectedTiles = game.map.getPath(game.gamemaster.currentWizard, 3, true);
            parent.gameboard.changeTiles(game.map.Tiles.Earth, affectedTiles, function() {
                // wait for transition to complete and then proceed to next move
                parent.setState(parent.SceneStates.NextMove);
            });
            parent.statsHUD.drawText(nls.get('play.casts', wizard, 'Path'));
            // play sound
            me.audio.play('path', false);

        } else if (type === _Globals.spells.Freeze) {
            /**
             * Water Wizard - Freeze
             */
            affectedTiles = game.map.getAllTiles(game.map.Tiles.Water);
            parent.gameboard.setAlpha(1.0);
            parent.gameboard.changeTiles(game.map.Tiles.Frozen, affectedTiles, function() {
                // wait for transition to complete and then proceed to next move
                parent.setState(parent.SceneStates.NextMove);
            });
            parent.statsHUD.drawText(nls.get('play.casts', wizard, 'Freeze'));
            // play sound
            me.audio.play('freeze', false);

        } else if (type === _Globals.spells.Blind) {
            /**
             * Fire Wizard - Blind
             */
            var affectedWizards = _.without(this.wizards, game.gamemaster.currentWizard);

            // play blind animation for all affected wizards
            for (var i = affectedWizards.length - 1; i >= 1; i--) {
                pos = game.map.getPos(affectedWizards[i]);
                parent.anims.play(game.Animations.Blind, pos.x, pos.y);

            }
            // notify when animation over last wizard finishes
            pos = game.map.getPos(affectedWizards[0]);
            parent.anims.play(game.Animations.Blind, pos.x, pos.y, function() {
                // on to next move
                parent.setState(parent.SceneStates.NextMove);
            });
            parent.statsHUD.drawText(nls.get('play.casts', wizard, 'Blind'));
            // play sound
            me.audio.play('blind', false);            
          
        } else if (type === _Globals.spells.Teleport) {
            /**
             * Air Wizard - Teleport
             */
            var dest = game.gamemaster.isCanTeleport(game.gamemaster.currentWizard, 3);

            if (dest === false) {
                me.plugin.fnDelay.add(function() {
                    self.statsHUD.drawText(wizard + nls.get('play.teleport_blocked'));
                    self.setState(self.SceneStates.NextMove);
                }, this.waitBetweenMoves);
                // return;
            } else {
                var actor = this.actors[game.gamemaster.currentWizard];
                pos = game.map.getPos(game.gamemaster.currentWizard);

                affectedTiles = dest;
                actor.visible = false;
                
                this.anims.play(game.Animations.Teleport, pos.x, pos.y, function() {
                    // make wizard visible again at new position
                    actor.setPosition(dest.x, dest.y);
                    actor.visible = true;
                    // XXX update logs
                    game.gamemaster.setPosition(game.gamemaster.currentWizard, dest);
                    // game.gamemaster.setData(game.gamemaster.currentWizard, game.gamemaster.Props.LastDice, chance);
                    // game.gamemaster.setData(game.gamemaster.currentWizard, game.gamemaster.Props.LastMove, dest);

                    parent.anims.play(game.Animations.Teleport, dest.x, dest.y, function() {
                        // on to next move
                        parent.setState(parent.SceneStates.NextMove);
                    });

                });
                parent.statsHUD.drawText(nls.get('play.casts', wizard, 'Teleport'));
                // play sound
                me.audio.play('teleport', false);
            }
        } else {
            // player must first select a tile to cast spell
            substractMana = false;
        } 

        if (substractMana) {
            // substract mana
            game.gamemaster.doCast(game.gamemaster.currentWizard, type, affectedTiles);
            parent.statsHUD.updateMana(game.gamemaster.currentWizard, 
                game.gamemaster.getData(game.gamemaster.currentWizard, game.gamemaster.Props.Mana));
            // aaaaand, we're done with spellcasting! :)
            return;
        }

        /**
         * Single-Tile spells
         */
        var onSelectedTile = function(tileX, tileY) {
            if (!isAI) {
                parent.gameboard.disableSelect();
            }

            var where = {x: tileX, y: tileY};
            
            // substract mana
            game.gamemaster.doCast(game.gamemaster.currentWizard, type, where);
            parent.statsHUD.updateMana(game.gamemaster.currentWizard, 
                game.gamemaster.getData(game.gamemaster.currentWizard, game.gamemaster.Props.Mana));

            // play magic animation
            var animation = null;
            switch(type) {
                case _Globals.spells.Abyss:
                    parent.statsHUD.drawText(nls.get('play.casts', wizard, 'Abyss'));
                    parent.gameboard.changeTiles(game.map.Tiles.Abyss, where, function() {
                        // wait for transition to complete and then proceed with next plr movement
                        parent.setState(parent.SceneStates.NextMove);                        
                    });
                    // play sound
                    me.audio.play('abyss', false);                    
                break;
                case _Globals.spells.Stone:
                    parent.statsHUD.drawText(nls.get('play.casts', wizard, 'Stone'));
                    parent.gameboard.changeTiles(game.map.Tiles.Stone, where, function() {
                        // wait for transition to complete and then proceed with next plr movement
                        parent.setState(parent.SceneStates.NextMove);                        
                    });
                    // play sound
                    me.audio.play('change', false);
                break;
                // case _Globals.spells.Change:
                //     parent.gameboard.changeTiles(game.map.getTile(tileX, tileY), where, function() {
                //         parent.setState(parent.SceneStates.NextMove);                        
                //     });
                //     // play sound
                //     me.audio.play('change', false);
                // break;                
                case _Globals.spells.Clay:
                    parent.statsHUD.drawText(nls.get('play.casts', wizard, 'Clay'));
                    parent.gameboard.changeTiles(game.map.Tiles.Clay, where, function() {
                        parent.setState(parent.SceneStates.NextMove);                        
                    });
                    // play sound
                    me.audio.play('change', false);
                break;
                case _Globals.spells.Blind:
                    // nothing
                break;
                case _Globals.spells.Teleport:
                    // nothing
                break;
            }

            if (animation) {
                parent.anims.play(animation, tileX, tileY, function() {
                    // setState to nextMove
                    parent.setState(parent.SceneStates.NextMove);
                });
            }
        };

        // bring UI for human player or cast directly if AI

        if (isAI) {
            onSelectedTile(where.x, where.y);
        } else {
            this.statsHUD.drawText(nls.get('play.select_tile'));
            // dim board tiles and make them selectable 
            this.gameboard.enableSelect(game.gamemaster.currentWizard, type, onSelectedTile, function() {
                // cancel selection
                // bring player back to select next move menu
                parent.gameboard.disableSelect();
                parent.gameboard.setAlpha(0.5);
                parent.gameboard.setAlpha(1.0, game.map.getPath(game.gamemaster.currentWizard, undefined, true));
                parent.setState(parent.SceneStates.HUDSelectMove);
            });            
        }
    },

    onMoveHuman: function(data) {
        this.statsHUD.drawText(data[1] + nls.get('play.smove'));

        // TODO: optimize. set alpha in one pass
        this.gameboard.setAlpha(0.5);
        this.gameboard.setAlpha(1.0, game.map.getPath(game.gamemaster.currentWizard, undefined, true));
        
        this.setState(this.SceneStates.HUDSelectMove);    
    },

    onMoveAI: function(data) {
        var decision = data[2];
        _Globals.debug('AI: ', data[0], decision);

        this.statsHUD.drawText(data[1] + nls.get('play.smove'));
        // TODO: optimize. set alpha in one pass
        this.gameboard.setAlpha(0.5);
        this.gameboard.setAlpha(1.0, game.map.getPath(game.gamemaster.currentWizard, undefined, true));

        if (decision.cast === true) {
            data[0] = decision.spell.type;
            data[1] = decision.spell.where;
            data[2] = true;
            this.onCastSpell(data);
        } else if (decision.dice === true) {
            this.onDiceThrown();
        } else {
            throw "Unexpected AI decision " + decision;
        }
        
        // _Globals.debug('AI skipped!');
        // this.setState(this.SceneStates.NextMove);
    },

    onSkipMove: function(data) {
        this.statsHUD.drawText(data[1] + nls.get('play.skips_move'));
        this.setState(this.SceneStates.NextMove);
    },

    onNextTurn: function(data) {
        this.statsHUD.drawText(nls.get('play.next_turn', data[0]));
        this.setState(this.SceneStates.NextTurn);
    },

    onExpireSpell: function(data) {
        var type = data[0];
        var tiles = data[1];
        _Globals.debug('Removing spell ', type);

        if (tiles) {
            this.gameboard.restoreTiles(tiles);
        }
    },

    onReachGoal: function(data) {
        _Globals.debug('Winner - ', data[0]);
        var who = data[0];
        var parent = this;
        var i;

        // disable states switching
        // TODO: fix this because its unguaranteed!!!
        this.stopStates = true;
        this.setState(this.SceneStates.GameOver);

        // make actor sprite face the fountain
        this.actors[who].faceFountain();

        this.gameboard.setAlpha(1.0);
        this.gameboard.changeTiles(game.gamemaster.getWizardTile(who), function() {

            // TODO: draw at game board center
            parent.statsHUD.drawText(data[1] + nls.get('play.move_2win'));

            // fade out board
            parent.gameboard.fadeTiles('out', function() {
                // fade out wizards
                for (i = 0; i < parent.wizards.length; i++) {
                    if (parent.wizards[i] !== who) {
                        var name = parent.wizards[i];
                        parent.actors[name].fadeOut(0.005);
                        // parent.actors[parent.wizards[i]].setAlpha(0);
                    }
                }
                // fade out hud
                parent.statsHUD.fadeOut(0.005, null, who);
            });

        });

        me.audio.stop('observingthestar');
        
        // play sound
        me.audio.play('win', false);
        me.audio.play('lifeline', false);
    }

});