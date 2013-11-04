/**
 * wizards.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

game.WizardEntity = me.ObjectEntity.extend({
    /** 
     * constructor
     */
    init: function(x, y, settings) {
        
        settings.spritewidth = 56;
        settings.spriteheight = 56;
        x *= _Globals.gfx.tileWidth;
        y *= _Globals.gfx.tileHeight;
        x += _Globals.canvas.xOffset;
        y += _Globals.canvas.yOffset;
        this.parent(x, y, settings);

        this.collidable = false;
        this.z = _Globals.gfx.zActor;
        this.type = 'wizard';
        this.setMaxVelocity(2.0, 2.0);
        this.renderable.animationspeed = 75;
        
        this.mana = _Globals.defaults.mana;
        this.speed = 0.25;
        this.moving = false;
        this.movement = {};
    },
    /**
     * update function
     */
    update : function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        // if (this.score !== game.data.score) {        
        //         this.score = game.data.score;
        //         return true;
        // }
        // 
        
        // check & update player movement
        if (this.moving) {
            var dx = this.movement.path[this.movement.goalIdx].x * _Globals.gfx.tileWidth;
            var dy = this.movement.path[this.movement.goalIdx].y * _Globals.gfx.tileHeight;
            dx = game.getRealX(dx);
            dy = game.getRealY(dy);            
            var updatePath = false;

            switch(this.movement.direction) {
                case _Globals.directions.Left:
                this.vel.x -= this.speed * me.timer.tick;

                if (!this.renderable.isCurrentAnimation('walk_left'))
                    this.renderable.setCurrentAnimation("walk_left");   

                if (this.pos.x <= dx) {
                    updatePath = true;
                    this.pos.x = dx;
                    this.vel.x = 0;
                    this.renderable.setCurrentAnimation('stand_left');
                }
                break;
                case _Globals.directions.Right:
                this.vel.x += this.speed * me.timer.tick;

                if (!this.renderable.isCurrentAnimation('walk_right'))
                    this.renderable.setCurrentAnimation("walk_right");   

                if (this.pos.x >= dx) {
                    updatePath = true;
                    this.pos.x = dx;
                    this.vel.x = 0;
                    this.renderable.setCurrentAnimation('stand_right');
                }                
                break;
                case _Globals.directions.Up:
                this.vel.y -= this.speed * me.timer.tick;

                if (!this.renderable.isCurrentAnimation('walk_up'))
                    this.renderable.setCurrentAnimation("walk_up");   

                if (this.pos.y <= dy) {
                    this.pos.y = dy;
                    this.vel.y = 0;
                    updatePath = true;
                    this.renderable.setCurrentAnimation('stand_up');
                }                
                break;  
                case _Globals.directions.Down:
                this.vel.y += this.speed * me.timer.tick;

                if (!this.renderable.isCurrentAnimation('walk_down'))
                    this.renderable.setCurrentAnimation("walk_down");   

                if (this.pos.y >= dy) {
                    this.pos.y = dy;
                    this.vel.y = 0;
                    updatePath = true;
                    this.renderable.setCurrentAnimation('stand_down');
                }                    
                break;
            }
            if (updatePath) {
                if (++this.movement.goalIdx >= this.movement.path.length) {
                    this.vel.x = 0;
                    this.vel.y = 0;
                    this.moving = false;                
                } else {
                    this.movement.direction = this.getDirection();
                    if (this.movement.direction == _Globals.directions.None) {
                        console.log('LOST!');
                        console.log(this.movement);
                    }
                }
            }
        }

        this.updateMovement();

        this.parent();
        return true;
    },

    /************************************************************************
     * Actor functions
     */
    
    getMana: function() {
        return this.mana;
    },

    addMana: function(value) {
        this.mana += value;
        this.mana = this.mana > _Globals.defaults.manaMax ? _Globals.defaults.manaMax : this.mana;
    },

    moveTo: function(path) {
        if (Object.prototype.toString.call(path) === '[object Array]') {
            this.movement.path = path;
        } else {
            this.movement.path = [];
            this.movement.path.push(path);
        }
        this.movement.goalIdx = 0;
        this.movement.direction = this.getDirection();
        if (this.movement.direction != _Globals.directions.None) {
            this.moving = true;
            console.log(path);
        }
    },

    getDirection: function() {
        // TODO: cache in movement object
        var dx = this.movement.path[this.movement.goalIdx].x * _Globals.gfx.tileWidth;
        var dy = this.movement.path[this.movement.goalIdx].y * _Globals.gfx.tileHeight;
        dx = game.getRealX(dx);
        dy = game.getRealY(dy);

        if (this.pos.x < dx) {
            return _Globals.directions.Right;
        } else if (this.pos.x > dx) {
            return _Globals.directions.Left;
        } else if (this.pos.y < dy) {
            return _Globals.directions.Down;
        } else if (this.pos.y > dy) {
            return _Globals.directions.Up;
        } else {
            console.log(" pos: %d %d", this.pos.x, this.pos.y)
            console.log("dest: %d %d", dx, dy)
            return _Globals.directions.None;    
        }
    },

    doCastSpell: function(target) {
        //TODO
    },

});

/**
 * EARTH: Entria-Sil
 */
game.EarthWizardEntity = game.WizardEntity.extend({

    init: function(x, y, settings) {
        settings.image = 'earth_wizard';
        this.parent(x, y, settings);

        // setup props
        this.name = 'Entria-Sil';
        
        // setup animations
        this.renderable.addAnimation('stand_left', [9]);
        this.renderable.addAnimation('stand_right', [27]);
        this.renderable.addAnimation('stand_up', [0]);
        this.renderable.addAnimation('stand_down', [18]);
        this.renderable.addAnimation('walk_up', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
        this.renderable.addAnimation('walk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17]);
        this.renderable.addAnimation('walk_down', [18, 19, 20, 21, 22, 23, 24, 25, 26]);
        this.renderable.addAnimation('walk_right', [27, 28, 29, 30, 31, 32, 33, 34, 35]);

        this.renderable.setCurrentAnimation('stand_right');
    }

});

/**
 * WATER: Azalsor
 */
game.WaterWizardEntity = game.WizardEntity.extend({

    init: function(x, y, settings) {
        settings.image = 'earth_wizard';
        this.parent(x, y, settings);

        // setup props
        this.name = 'Azalsor';
        
        // setup animations
        this.renderable.addAnimation('stand_left', [9]);
        this.renderable.addAnimation('stand_right', [27]);
        this.renderable.addAnimation('stand_up', [0]);
        this.renderable.addAnimation('stand_down', [18]);        
        this.renderable.addAnimation('walk_up', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
        this.renderable.addAnimation('walk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17]);
        this.renderable.addAnimation('walk_down', [18, 19, 20, 21, 22, 23, 24, 25, 26]);
        this.renderable.addAnimation('walk_right', [27, 28, 29, 30, 31, 32, 33, 34, 35]);

        this.renderable.setCurrentAnimation('stand_left');
    }

});

/**
 * FIRE: Valeriya
 */
game.FireWizardEntity = game.WizardEntity.extend({

    init: function(x, y, settings) {
        settings.image = 'earth_wizard';
        this.parent(x, y, settings);

        // setup props
        this.name = 'Valeriya';
        
        // setup animations
        this.renderable.addAnimation('stand_left', [9]);
        this.renderable.addAnimation('stand_right', [27]);
        this.renderable.addAnimation('stand_up', [0]);
        this.renderable.addAnimation('stand_down', [18]);        
        this.renderable.addAnimation('walk_up', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
        this.renderable.addAnimation('walk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17]);
        this.renderable.addAnimation('walk_down', [18, 19, 20, 21, 22, 23, 24, 25, 26]);
        this.renderable.addAnimation('walk_right', [27, 28, 29, 30, 31, 32, 33, 34, 35]);

        this.renderable.setCurrentAnimation('stand_left');
    }

});

/**
 * AIR: Rafel
 */
game.AirWizardEntity = game.WizardEntity.extend({

    init: function(x, y, settings) {
        settings.image = 'earth_wizard';
        this.parent(x, y, settings);

        // setup props
        this.name = 'Rafel';
        
        // setup animations
        this.renderable.addAnimation('stand_left', [9]);
        this.renderable.addAnimation('stand_right', [27]);
        this.renderable.addAnimation('stand_up', [0]);
        this.renderable.addAnimation('stand_down', [18]);        
        this.renderable.addAnimation('walk_up', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
        this.renderable.addAnimation('walk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17]);
        this.renderable.addAnimation('walk_down', [18, 19, 20, 21, 22, 23, 24, 25, 26]);
        this.renderable.addAnimation('walk_right', [27, 28, 29, 30, 31, 32, 33, 34, 35]);

        this.renderable.setCurrentAnimation('stand_right');
    }

});