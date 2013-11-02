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

    var Players = {
        Human: 1,
        AI: 2,
    };

    var AI = {
        Explorer: 1,
        Ruler: 2,
    };

    /**
     * Game props
     */
    
    var _instance = {
        Wizards: {
            Earth: 1,
            Water: 2,
            Fire: 3,
            Air: 4
        },
        /**
         * Reset vars and prepare for a new game
         */
        reset: function(playerWizard) {
            this.wizards = [];
            this.wizards[this.Wizards.Earth] = Players.AI;
            this.wizards[this.Wizards.Water] = Players.AI;
            this.wizards[this.Wizards.Fire] = Players.AI;
            this.wizards[this.Wizards.Air] = Players.AI;
            // hi, human!
            //playerWizard = playerWizard || this.Wizards.Earth;
            this.wizards[playerWizard] = Players.Human;

            this.turns = {
                current: 0,
                next: 1
            };
        },
        /**
         * Proceed with next turn
         */
        execute: function() {
            console.log('aha');
            console.log(this.wizards);
            for(var k in this.wizards) {
                
                if (this.wizards[k] === Players.AI) {
                    // AI control
                } else if (this.wizards[k] === Players.Human) {
                    // Human HUD control
                    // TODO
                } else {
                    throw "Invalid actor control!";
                }
            }
        },

        update: function() {
            if (this.turns.next > this.turns.current) {
                this.execute();
                this.turns.current = this.turns.next;
            }
        }
    };
    game.gamemaster = _instance;

    function Wizard() {

    }

}(game || {}));