/**
 * map.js
 *
 * Copyright (c) 2014 Dvubuz Games
 *
 */

/* jshint -W030 */

(function TileMap(game) {
    
    /**
     * Constants
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
    var UF = 11; // undefined tile

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
    var tileRepetitions = [2, 1, 2, 1, 2, 1];
    var currentMap = null;
    var originalMap = null;
    var buffsMap = null;
    var players = {};

    players[_Globals.wizards.Earth] = {
        x: 0, y: 0, sx: 0, sy: 0, ex: 7, ey: 4, route: player1, pattern: [E, W, F, A], sign: S1, steps2go: undefined
    };
    players[_Globals.wizards.Water] = {
        x: 16, y: 0, sx: 16, sy: 0, ex: 9, ey: 4, route: player2, pattern: [W, F, A, E], sign: S2, steps2go: undefined
    };
    players[_Globals.wizards.Fire] = {
        x: 16, y: 9, sx: 16, sy: 9, ex: 9, ey: 5, route: player3, pattern: [F, A, E, W], sign: S3, steps2go: undefined
    };
    players[_Globals.wizards.Air] = {
        x: 0, y: 9, sx: 0, sy: 9, ex: 7, ey: 5, route: player4, pattern: [A, E, W, F], sign: S4, steps2go: undefined
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
        for(var i = 0; i < path.length - 1; i++) {
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
        var path = _instance.getPath(who);
        players[who].steps2go = path.length;
        players[who].x = players[who].sx;
        players[who].y = players[who].sy;
        buildTileMap(who, path, tilemap);
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
            Abyss: H,
            Clay: UF,
            Base1: S1,
            Base2: S2,
            Base3: S3,
            Base4: S4,
            // others
            Frozen: UF + 5,
            Stone: UF + 6,
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
            // fill in tiles
            resetWizardPosition(_Globals.wizards.Earth, currentMap);
            resetWizardPosition(_Globals.wizards.Water, currentMap);
            resetWizardPosition(_Globals.wizards.Fire, currentMap);
            resetWizardPosition(_Globals.wizards.Air, currentMap);
            // create a copy of the original tilemap
            originalMap = currentMap.slice(0);
        },

        restoreTile: function(x, y) {
            var idx = y * mapWidth + x;
            currentMap[idx] = originalMap[idx];
        },

        setTile: function(x, y, type, forever) {
            currentMap[y * mapWidth + x] = type;
            if (!!forever)
                originalMap[y * mapWidth + x] = type;
        },

        getTile: function(x, y, original) {
            if (original)
                return originalMap[y * mapWidth + x];

            return currentMap[y * mapWidth + x];
        },

        isTile: function(x, y, type) {
            return this.getTile(x, y) === type;
        },
        /**
         * Get all tiles by type
         * @param  {Number} type [description]
         * @return {Array}      [description]
         */
        getAllTiles: function(type) {
            var path = [];
            for (var y = mapHeight - 1; y >= 0; y--) {
                for (var x = mapWidth - 1; x >= 0; x--) {
                    if (currentMap[y * mapWidth + x] === type) {
                        path.push({x: x, y: y});
                    }
                }
            }
            return path;
        },
        /**
         * Set (de)buff to a map tile position
         * @param  {Number} x tile column
         * @param  {Number} y tile row
         * @param {Object} buff Object 
         */
        setTileBuff: function(x, y, buff) {
            var idx = y * mapWidth + x;
            // if (typeof buffsMap[idx] === 'undefined') {
            //     buffsMap[idx] = buff;
            // }
            buff.x = x;
            buff.y = y;
            buffsMap[idx] = buff;
            return idx;
        },
        /**
         * Get buff or debuff associated with given tile
         * @param  {Number} x tile column or tilemap index. If you pass index, y must be keft undefined.
         * @param  {Number} y tile row
         * @return {Object} (de)buff Object
         */
        getTileBuff: function(x, y) {
            if (typeof y === 'undefined') {
                return buffsMap[x];
            }
            return buffsMap[y * mapWidth + x];
        },
        /**
         * Check if any (de)buffs exist at given tile location
         * @param  {[String]}  type (Optional) Will look for specific (de)buff type.
         * @return {Boolean}
         */
        isTileBuff: function(x, y, type) {
            var buff = this.getTileBuff(x, y);
            if (buff && type) {
                return buff.type === type;
            }
            return (typeof buffs !== 'undefined');
        },

        removeTileBuff: function(x, y) {
            buffsMap[y * mapWidth + x] = null;
            // delete buffsMap[y * mapWidth + x];
            // var clr = _.without(tileBuffs, buffs);
            _Globals.debug('removed buff at: ', x, y);
        },

        walkBuffs: function(callback) {
            _.each(buffsMap, function(value, key) {
                value && callback(value);
            });
        },

        isTileOccupied: function(x, y) {
            for(var player in players) {
                if (players[player].x === x && players[player].y === y)
                    return true;
            }
            return false;
        },
        /**
         * Is it possible to cast spell on given tile position
         * @param  {Number} x tile column
         * @param  {Number} y tile row
         * @return {Boolean}
         */
        isTileSelectable: function(x, y) {
            var type = this.getTile(x, y);
            return type === X /*|| type === UF*/ || type === S1 || type === S2 || type === S3 || type === S4;
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

            // TODO: optimize !
            var path = this.getPath(wizard);
            players[wizard].steps2go = path.length;
            // console.log(wizard + ' has ' + players[wizard].steps2go + ' left');
        },

        getStepsLeft: function(wizard) {
            return players[wizard].steps2go;
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
                if (pos.route[where] === D) {
                    tmpy += 1;
                } else if (pos.route[where] === U) {
                    tmpy -= 1;
                } else if (pos.route[where] === L) {
                    tmpx -= 1;
                } else if (pos.route[where] === R) {
                    tmpx += 1;
                } else {
                    break; // we (hopefully) reached the goal
                }
            } while(--i > 0);

            return {x: tmpx, y: tmpy};
        },

        // move: function(wizard, steps) {
        //     var nextPos = this.getNextMove(wizard, steps);
        //     //TODO: obstacles!?
        //     this.setPos(nextPos.x, nextPos.y);
        // },
        /**
         * Get path from current position to goal
         */
        getPath: function(wizard, steps, includePos) {
            var pos = this.getPos(wizard);
            var where;
            var tmpx = pos.x;
            var tmpy = pos.y;
            //TODO: use cache variable in players obj instead of creating new array here!
            var path = [];
            var found = false;
            var i = 0;

            if (typeof steps === "boolean")
                includePos = steps;

            // include current player position
            if (includePos === true) {
                if (pos.x !== pos.sx || pos.y !== pos.sy)
                    path.push({x: pos.x, y: pos.y});
            }

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
                
                // console.log("x: %d, y: %d", tmpx, tmpy);
                if (found === true)
                    break;

                // // check for obstacles
                // // if (buffsMap[where] && buffsMap[where].length > 0) {
                //     if (this.isTileBuff(tmpx, tmpy, _Globals.spells.Abyss)) {
                //         found = true;
                //         break;
                //     }
                // // }

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
        },

        findFirstTile: function(path, type, lookup, range) {
            var buff;
            if (lookup === 'buff') {
                buff = type;
                type = undefined;
            } else if (typeof lookup === "number") {
                range = lookup;
            }

            var len = range || path.length;
            len = Math.min(path.length, len);

            for (var i = 0; i < len; i++) {
                if (type && this.isTile(path[i].x, path[i].y, type)) {
                    return {x: path[i].x, y: path[i].y};
                }
                if (buff && this.isTileBuff(path[i].x, path[i].y, buff)) {
                    return {x: path[i].x, y: path[i].y};
                }
            }
            return false;
        },

        isTileOnPath: function(path, type, buff) {
            // return !(this.findFirstTile(path, type, buff) === false);
            return (this.findFirstTile(path, type, buff) === true);
        },

        isBuffOnPath: function(path, buff) {
            return this.isTileOnPath(path, undefined, buff);
        }

    };
    Object.defineProperty(_instance, 'width', {get: function() { return mapWidth; }});
    Object.defineProperty(_instance, 'height', {get: function() { return mapHeight; }});
    game.map = _instance;  
}(game || {}));
