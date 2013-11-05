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

        var corner = game.map.getPlayerPos('player1');
        this.actors[_Globals.wizards.Earth] = new game.EarthWizardEntity(corner.x, corner.y, {});
        me.game.world.addChild(this.actors[_Globals.wizards.Earth]);

        corner = game.map.getPlayerPos('player2');
        this.actors[_Globals.wizards.Water] = new game.WaterWizardEntity(corner.x, corner.y, {});
        me.game.world.addChild(this.actors[_Globals.wizards.Water]);

        corner = game.map.getPlayerPos('player3');
        this.actors[_Globals.wizards.Fire] = new game.FireWizardEntity(corner.x, corner.y, {});
        me.game.world.addChild(this.actors[_Globals.wizards.Fire]);

        corner = game.map.getPlayerPos('player4');
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
                this.onDiceThrown([2]);
            
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
        if (this.hud)
            me.game.world.removeChild(this.hud);
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

    onDiceThrown: function(data) {
        // move 1
        
        var path = game.map.getNextMove('player1');
        this.actors[_Globals.wizards.Earth].moveTo(path);
    },

    onCastSpell: function(data) {
        var type = data[0];
        console.log('casting ' + type);
        this.clearHUD();
    },

    moveHuman: function(data) {
        console.log(data);
        this.setState(this.SceneStates.HUDSelectMove);
    },

    moveAI: function(data) {

    }    

});