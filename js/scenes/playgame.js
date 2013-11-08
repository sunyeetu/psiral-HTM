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
                game.gamemaster.nextMove();
            break;

            // Human player selects chance or spellcast
            case this.SceneStates.HUDSelectMove:
                this.showHUD(this.HUD.SelectMove);
            break;

            case this.SceneStates.HUDThrowDice:
                var curChance = game.gamemaster.getData(game.gamemaster.currentWizard, game.gamemaster.Props.LastDice);
                this.showHUD(this.HUD.ThrowDice, {wizard:  game.gamemaster.currentWizard, chance: curChance});
                //TODO: call hud
                // this.onDiceThrown();
            break;

            case this.SceneStates.HUDSelectSpell:
                this.showHUD(this.HUD.SelectSpell);
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
        
        // add actor entities
        var corner = game.map.getPos(_Globals.wizards.Earth);
        this.actors[_Globals.wizards.Earth] = new game.EarthWizardEntity(corner.x, corner.y, {});
        me.game.world.addChild(this.actors[_Globals.wizards.Earth]);

        corner = game.map.getPos(_Globals.wizards.Water);
        this.actors[_Globals.wizards.Water] = new game.WaterWizardEntity(corner.x, corner.y, {});
        me.game.world.addChild(this.actors[_Globals.wizards.Water]);

        corner = game.map.getPos(_Globals.wizards.Fire);
        this.actors[_Globals.wizards.Fire] = new game.FireWizardEntity(corner.x, corner.y, {});
        me.game.world.addChild(this.actors[_Globals.wizards.Fire]);

        corner = game.map.getPos(_Globals.wizards.Air);
        this.actors[_Globals.wizards.Air] = new game.AirWizardEntity(corner.x, corner.y, {});
        me.game.world.addChild(this.actors[_Globals.wizards.Air]);

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
        for (var i = 0; i < wizards.length; i++) {
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
        switch(hud) {
            case this.HUD.SelectMove:
                this.hud.current = new game.HUD.SelectMove(this);
            break;
            case this.HUD.SelectSpell:
                this.hud.current = new game.HUD.SelectSpell(this);
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
            console.log(path);

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
            // nothing happened
            self.setState(self.SceneStates.NextMove);
        }
    },

    onCastSpell: function(data) {
        var type = data[0];
        var where = data[1];
        console.log('casting ' + type);
        this.removeHUD();

        this.setState(this.SceneStates.NextMove);
    },

    onMoveHuman: function() {
        this.setState(this.SceneStates.HUDSelectMove);
    },

    onMoveAI: function(data) {
        console.log('AI skipped!');
        this.setState(this.SceneStates.NextMove);
    }    

});