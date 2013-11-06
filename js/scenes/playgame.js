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

    init: function() {
        // use the update & draw functions
        this.parent(true);
        this.state = this.SceneStates.InitBoard;
        // holds references to entities
        this.actors = [];

        this.currentActor = {};
    },

    update: function() {

        // game.gamemaster.update();
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
        
        // add gfx entities

        // me.entityPool.add("earth_wizard", game.EarthWizardEntity, true);
        // var wizard = me.entityPool.newInstanceOf("earth_wizard", 50, 50, {});

        var corner = game.map.getPlayerPos(_Globals.wizards.Earth);
        this.actors[_Globals.wizards.Earth] = new game.EarthWizardEntity(corner.x, corner.y, {});
        me.game.world.addChild(this.actors[_Globals.wizards.Earth]);

        corner = game.map.getPlayerPos(_Globals.wizards.Water);
        this.actors[_Globals.wizards.Water] = new game.WaterWizardEntity(corner.x, corner.y, {});
        me.game.world.addChild(this.actors[_Globals.wizards.Water]);

        corner = game.map.getPlayerPos(_Globals.wizards.Fire);
        this.actors[_Globals.wizards.Fire] = new game.FireWizardEntity(corner.x, corner.y, {});
        me.game.world.addChild(this.actors[_Globals.wizards.Fire]);

        corner = game.map.getPlayerPos(_Globals.wizards.Air);
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
    },
    /**
     * Set current gameplay state
     */
    setState: function(newState) {
         switch(newState) {
            case this.SceneStates.StartGame:
                this.setState(this.SceneStates.NextMove);
            break;

            case this.SceneStates.NextMove:
                game.gamemaster.nextMove();
            break;

            case this.SceneStates.HUDSelectMove:
                // Show selection HUD
                
                // XXX: workaround!
                this.hud = new game.HUD.PlayerTurn(this);
                me.game.world.addChild(this.hud);
            break;

            case this.SceneStates.HUDThrowDice:
                //TODO: call hud
                this.onDiceThrown();
            break;

            case this.SceneStates.HUDSelectSpell:
                // Show selection HUD
                
                // XXX: workaround!
                this.hud = new game.HUD.PlayerSelectSpell();
                me.game.world.addChild(this.hud);
                
            break;

            case this.SceneStates.AIMove:
            // skip turn
            //this.setState(this.SceneStates.HUDSelectMove);
            break;

            case this.SceneStates.Tests:
            // XXX
            // test spell
            // this.actors[_Globals.wizards.Earth].doSpellCast(game.map.getPlayerPos('player3'));
            // this.gfx.play(game.GFX.anims.Teleport, 5, 5);
            
            break;
        }
        this.state = newState;
    },

    clearHUD: function() {
        // remove the HUD from the game world
        // var huds = me.game.world.getEntityByProp('name', 'HUD');
        // for (var i = 0; i < huds.length; i++) {
        //     console.log(huds[i]);
        //     me.game.world.removeChild(huds[i]);
        // }
        // hack!
        if (this.hud) {
            me.game.world.removeChild(this.hud);
            this.hud = null;
        }
    },

    /************************************************************************
     * UI Events
     */
    
    onSelectDice: function() {
        console.log('selected throw dice');
        this.clearHUD();
        this.setState(this.SceneStates.HUDThrowDice);
    },

    onSelectSpell: function() {
        console.log('selected spell');
        this.clearHUD();
        this.setState(this.SceneStates.HUDSelectSpell);
    },

    onDiceThrown: function() {
        var self = this;
        this.clearHUD();

        var path;
        var chance = game.gamemaster.getData(game.session.wizard, game.gamemaster.Props.LastDice);
        
        switch(chance) {
            case _Globals.chance.Move1:
                path = game.map.getPlayerPath(game.gamemaster.currentWizard, 1);
            break;
            case _Globals.chance.Move2:
                path = game.map.getPlayerPath(game.gamemaster.currentWizard, 2);
            break;
            case _Globals.chance.Move3:
                path = game.map.getPlayerPath(game.gamemaster.currentWizard, 3);
            break;
            case _Globals.chance.Move4:
                // path = game.map.getPlayerPath('player1');
            break;
            case _Globals.chance.Jump:
                // path = game.map.getPlayerPath('player1');
            break;
            case _Globals.chance.Skip:
                // nothing
            break;
        }

        if (path) {
            console.log(path);

            
            this.actors[_Globals.wizards.Earth].moveTo(path, function() {
                var lastMove = path.pop();
                // update 
                game.map.setPlayerPos(game.gamemaster.currentWizard, lastMove.x, lastMove.y);
                game.gamemaster.setData(game.session.wizard, game.gamemaster.Props.LastDice, chance);
                game.gamemaster.setData(game.session.wizard, game.gamemaster.Props.LastMove, lastMove);
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
        this.clearHUD();
    },

    moveHuman: function() {
        this.setState(this.SceneStates.HUDSelectMove);
    },

    moveAI: function(data) {
        console.log('AI skipped!');
        this.setState(this.SceneStates.NextMove);
    }    

});