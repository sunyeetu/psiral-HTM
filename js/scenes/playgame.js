/**
 * playgame.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

game.PlayScene = me.ScreenObject.extend({

    init: function() {
        // use the update & draw functions
        this.parent(true); 
    },

    update: function() {

    },

    draw: function(ctx) {
        me.video.clearSurface(ctx, 'black'); 
    },

    /**        
     * Action to perform on state change
     */
    onResetEvent: function() {        
        // reset board state
        game.map.reset();
        
        // me.entityPool.add("earth_wizard", game.EarthWizardEntity, true);
        // var wizard = me.entityPool.newInstanceOf("earth_wizard", 50, 50, {});
        me.game.world.addChild(new game.EarthWizardEntity(0, 0, {}));
        me.game.world.addChild(new game.WaterWizardEntity(14, 0, {}));
        //me.game.world.addChild(new game.EarthWizardEntity(14, 0, {}));
        //me.game.world.addChild(new game.EarthWizardEntity(14, 0, {}));

        // add game scene entities 
        //me.game.add(new game.HUD.Container());
        this.gameboard = new game.BoardEntity();
        me.game.world.addChild(this.gameboard);
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
        // remove the HUD from the game world
        me.game.world.removeChild(me.game.world.getEntityByProp("name", "HUD")[0]);
    }
});