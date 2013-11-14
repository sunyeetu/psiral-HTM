/**
 * playgame.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

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

    init: function() {
        // use the update & draw functions
        this.parent(true);
        this.state = this.SceneStates.InitBoard;
        this.stateUpdated = false;
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
        if (!this.stateUpdated)
            return;

        this.stateUpdated = false;

        switch(this.state) {
            case this.SceneStates.StartGame:
                this.setState(this.SceneStates.NextMove);
            break;

            // Gamemaster checks who's turn it is
            case this.SceneStates.NextMove:
                // start player turn in 750ms
                // me.plugin.fnDelay.add(function() {
                //     game.gamemaster.nextMove();
                // }, 750);

                game.gamemaster.nextMove();
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
            //this.setState(this.SceneStates.HUDSelectMove);
            break;

            case this.SceneStates.Tests:
            // XXX
            // test spell
            // this.actors[_Globals.wizards.Earth].doSpellCast(game.map.getPos('player3'));
            // this.gfx.play(game.GFX.anims.Teleport, 5, 5);
            
            break;
        }
    },

    draw: function(ctx) {
        me.video.clearSurface(ctx, 'black'); 
    },
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
        this.gfx = new game.GFX.Container();
        me.game.world.addChild(this.gfx);

        // Start game
        this.setState(this.SceneStates.StartGame);
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
            break;
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
        console.log('selected throw dice');
        this.removeHUD();
        this.setState(this.SceneStates.HUDThrowDice);
    },

    onSelectSpell: function() {
        console.log('selected spell');
        this.removeHUD();
        this.setState(this.SceneStates.HUDSelectSpell);
    },

    onCancelSelectSpell: function() {
        console.log('cancel spell');
        this.removeHUD();
        this.setState(this.SceneStates.HUDSelectMove);
    },    

    onDiceThrown: function() {
        var self = this;
        
        this.removeHUD();

        var path;
        var chance = game.gamemaster.getData(game.gamemaster.currentWizard, game.gamemaster.Props.LastDice);

        switch(chance) {
            case _Globals.chance.Move1:
                path = game.map.getPath(game.gamemaster.currentWizard, 1);
            break;
            case _Globals.chance.Move2:
                path = game.map.getPath(game.gamemaster.currentWizard, 2);
            break;
            case _Globals.chance.Move3:
                path = game.map.getPath(game.gamemaster.currentWizard, 3);
            break;
            case _Globals.chance.Move4:
                path = game.map.getPath(game.gamemaster.currentWizard, 4);
            break;
            case _Globals.chance.Jump:
                // path = game.map.getPath('player1');
            break;
            case _Globals.chance.Skip:
                // nothing
            break;
        }

        if (path) {
            // console.log(path);
            this.actors[game.gamemaster.currentWizard].moveTo(path, function() {
                var lastMove = path.pop();
                // update 
                game.map.setPos(game.gamemaster.currentWizard, lastMove.x, lastMove.y);
                game.gamemaster.setData(game.gamemaster.currentWizard, game.gamemaster.Props.LastDice, chance);
                game.gamemaster.setData(game.gamemaster.currentWizard, game.gamemaster.Props.LastMove, lastMove);
                // done moving, on to next move
                self.setState(self.SceneStates.NextMove);
            });
        } else {
            // TODO
            // nothing happened
            self.setState(self.SceneStates.NextMove);
        }
    },

    onCastSpell: function(data) {
        var type = data[0];
        var where = data[1];
        console.log('casting ' + type);

        if (!game.gamemaster.isCanCast(game.gamemaster.currentWizard, type)) {
            // No mana! Go back to selection menu.
            this.statsHUD.drawText('Not enough mana to cast!');
            return;
        }

        this.removeHUD();

        var parent = this;
        var substractMana = true;

        /**
         * Multiple tiles spells
         */

        if (type == _Globals.spells.Freeze) {
            parent.gameboard.changeTiles(game.map.Tiles.Frozen, 
                game.map.getAllTiles(game.map.Tiles.Water), function() {
                    // wait for transition to complete and then proceed with next plr move
                    parent.setState(parent.SceneStates.NextMove);
                });
        } else {
            // player must first select a tile to cast spell
            substractMana = false;
        } 

        if (substractMana) {
            // substract mana
            game.gamemaster.doCast(game.gamemaster.currentWizard, type);
            parent.statsHUD.updateMana(game.gamemaster.currentWizard, 
                game.gamemaster.getData(game.gamemaster.currentWizard, game.gamemaster.Props.Mana));
            // aaaaand, we're done with spellcasting! :)
            return;
        }

        /**
         * Single-Tile spells
         */
        
        this.statsHUD.drawText('Select a target tile to cast spell on');

        // dim board tiles and make them selectable 
        this.gameboard.enableSelect(function(tileX, tileY) {
            parent.gameboard.disableSelect();

            // substract mana
            game.gamemaster.doCast(game.gamemaster.currentWizard, type);
            parent.statsHUD.updateMana(game.gamemaster.currentWizard, 
                game.gamemaster.getData(game.gamemaster.currentWizard, game.gamemaster.Props.Mana));

            // play magic animation
            // TODO: types!?
            var animation = null;
            switch(type) {
                case _Globals.spells.Abyss:
                    parent.gameboard.changeTiles(game.map.Tiles.Abyss, {x: tileX, y: tileY}, function() {
                        // wait for transition to complete and then proceed with next plr movement
                        parent.setState(parent.SceneStates.NextMove);                        
                    });
                break;
                case _Globals.spells.Change:
                   animation = game.GFX.anims.Teleport;
                break;
                case _Globals.spells.Clay:
                    animation = game.GFX.anims.Teleport;
                break;
                case _Globals.spells.Blind:
                    // nothing
                break;
                case _Globals.spells.Teleport:
                    // nothing
                break;
                case _Globals.spells.Path:
                    // nothing
                break;
            }

            if (animation) {
                parent.gfx.play(animation, tileX, tileY, function() {
                    // setState to nextMove
                    parent.setState(parent.SceneStates.NextMove);
                });
            }
        },
        // cancel selection
        function() {
            // bring player back to select next move menu
            parent.gameboard.disableSelect();
            parent.gameboard.setAlpha(0.5, game.map.getPath(game.gamemaster.currentWizard));
            parent.setState(parent.SceneStates.HUDSelectMove);
        });
    },

    onMoveHuman: function(data) {
        this.statsHUD.drawText(data[1] + '\'s move');
        this.gameboard.clearAlpha();
        this.gameboard.setAlpha(0.5, game.map.getPath(game.gamemaster.currentWizard));
        this.setState(this.SceneStates.HUDSelectMove);
    },

    onMoveAI: function(data) {
        this.statsHUD.drawText(data[1] + '\'s move');
        this.gameboard.clearAlpha();
        this.gameboard.setAlpha(0.5, game.map.getPath(game.gamemaster.currentWizard));
        // TODO
        console.log('AI skipped!');
        this.setState(this.SceneStates.NextMove);
    },

    onNextTurn: function(data) {
        this.statsHUD.drawText('Turn ' + data[0] + ' started');
        this.setState(this.SceneStates.NextTurn);
    }

});