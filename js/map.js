/**
 * map.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

(function TileMap(game) {

    var mapWidth = 15;
    var mapHeight = 11;

    var S1 = -1;
    var S2 = -2;
    var S3 = -3;
    var S4 = -4;
    var U = 1;
    var D = 2;
    var L = 3;
    var R = 4;
    var X = 5; // fountain
    var E = 6, W = 7, F = 8, A = 9; // elements

    var currentMap = null;
    var players = {
        'player1': {x: 0, y: 0, route: player1},
        'player2': {x: 14, y: 0, route: player2},
        'player3': {x: 14, y: 10, route: player3},
        'player4': {x: 0, y: 10, route: player4}
    }
    /**
     * Interface
     */
    var _instance = {

        Tiles: {
            Earth: E,
            Water: W,
            Fire: F,
            Air: A,
            Fountain: X,
            Base1: S1,
            Base2: S2,
            Base3: S3,
            Base4: S4,
        },

        Moves: {
            UP: U,
            DOWN: D,
            LEFT: L,
            RIGHT: R
        },

        reset: function() {
            currentMap = tilemap.slice(0);
            this.setPlayerPos('player1', 0, 0);
            this.setPlayerPos('player2', 14, 0);
            this.setPlayerPos('player3', 14, 10);
            this.setPlayerPos('player4', 0, 10);
        },

        getTile: function(x, y) {
            return currentMap[y * mapWidth +x];
        },

        isTile: function(x, y, type) {
            return this.getTile(x, y) === type;
        },

        getPlayerPos: function(player) {
            return players[player];
        },

        setPlayerPos: function(player, x, y) {
            players[player].x = x;
            players[player].y = y;
        },

        getNextMove: function(player, steps) {
            steps = steps || 1;

            var pos = this.getPlayerPos(player);
            var where;
            var tmpx = pos.x;
            var tmpy = pos.y;
            var i = steps;

            do {
                where = tmpy * mapWidth + tmpx;
                if (pos.route[where] == D) {
                    tmpy += 1;
                } else if (pos.route[where] == U) {
                    tmpy -= 1;
                } else if (pos.route[where] == L) {
                    tmpx -= 1;
                } else if (pos.route[where] == R) {
                    tmpx += 1;
                }
            } while(--i > 0);

            return {x: tmpx, y: tmpy};
        },

        movePlayer: function(player, steps) {
            var nextPos = this.getNextMove(player, steps);
            this.setPlayerPos(nextPos.x, nextPos.y);
        }

    };
    Object.defineProperty(_instance, 'width', {get: function() { return mapWidth; }});
    Object.defineProperty(_instance, 'height', {get: function() { return mapHeight; }});
    game.map = _instance;

    /**
     * Lookup maps
     */
    
    var tilemap = [
        S1, E, E, E, E, W, W, W, W, F, F, F, F, A, S2,
         W, W, W, W, F, F, F, F, A, A, A, A, E, A, W,
         E, A, A, A, A, E, E, E, E, F, F, F, E, A, W,
         E, F, A, A, E, E, E, E, W, W, W, F, E, A, W,
         E, F, A, E, E, W, W, F, F, F, W, A, E, E, W,
         E, F, A, E, E, E, W, X, X, E, E, A, W, E, F,
         A, F, F, E, A, E, X, X, X, E, A, A, W, E, F,
         A, W, F, A, A, A, A, F, F, F, F, W, W, E, F,
         A, W, F, A, A, A, F, F, F, F, W, W, W, W, F,
         A, W, F, W, W, W, W, E, E, E, E, A, A, A, A,
        S4, W, E, E, E, E, A, A, A, A, F, F, F, F, S3
    ];
    var player1 = [
        R, R, R, R, R, R, R, R, R, R, R, R, R, D, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D, 0,
        0, 0, 0, R, R, R, D, 0, 0, 0, 0, 0, 0, D, 0,
        0, 0, 0, U, 0, 0, D, X, X, 0, 0, 0, 0, D, 0,
        0, 0, 0, U, 0, 0, X, X, X, 0, 0, 0, 0, D, 0,
        0, 0, 0, U, 0, 0, 0, 0, 0, 0, 0, 0, 0, D, 0,
        0, 0, 0, U, L, L, L, L, L, L, L, L, L, L, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    var player2 = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D,
        0, 0, R, R, R, R, R, R, R, R, D, 0, 0, 0, D,
        0, 0, U, 0, 0, 0, 0, D, L, L, L, 0, 0, 0, D,
        0, 0, U, 0, 0, 0, 0, X, X, 0, 0, 0, 0, 0, D,
        0, 0, U, 0, 0, 0, X, X, X, 0, 0, 0, 0, 0, D,
        0, 0, U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D,
        0, 0, U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D,
        0, 0, U, L, L, L, L, L, L, L, L, L, L, L, L,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    var player3 = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, R, R, R, R, R, R, R, R, R, R, D, 0, 0, 0,
        0, U, 0, 0, 0, 0, 0, 0, 0, 0, 0, D, 0, 0, 0,
        0, U, 0, 0, 0, 0, 0, 0, 0, 0, 0, D, 0, 0, 0,
        0, U, 0, 0, 0, 0, 0, X, X, D, L, D, 0, 0, 0,
        0, U, 0, 0, 0, 0, X, X, X, L, U, R, 0, 0, 0,
        0, U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, U, L, L, L, L, L, L, L, L, L, L, L, L, L
    ];      
    var player4 = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        R, R, R, R, R, R, R, R, R, R, R, R, D, 0, 0,
        U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D, 0, 0,
        U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D, 0, 0,
        U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D, 0, 0,
        U, 0, 0, 0, R, D, 0, X, X, 0, 0, 0, D, 0, 0,
        U, 0, 0, 0, U, R, X, X, X, 0, 0, 0, D, 0, 0,
        U, 0, 0, 0, U, L, L, L, L, L, L, L, L, 0, 0,
        U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];    

}(game || {}));
