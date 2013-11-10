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
    var H = 10; // hole
    var F = 11; // undefined tile

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
    var buffsMap = null;
    var players = {};

    players[_Globals.wizards.Earth] = {
        x: 0, y: 0, sx: 0, sy: 0, ex: 7, ey: 4, route: player1, pattern: [E, W, F, A], sign: S1
    };
    players[_Globals.wizards.Water] = {
        x: 16, y: 0, sx: 16, sy: 0, ex: 9, ey: 4, route: player2, pattern: [W, F, A, E], sign: S2
    };
    players[_Globals.wizards.Fire] = {
        x: 16, y: 9, sx: 16, sy: 9, ex: 9, ey: 5, route: player3, pattern: [F, A, E, W], sign: S3
    };
    players[_Globals.wizards.Air] = {
        x: 0, y: 9, sx: 0, sy: 9, ex: 7, ey: 5, route: player4, pattern: [A, E, W, F], sign: S4
    };

    function buildTileMap(wizard, path, map) {
        var pos = players[wizard];
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

    function resetWizardPosition(who, tilemap) {
        // this.setPos(who, players[who].sx, players[who].sy);
        players[who].x = players[who].sx;
        players[who].y = players[who].sy;
        buildTileMap(who, _instance.getPath(who), tilemap);
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
            Hole: H,
            Undefined: F,
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
            buffsMap = {};
            resetWizardPosition(_Globals.wizards.Earth, currentMap);
            resetWizardPosition(_Globals.wizards.Water, currentMap);
            resetWizardPosition(_Globals.wizards.Fire, currentMap);
            resetWizardPosition(_Globals.wizards.Air, currentMap);
        },

        setTile: function(x, y, type) {
            currentMap[y * mapWidth + x] = type;
        },

        getTile: function(x, y) {
            return currentMap[y * mapWidth + x];
        },

        isTile: function(x, y, type) {
            return this.getTile(x, y) === type;
        },
        /**
         * Set one or more (de)buffs to a map tile position
         * @param  {Number} x tile column
         * @param  {Number} y tile row
         * @param {Object} buffs Object or Array of objects.
         */
        setTileBuffs: function(x, y, buffs) {
            if (Object.prototype.toString.call(buffs) === '[object Array]') {
                for(var b in buffs) {
                    this.setTileBuffs(x, y, buffs[b]);
                }
            } else {
                var idx = y * mapWidth + x;
                if (typeof buffsMap[idx] === 'undefined') {
                    buffsMap[idx] = [];
                }
                buffsMap[idx].push(buffs);
            }
        },
        /**
         * Get any possible buffs or debuffs associated with given tile
         * @param  {Number} x tile column
         * @param  {Number} y tile row
         * @return {Array}   Array of (de)buff types
         */
        getTileBuffs: function(x, y) {
            return buffsMap[y * mapWidth + x];
        },
        /**
         * Check if any (de)buffs exist at given tile location
         * @param  {[String]}  type (Optional) Will look for specific (de)buff type.
         * @return {Boolean}
         */
        isTileBuffs: function(x, y, type) {
            var buffs = this.getTileBuffs(x, y);
            if (type) {
                for(var b in buffs) {
                    if (buffs[b].type === type)
                        return true;
                }
            } else {
                return (typeof buffs !== 'undefined' && buffs.length > 0)    
            }

            return false;
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

        getPos: function(wizard) {
            return players[wizard];
        },

        setPos: function(wizard, x, y) {
            players[wizard].x = x;
            players[wizard].y = y;
        },

        getNextMove: function(wizard, steps) {
            steps = steps || 1;

            var pos = this.getPos(wizard);
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

        move: function(wizard, steps) {
            var nextPos = this.getNextMove(wizard, steps);
            //TODO: obstacles!?
            this.setPos(nextPos.x, nextPos.y);
        },
        /**
         * Get path from current position to goal
         */
        getPath: function(wizard, steps) {
            var pos = this.getPos(wizard);
            var where;
            var tmpx = pos.x;
            var tmpy = pos.y;
            //TODO: use cache variable in players obj instead of creating new array here!
            var path = [];
            var found = false;
            var i = 0;

            do {
                where = tmpy * mapWidth + tmpx;
                switch(pos.route[where]) {
                    case D: tmpy += 1; break;
                    case U: tmpy -= 1; break;
                    case L: tmpx -= 1; break;
                    case R: tmpx += 1; break;
                    case X: found = true; break;
                    case H: found = true; break;
                    default:
                        throw "Unexpected tile at " + tmpx + "," + tmpy + "!";
                }

                //TODO: check for obstacle
                
                path.push({x: tmpx, y: tmpy});

                if (steps && ++i >= steps) {
                    found = true;
                }

                // XXX: CRC
                if (game.debug) {
                    if (i >= 50) { // cant go further than 50 tiles!
                        console.error("x: %d, y: %d", tmpx, tmpy);
                        throw "Path tracing dead-loop: " + wizard;
                    }
                }

            } while(!found);

            // XXX: CRC
            // if (game.debug) {
            //     if (path[path.length - 1].x != pos.ex || path[path.length - 1].y != pos.ey) {
            //         console.error("got: %d, %d", path[path.length - 1].x, path[path.length - 1].y);
            //         console.error("expected: %d %d", pos.ex, pos.ey);
            //         throw "Invalid " + player + " path!"
            //     }
            // }

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
