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
        settings.spritewidth = settings.spritewidth ? settings.spritewidth : 56;
        settings.spriteheight = settings.spriteheight ? settings.spriteheight : 98;
        settings.yOffset = settings.yOffset ? settings.yOffset : 5;
        // y coordinate blitting offset
        this.yOffset = settings.yOffset - settings.spriteheight / 2;

        x *= _Globals.gfx.tileWidth;
        y *= _Globals.gfx.tileHeight;
        x += _Globals.canvas.xOffset;
        y += _Globals.canvas.yOffset + this.yOffset;

        this.parent(x, y, settings);

        this.collidable = false;
        this.z = _Globals.gfx.zActor;
        this.type = 'wizard';
        this.setMaxVelocity(2.0, 2.0);
        this.renderable.animationspeed = 100; //_Globals.gfx.animSpeed;
        
        this.speed = 0.125;
        this.moving = false;
        this.movement = {};
        this.animation = {};

        // setup common animations
        this.renderable.addAnimation('stand_left', [0]);
        this.renderable.addAnimation('stand_right', [0]);
        this.renderable.addAnimation('stand_up', [0]);
        this.renderable.addAnimation('stand_down', [0]);
        this.renderable.addAnimation('walk_up', [0, 1, 2, 3, 4, 5]);
        this.renderable.addAnimation('walk_left', [0, 1, 2, 3, 4, 5]);
        this.renderable.addAnimation('walk_down', [0, 1, 2, 3, 4, 5]);
        this.renderable.addAnimation('walk_right', [0, 1, 2, 3, 4, 5]);

        this.renderable.addAnimation('spellcast_left', [0, 1, 2, 3]);
        this.renderable.addAnimation('spellcast_right', [0, 1, 2, 3]);

    },
    /**
     * update function
     */
    update : function () {
        // check & update player movement
        if (this.moving) {
            var dx = this.movement.path[this.movement.goalIdx].x * _Globals.gfx.tileWidth;
            var dy = this.movement.path[this.movement.goalIdx].y * _Globals.gfx.tileHeight + this.yOffset;
            dx = game.getRealX(dx);
            dy = game.getRealY(dy);
            var updatePath = false;
            var animToSet, endx, endy;

            //TODO: use Tweens

            switch(this.movement.direction) {
                case _Globals.directions.Left:
                    this.vel.x -= this.speed * me.timer.tick;

                    if (!this.renderable.isCurrentAnimation('walk_left'))
                        this.renderable.setCurrentAnimation("walk_left");

                    if (this.pos.x <= dx) {
                        updatePath = true;
                        animToSet = 'stand_left';
                    }
                break;
                case _Globals.directions.Right:
                    this.vel.x += this.speed * me.timer.tick;

                    if (!this.renderable.isCurrentAnimation('walk_right'))
                        this.renderable.setCurrentAnimation("walk_right");   

                    if (this.pos.x >= dx) {
                        updatePath = true;
                        animToSet = 'stand_right';
                    }
                break;
                case _Globals.directions.Up:
                    this.vel.y -= this.speed * me.timer.tick;

                    if (!this.renderable.isCurrentAnimation('walk_up'))
                        this.renderable.setCurrentAnimation("walk_up");

                    if (this.pos.y <= dy) {
                        updatePath = true;
                        animToSet = 'stand_up';
                    }
                break;  
                case _Globals.directions.Down:
                    this.vel.y += this.speed * me.timer.tick;

                    if (!this.renderable.isCurrentAnimation('walk_down'))
                        this.renderable.setCurrentAnimation("walk_down");

                    if (this.pos.y >= dy) {
                        updatePath = true;
                        animToSet = 'stand_down';
                    }
                break;
            }

            if (updatePath) {
                if (++this.movement.goalIdx >= this.movement.path.length) {
                    this.vel.x = 0;
                    this.vel.y = 0;
                    this.pos.x = dx;
                    this.pos.y = dy;
                    this.moving = false;
                    this.renderable.setCurrentAnimation(animToSet);
                    // notify
                    this.movement.cb && this.movement.cb();
                } else {
                    var newDirection = this.getDirection(dx, dy);
                    if (this.movement.direction != newDirection) {
                        this.vel.x = 0;
                        this.vel.y = 0;
                        // this.pos.x = dx;
                        // this.pos.y = dy;                        
                    }
                    this.movement.direction = newDirection;
                    // sanity check
                    if (this.movement.direction == _Globals.directions.None) {
                        console.error('*** LOST DIRECTION ***');
                        console.error(this.movement);
                        // notify !?
                        this.movement.cb && this.movement.cb();                        
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
    
    // setVisible: function(value) {
    //     if (value)
    //         this.renderable.visible = value;
    //     return this.renderable.visible;
    // },
    
    playAnimation: function(name, cb) {
        this.animation.prev = this.animation.current;
        this.renderable.setCurrentAnimation(name, cb);
        this.animation.current = name;
    },
    /**
     * Move on given tile path
     * @param tilePath Object or array of x and y tile coordinates
     * @param cb Callback 
     */
    moveTo: function(tilePath, cb) {
        if (Object.prototype.toString.call(tilePath) === '[object Array]') {
            this.movement.path = tilePath;
        } else {
            this.movement.path = [];
            this.movement.path.push(tilePath);
        }
        this.movement.goalIdx = 0;
        this.movement.direction = this.getDirection();
        this.movement.cb = cb;
        if (this.movement.direction != _Globals.directions.None) {
            this.moving = true;
        } else {
            // we're already there!
            cb && cb();
        }
    },

    setPosition: function(x, y) {
        this.pos.x = game.getRealX(x * _Globals.gfx.tileWidth);
        this.pos.y = game.getRealY(y * _Globals.gfx.tileHeight + this.yOffset);
    },

    getDirection: function(currentX, currentY) {
        // TODO: cache in movement object
        var dx = this.movement.path[this.movement.goalIdx].x * _Globals.gfx.tileWidth;
        var dy = this.movement.path[this.movement.goalIdx].y * _Globals.gfx.tileHeight + this.yOffset;
        dx = game.getRealX(dx);
        dy = game.getRealY(dy);

        currentX = currentX ? currentX : this.pos.x;
        currentY = currentY ? currentY : this.pos.y;

        if (currentX < dx) {
            return _Globals.directions.Right;
        } else if (currentX > dx) {
            return _Globals.directions.Left;
        } else if (currentY < dy) {
            return _Globals.directions.Down;
        } else if (currentY > dy) {
            return _Globals.directions.Up;
        } else {
            console.log(" pos: %d %d", currentX, currentY)
            console.log("dest: %d %d", dx, dy)
            return _Globals.directions.None;    
        }
    },

    getFacing: function(targetTile) {
        if (this.pos.x < game.getRealX(targetTile.x)) {
            return _Globals.directions.Right;
        } else {
            return _Globals.directions.Left;
        }         
    },

    doSpellCast: function(targetTile, cb) {
        var self = this;
        var facing = this.getFacing(targetTile);
        if (facing == _Globals.directions.Left) {
            this.playAnimation('spellcast_left', function() {
                self.playAnimation(self.animation.prev);
                cb && cb();
            });
        } else {
            this.playAnimation('spellcast_right', function() {
                self.playAnimation(self.animation.prev);
                cb && cb();
            });
        }
    },

});
/**
 * EARTH: Entria-Sil
 */
game.EarthWizardEntity = game.WizardEntity.extend({
    init: function(x, y, settings) {
        settings.image = 'earth_front';
        this.parent(x, y, settings);

        // setup props
        this.name = 'Entria-Sil';
        
        // {!} EXPR
        this.renderable.addAnimation('stand_left', [0]);
        this.renderable.addAnimation('stand_right', [0]);
        this.renderable.addAnimation('stand_up', [0]);
        this.renderable.addAnimation('stand_down', [0]);
        this.renderable.addAnimation('walk_up', [0, 1, 2, 3, 4, 5]);
        this.renderable.addAnimation('walk_left', [0, 1, 2, 3, 4, 5]);
        this.renderable.addAnimation('walk_down', [0, 1, 2, 3, 4, 5]);
        this.renderable.addAnimation('walk_right', [0, 1, 2, 3, 4, 5]);

        this.renderable.addAnimation('spellcast_left', [0, 1, 2, 3]);
        this.renderable.addAnimation('spellcast_right', [0, 1, 2, 3]);

        this.playAnimation('stand_right');
    }
});
/**
 * WATER: Azalsor
 */
game.WaterWizardEntity = game.WizardEntity.extend({
    init: function(x, y, settings) {
        settings.image = 'water_front';
        this.parent(x, y, settings);

        // setup props
        this.name = 'Azalsor';

        this.playAnimation('stand_down');        
    }
});
/**
 * FIRE: Valeriya
 */
game.FireWizardEntity = game.WizardEntity.extend({
    init: function(x, y, settings) {
        settings.image = 'fire_front';
        this.parent(x, y, settings);

        // setup props
        this.name = 'Valeriya';

        this.playAnimation('stand_left');
    }
});
/**
 * AIR: Rafel
 */
game.AirWizardEntity = game.WizardEntity.extend({
    init: function(x, y, settings) {
        settings.image = 'air_front';
        this.parent(x, y, settings);

        // setup props
        this.name = 'Rafel';

        this.playAnimation('stand_right');
    }
});