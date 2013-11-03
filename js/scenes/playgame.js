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
        InitBoard: 10,
        HumanMove: 20,
        HumanThrowDice: 21,
        HumanSelectSpell: 22,
        AIMove: 50,
        GameOver: 100
    },

    init: function() {
        // use the update & draw functions
        this.parent(true);
        this.state = this.SceneStates.InitBoard;
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
        game.gamemaster.reset(game.gamemaster.Wizards.Earth);
        
        // add gfx entities

        // me.entityPool.add("earth_wizard", game.EarthWizardEntity, true);
        // var wizard = me.entityPool.newInstanceOf("earth_wizard", 50, 50, {});
        me.game.world.addChild(new game.EarthWizardEntity(0, 0, {}));
        me.game.world.addChild(new game.WaterWizardEntity(14, 0, {}));
        //me.game.world.addChild(new game.EarthWizardEntity(14, 0, {}));
        //me.game.world.addChild(new game.EarthWizardEntity(14, 0, {}));

        // add game scene entities 
        this.gameboard = new game.BoardEntity();
        me.game.world.addChild(this.gameboard);
        
        // Start game
        this.setState(this.SceneStates.HumanMove);
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
            case this.SceneStates.HumanMove:
                // Show selection HUD
                var hud = new game.HUD.PlayerTurn();
                hud.setup(this);
                me.game.world.addChild(hud);
                // XXX: workaround!
                this.hud = hud; 
            break;
            case this.SceneStates.HumanThrowDice:
            break;
            case this.SceneStates.HumanSelectSpell:
                // Show selection HUD
                var hud = new game.HUD.PlayerSelectSpell();
                hud.setup(this);
                me.game.world.addChild(hud);
                // XXX: workaround!
                this.hud = hud;             
            break;
            case this.SceneStates.AIMove:
            
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
    
    onSelectChance: function() {
        console.log('selected chance');
        this.clearHUD();
        this.setState(this.SceneStates.HumanThrowDice);
    },

    onSelectSpell: function() {
        console.log('selected spell');
        this.clearHUD();
        this.setState(this.SceneStates.HumanSelectSpell);
    },

    onCastSpell: function(data) {
        var type = data[0];
        console.log('casting ' + type);
        this.clearHUD();
    } 

});