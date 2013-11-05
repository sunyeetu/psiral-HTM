/**
 * map.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

(function TileMap(game) {

    /**
     * Lookup maps
     */
    
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

    var tilemap = [
        S1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, S2,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, X, X, X, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0 ,0, 0, 0, X, X, X, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        S4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, S3,
    ];
    var player1 = [
        R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, D, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D, 0,
        0, 0, 0, R, R, R, R, X, X, X, 0, 0, 0, 0, 0, D, 0,
        0, 0, 0, U ,0, 0, 0, X, X, X, 0, 0, 0, 0, 0, D, 0,
        0, 0, 0, U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D, 0,
        0, 0, 0, U, L, L, L, L, L, L, L, L, L, L, L, L, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    var player2 = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D,
        0, 0, R, R, R, R, R, R, R, R, R, R, D, 0, 0, 0, D,
        0, 0, U, 0, 0, 0, 0, X, X, X, L, L, L, 0, 0, 0, D,
        0, 0, U, 0, 0, 0, 0, X, X, X, 0, 0, 0, 0, 0, 0, D,
        0, 0, U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D,
        0, 0, U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D,
        0, 0, U, L, L, L, L, L, L, L, L, L, L, L, L, L, L,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    var player3 = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, R, R, R, R, R, R, R, R, R, R, R, R, D, 0, 0, 0,
        0, U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D, 0, 0, 0,
        0, U, 0, 0, 0, 0, 0, X, X, X, 0, 0, 0, D, 0, 0, 0,
        0, U, 0, 0, 0, 0, 0, X, X, X, L, L, L, L, 0, 0, 0,
        0, U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, U, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L,
    ];   
    var player4 = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        R, R, R, R, R, R, R, R, R, R, R, R, R, R, D, 0, 0,
        U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D, 0, 0,
        U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, D, 0, 0,
        U, 0, 0, 0, 0, 0, 0, X, X, X, 0, 0, 0, 0, D, 0, 0,
        U, 0, 0, 0, R, R, R, X, X, X, 0, 0, 0, 0, D, 0, 0,
        U, 0, 0, 0, U, L, L, L, L, L, L, L, L, L, L, 0, 0,
        U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];  

    /**
     * Private routines
     */    

    var mapWidth = _Globals.gfx.mapWidth;
    var mapHeight = _Globals.gfx.mapHeight;
    var tileRepetitions = [4, 2, 1];
    var currentMap = null;
    var players = {
        'player1': {x: 0, y: 0, sx: 0, sy: 0, ex: 7, ey: 4, route: player1, pattern: [E, W, F, A], sign: S1},
        'player2': {x: 16, y: 0, sx: 16, sy: 0, ex: 9, ey: 4, route: player2, pattern: [W, F, A, E], sign: S2},
        'player3': {x: 16, y: 9, sx: 16, sy: 9, ex: 9, ey: 5, route: player3, pattern: [F, A, E, W], sign: S3},
        'player4': {x: 0, y: 9, sx: 0, sy: 9, ex: 7, ey: 5, route: player4, pattern: [A, E, W, F], sign: S4}
    };

    function buildTileMap(player, path, map) {
        var pos = players[player];
        var rc = 0;
        var pc = 0;
        var pattern = pos.pattern;
        var tilePos = 0;
        // place start position
        map[pos.sy * mapWidth + pos.sx] = pos.sign;
        // populate tilemap
        for(var i = 0; i < path.length - 2; i++) {
            map[path[i].y * mapWidth + path[i].x] = pattern[tilePos];
            if (++pc >= tileRepetitions[rc]) {
                if (++tilePos >= pattern.length) {
                    tilePos = 0;
                    if (++rc >= tileRepetitions.length) {
                        rc = tileRepetitions.length - 1;
                    }

                }
                pc = 0;
            }
        }
    }

    /**
     * Public interface
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

        Directions: {
            UP: U,
            DOWN: D,
            LEFT: L,
            RIGHT: R
        },

        reset: function() {
            currentMap = tilemap.slice(0);
            this.setPlayerPos('player1', players['player1'].sx, players['player1'].sy);
            this.setPlayerPos('player2', players['player2'].sx, players['player2'].sy);
            this.setPlayerPos('player3', players['player3'].sx, players['player3'].sy);
            this.setPlayerPos('player4', players['player4'].sx, players['player4'].sy);
            buildTileMap('player1', this.getPlayerPath('player1'), currentMap);
            buildTileMap('player2', this.getPlayerPath('player2'), currentMap);
            buildTileMap('player3', this.getPlayerPath('player3'), currentMap);
            buildTileMap('player4', this.getPlayerPath('player4'), currentMap);
        },

        getTile: function(x, y) {
            return currentMap[y * mapWidth +x];
        },

        isTile: function(x, y, type) {
            return this.getTile(x, y) === type;
        },

        // getCornerPos: function(corner) {
        //     if (corner === 'top-left') {
        //         return {x: 0, y: 0};
        //     } else if (corner === 'top-right') {
        //         return {x: mapWidth - 1, y: 0};
        //     } else if (corner === 'bottom-left') {
        //         return {x: 0, y: mapHeight - 1};
        //     } else if (corner === 'bottom-right') {
        //         return {x: mapWidth - 1, y: mapHeight - 1};
        //     } else {
        //         throw "Invalid corner type!";
        //     }
        // },

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
        },
        /**
         * Get path from current position to goal
         */
        getPlayerPath: function(player) {
            var pos = this.getPlayerPos(player);
            var where;
            var tmpx = pos.x;
            var tmpy = pos.y;
            //TODO: use cache variable in players obj instead of creating new array here!
            var path = [];
            var found = false;
            var i = 50;

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
                } else if (pos.route[where] == X) {
                    found = true;
                }
                
                path.push({x: tmpx, y: tmpy});

                // XXX: CRC
                if (game.debug) {
                    if (i-- < 0) {
                        console.error("x: %d, y: %d", tmpx, tmpy);
                        throw "Path tracing dead-loop: " + player;
                    }
                }

            } while(!found);

            // XXX: CRC
            if (game.debug) {
                if (path[path.length - 1].x != pos.ex || path[path.length - 1].y != pos.ey) {
                    console.error("got: %d, %d", path[path.length - 1].x, path[path.length - 1].y);
                    console.error("expected: %d %d", pos.ex, pos.ey);
                    throw "Invalid " + player + " path!"
                }
            }

            return path;            
        }

    };
    Object.defineProperty(_instance, 'width', {get: function() { return mapWidth; }});
    Object.defineProperty(_instance, 'height', {get: function() { return mapHeight; }});
    game.map = _instance;

 
    // var XXXX = [
    //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    // ];    
}(game || {}));
