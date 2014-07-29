/**
 * menu.js
 *
 * Copyright (c) 2014 Dvubuz Games
 *
 */

game.MenuScene.HUD = game.MenuScene.HUD || {};

/**
 * Menu UI Container
 */
game.MenuScene.HUD.Base = me.ObjectContainer.extend({
    init: function(eventHandler, settings) {
        // call the constructor
        this.parent();
        
        // non collidable
        this.collidable = false;
        
        // make sure our object is always draw first
        this.z = _Globals.gfx.zHUD;
        this.sortOn = "y";
        // give a name
        this.name = "menu-HUD";

        // (default) event handler 
        this.eventHandler = eventHandler;

        // back to title screen
        this.backBtnRect = new me.Rect(new me.Vector2d(_Globals.canvas.gameWidth - 74, 28), 60, 40);

        // create font to draw texts
        this.text = null;
        this.fontSmall = new me.Font('dafont', '12px', 'white', 'left');
        this.font = new me.Font('dafont', '15px', 'white', 'left');
        this.font.lineHeight = 1.4;
        this.fontBlack = new me.Font('dafont', '24px', 'black', 'left');
        this.fontShadow = new me.Font('dafont', '24px', 'white', 'left');
        this.xText = 0;
        this.yText = 0;

        // sort renderable        
        this.sort();
    },
    /**
     * Custom reset event
     */
    onResetEvent: function() {
        var parent = this;
        me.input.registerPointerEvent('mousedown', this.backBtnRect, function() {
            // unregister clickable area
            me.input.releasePointerEvent('mousedown', parent.backBtnRect); 
            // notify
            parent.onEvent('onClick_Title');
            // play sound
            me.audio.play('click', false);            
        });

        // audio controls
        game.MenuScene.HUD.Audio.hide.call(this);
        game.MenuScene.HUD.Audio.show.call(this);        

    },
    /**
     * @override
     */
    draw: function(context) {
        this.parent(context);
        if (this.text) {
            this.font.draw(context, this.text, this.xText, this.yText);
        }
    },

    drawBackButton: function(context) {
        this.fontShadow.draw(context, nls.get('menu.back'), this.backBtnRect.pos.x + 1, this.backBtnRect.pos.y + 1);
        this.fontBlack.draw(context, nls.get('menu.back'), this.backBtnRect.pos.x, this.backBtnRect.pos.y);
    },    
    // Propagate UI event to handler
    onEvent: function(name) {
        if (this.eventHandler) {
            this.eventHandler[name].call(this.eventHandler, Array.prototype.slice.call(arguments, 1));
        }
    },

    drawText: function(text) {
        this.text = text;
    },

    clearText: function() {
        this.text = null;
    }
});
/**
 * Title HUD
 */
game.MenuScene.HUD.Title = game.MenuScene.HUD.Base.extend({
    init: function(eventHandler, settings) {
        // call the constructor
        this.parent(eventHandler, settings);

        // draw background
        var sx = _Globals.canvas.width / 2 - 900 / 2;
        var sy = 92;
        this.imageBackground = new me.SpriteObject(sx, sy, me.loader.getImage('menu_background'));
        this.addChild(this.imageBackground);        

        var parent = this;
        var props = {
            width: 167,
            height: 107,
            image: 'menu_buttons'
        };
        var btny = 510;
        var btnx = _Globals.canvas.width / 2 - props.width / 2; // * 2 / 2;
        btnx -= props.width / 2;

        // play
        this.btnPlay = new game.MenuScene.HUD.Clickable(btnx, btny, _.extend(_.clone(props), {
            frame: 1,
            onClick: function() {
                parent.onEvent('onClick_Play');
            }
        }));
        this.addChild(this.btnPlay);

        // options
        // btnx += props.width;
        
        // this.btnOptions = new game.MenuScene.HUD.Clickable(btnx, btny, _.extend(_.clone(props), {
        //     frame: 5,
        //     onClick: function() {
        //         parent.onEvent('onClick_Options');
        //     }
        // }));
        // this.addChild(this.btnOptions);

        // howtoplay
        btnx += props.width;
        this.btnHowTo = new game.MenuScene.HUD.Clickable(btnx, btny, _.extend(_.clone(props), {
            frame: 3,
            onClick: function() {
                parent.onEvent('onClick_HowTo');
            }
        }));
        this.addChild(this.btnHowTo);

        this.sort();
    },
    /**
     * @override
     */
    draw: function(context) {
        this.parent(context);
        this.font.draw(context, 'by Dvubuz Games', 448, 632);
        this.fontSmall.draw(context, 'v' + _version.buildnumber, 
            _Globals.canvas.gameWidth - 15, _Globals.canvas.gameHeight - 26);
    }    
});
/**
 * Select Character HUD
 */
game.MenuScene.HUD.SelectCharacter = game.MenuScene.HUD.Base.extend({
    init: function(eventHandler, settings) {
        // call the constructor
        this.parent(eventHandler, settings);

        var parent = this;
        var sequence = [_Globals.wizards.Earth, _Globals.wizards.Water, _Globals.wizards.Fire, _Globals.wizards.Air];

        this.actors = {};
        this.touchRects = {};
        this.selectedActor = null;
        
        // draw wizards
        var wx = _Globals.canvas.xOffset + 36, wy = _Globals.canvas.yOffset;
        this.actorsFrames = [[0, 4], [1, 5], [2, 6], [3, 7]];

        for (var i = 0; i < sequence.length; i++) {
            this.actors[sequence[i]] = new game.MenuScene.HUD.Clickable(wx, wy, {
                width: 220,
                height: 450,
                image: 'menu_characters',
                frame: this.actorsFrames[i],
                fade: false,
                onClick: this.touchWizard.bind(this, sequence[i])
            });            
            this.addChild(this.actors[sequence[i]]);

            wx += 220;
        }

        // add buttons
        // this.btnStart = null;

        // var btnX = _Globals.canvas.width / 2 - 167 / 2;
        // var btnX = _Globals.canvas.gameWidth - 167;

        // this.btnStart = new game.MenuScene.HUD.Clickable(btnX, _Globals.canvas.height - 124, {
        //         width: 167,
        //         height: 107,                
        //         image: 'menu_buttons',
        //         frame: 0,
        //         onceClick: false,
        //         onClick: function() {
        //             if (parent.selectedActor) {
        //                 parent.onEvent('onClick_StartGame', parent.selectedActor);
        //             }
        //         }
        // });
        // this.btnStart.visible = false;
        // this.addChild(this.btnStart);
       
        // text positions
        this.xText = _Globals.canvas.xOffset + 50;
        this.yText = _Globals.canvas.height - 110;    

        this.sort();
    },
    /**
     * Custom reset event
     */
    onResetEvent: function() {
        var parent = this;

        if (this.btnStart) {
            this.removeChild(this.btnStart);
        }

        var btnX = _Globals.canvas.gameWidth - 167
          , btnY = _Globals.canvas.height - 124;

        this.btnStart = new game.MenuScene.HUD.Clickable(btnX, btnY, {
                width: 167,
                height: 107,
                image: 'menu_buttons',
                frame: 0,
                onceClick: false,
                onClick: function() {
                    if (parent.selectedActor) {

                        // remove clickables
                        for (var i in this.actors) {
                            this.actors[i].clear();
                        }                        

                        parent.onEvent('onClick_StartGame', parent.selectedActor);
                    }
                }
        });
        
        if (!parent.selectedActor && this.btnStart) {
            this.btnStart.visible = false;
        }

        this.addChild(this.btnStart);

        this.parent();
    },    
    /**
     * @override
     * Release wizards onClick events before destroying object container
     */
    destroy: function() {
        for (var i in this.actors) {
            this.actors[i].clear();
            this.removeChild(this.actors[i]);
        }
        this.parent();
    },
    /**
     * @override
     */
    draw: function(context) {
        this.parent(context);

        var width = 300; //this.font.measureText(context, nls.get('menu.select_character'));
        var xpos = _Globals.canvas.xOffset + 50; // _Globals.canvas.width / 2 - width / 2;
        this.fontShadow.draw(context, nls.get('menu.select_character'), xpos + 1, 28 + 1);
        this.fontBlack.draw(context, nls.get('menu.select_character'), xpos, 28);

        this.drawBackButton(context);
    }, 

    touchWizard: function(who) {
        var self = this;
        var actor = this.actors[who];

        var j = 0;
        for (var i in this.actors) {
            this.actors[i].setAnimationFrame(0);
            j++;
        }

        // mark selected character
        this.selectedActor = who;
        actor.setAnimationFrame(1);
        // show play button
        if (this.btnStart) {
            this.btnStart.visible = true;
        }
        
        switch(who) {
            case _Globals.wizards.Earth:
                this.drawText(nls.get('menu.wiz_earth'));
            break;
            case _Globals.wizards.Water:
                this.drawText(nls.get('menu.wiz_water'));
            break;
            case _Globals.wizards.Fire:
                this.drawText(nls.get('menu.wiz_fire'));
            break;
            case _Globals.wizards.Air:
                this.drawText(nls.get('menu.wiz_air'));
            break;
        }
    }
});
/**
 * HOW-TO HUD
 */
game.MenuScene.HUD.HowTo = game.MenuScene.HUD.Base.extend({
    init: function(eventHandler, settings) {
        // call the constructor
        this.parent(eventHandler, settings);

        var i, parent = this;

        // add title and content, init subpager
        var subpager = 0;
        // subpages are added by array order
        var subtitle = ['menu.howto_turns_title', 'menu.howto_chance_title', 'menu.howto_spells_mana_title']; //,'menu.howto_story_title','menu.howto_turns_title'];
        var subtext = ['menu.howto_turns', 'menu.howto_chance', 'menu.howto_spells_mana']; //,'menu.howto_story','menu.howto_turns'];
        
        // add content for the first subpage
        // @TODO: How to make a initial call of the onClick_Pager function from here to get the default content?  
        // parent.onClick_Pager(subtitle,subtext,subpager);
        var page;
        page = nls.get(subtitle[subpager]);
        page += nls.get(subtext[subpager]);
        this.drawText(page);

        var btny = 580, offsetX = 76;
        var props = {
            width: 38,
            height: 65,
            image: 'dlg_btn_back'
        };

        // Init previous/next buttons
        this.btnPrevious = new game.MenuScene.HUD.Clickable(offsetX, btny, _.extend(_.clone(props), {
            frame: 1,
            onClick: function() {  
                // decrease pager and call onClick_Pager to generate the previous page 
                subpager--;
                parent.onClick_Pager(subtitle, subtext, subpager, subpager + 1);
            }
        }));

        this.btnNext = new game.MenuScene.HUD.Clickable(_Globals.canvas.width - offsetX * 1.75, btny, 
            _.extend(_.clone(props), {
                frame: 3,
                onClick: function() {
                    // increase pager and call onClick_Pager to generate the next page
                    subpager++;
                    parent.onClick_Pager(subtitle, subtext, subpager, subpager - 1);
                }
            }
        ));

        // add next button (previous see onClick_Pager)
        this.addNext();

        // set text position
        this.xText = _Globals.canvas.xOffset + 50;
        this.yText = 120; 

        // page 1
        this.imageBackground = new me.SpriteObject(_Globals.canvas.xOffset + 50, 260, 
            me.loader.getImage('menu_howto_01'));

        // page 2
        this.imageChance = [];
        for(i = 0; i < 3; i++) {
            this.imageChance[i] = new me.AnimationSheet(_Globals.canvas.xOffset + 50, 225 + i * 105, 
                me.loader.getImage('dlg_btn_choice'), 149, 85);
            this.imageChance[i].addAnimation('main', [i + 3]);
            this.imageChance[i].setCurrentAnimation('main');    
            this.imageChance[i].animationpause = true;

            this.imageChance[i + 3] = new me.AnimationSheet(_Globals.canvas.xOffset + 450, 225 + i * 105, 
                me.loader.getImage('dlg_btn_choice'), 149, 85);
            this.imageChance[i + 3].addAnimation('main', [i + 3 + 3]);
            this.imageChance[i + 3].setCurrentAnimation('main');    
            this.imageChance[i + 3].animationpause = true;
        }

        // page 3
        this.imageSpells = [];
        for(i = 0; i < 3; i++) {
            this.imageSpells[i] = new me.AnimationSheet(_Globals.canvas.xOffset + 50, 250 + i * 105, 
                me.loader.getImage('dlg_btn_spells'), 74, 85);
            this.imageSpells[i].addAnimation('main', [i + 7]);
            this.imageSpells[i].setCurrentAnimation('main');    
            this.imageSpells[i].animationpause = true;

            this.imageSpells[i + 3] = new me.AnimationSheet(_Globals.canvas.xOffset + 500, 250 + i * 105, 
                me.loader.getImage('dlg_btn_spells'), 74, 85);
            this.imageSpells[i + 3].addAnimation('main', [i + 7 + 3]);
            this.imageSpells[i + 3].setCurrentAnimation('main');    
            this.imageSpells[i + 3].animationpause = true;
        }
        // add 7th image
        i = 6;
        this.imageSpells[i] = new me.AnimationSheet(_Globals.canvas.xOffset + 500, 250 + 3 * 105, 
            me.loader.getImage('dlg_btn_spells'), 74, 85);
        this.imageSpells[i].addAnimation('main', [i + 7]);
        this.imageSpells[i].setCurrentAnimation('main');    
        this.imageSpells[i].animationpause = true;        

        this.addChild(this.imageBackground);
        this.sort();
    },

    addNext: function(remove) {
        if (remove === true && this.btnNextEnabled) {
            this.removeChild(this.btnNext);
            this.btnNextEnabled = false;
        } else {
            this.addChild(this.btnNext);
            this.btnNextEnabled = true;
        }
    },

    addPrev: function(remove) {
        if (remove === true && this.btnPreviousEnabled) {
            this.removeChild(this.btnPrevious);
            this.btnPreviousEnabled = false;
        } else {
            this.addChild(this.btnPrevious);
            this.btnPreviousEnabled = true;
        }
    },
    /**
     * Custom reset event
     */
    // onResetEvent: function() {
    //     // this.addNext(true);
    //     // this.addPrev(true);
    //     this.parent();
    // },
    /**
     * small pager function
     * pagination throu arrrays of i10n strings
     */
    onClick_Pager: function (title, text, pager, prevpager) {
            
        var maxpage = title.length - 1;
        var page, i;
        
        // build and add the content
        page = nls.get(title[pager]);
        page += nls.get(text[pager]);
        this.drawText(page, pager);
        // TODO: draw positioned texts
        this.pager = pager;

        switch(pager) {

            case 0:
                // add
                this.addChild(this.imageBackground);
                // remove
                for(i = 0; i < 6; i++) {
                    this.removeChild(this.imageChance[i]);
                }
            break;

            case 1:
                // add
                for(i = 0; i < 6; i++) {
                    this.addChild(this.imageChance[i]);
                }
                // remove
                if (prevpager === 0) {
                    this.removeChild(this.imageBackground);
                } else if (prevpager === 2) {
                    for(i = 0; i < 7; i++) {
                        this.removeChild(this.imageSpells[i]);
                    }
                }
            break;

            case 2:
                // add
                for(i = 0; i < 7; i++) {
                    this.addChild(this.imageSpells[i]);
                }
                // remove
                if (prevpager === 1) {
                    for(i = 0; i < 6; i++) {
                        this.removeChild(this.imageChance[i]);
                    }
                }
            break;

            case 3:
                //TODO:
            break;
        }
       
        // if necessary, add previous and next button to the page
        if (pager <= 0) {
            this.addPrev(true);
        }
        if (pager > 0) {
            this.addPrev();
        }
        if (pager >= maxpage) {
            this.addNext(true);
        }
        if (pager < maxpage) {
            this.addNext();
        }
    },
    /**
     * @override
     */
    draw: function(context) {
        this.parent(context);
        
        var texts, i;
        var width = 300; //this.font.measureText(context, nls.get('menu.select_character'));
        var xpos = _Globals.canvas.xOffset + 50; // _Globals.canvas.width / 2 - width / 2;
        this.fontShadow.draw(context, nls.get('menu.how_to_play_title'), xpos + 1, 28 + 1);
        this.fontBlack.draw(context, nls.get('menu.how_to_play_title'), xpos, 28);

        if (this.pager === 1) {
            texts = nls.get('menu.howto_chance_texts');
            for(i = 0; i < 3; i++) {
                this.font.draw(context, texts[i], 250, 250 + i * 100);
                this.font.draw(context, texts[i + 3], 650, 250 + i * 100);
            }            
        } else if (this.pager === 2) {
            texts = nls.get('menu.howto_rules_texts');
            for(i = 0; i < 3; i++) {
                this.font.draw(context, texts[i], 170, 260 + i * 105);
                this.font.draw(context, texts[i + 3], 620, 260 + i * 105);
            }
            i = 6;
            this.font.draw(context, texts[i], 620, 260 + 3 * 105);
        }


        this.drawBackButton(context);
    }    
     
});

/**
 * Options
 */
// game.MenuScene.HUD.Options = game.MenuScene.HUD.Base.extend({
//     init: function(eventHandler, settings) {
//         // call the constructor
//         this.parent(eventHandler, settings);

//         var parent = this;
//         var props = {
//             width: 167,
//             height: 107,
//             image: 'menu_buttons'
//         };
//         var btny = _Globals.canvas.yOffset + 107;
//         var btnx = _Globals.canvas.width / 2;
//         btnx -= props.width / 2;

//         this.soundOn = persistence.get(persistence.SOUND);
//         this.musicOn = persistence.get(persistence.MUSIC);
//         // toggle sound
//         this.btnSound = new game.MenuScene.HUD.Clickable(btnx, btny, _.extend(_.clone(props), {
//             frame: [6, 7],
//             onClick: function() {
//                 parent.soundOn = !parent.soundOn;
//                 parent.btnSound.setFrame(parent.soundOn ? 7 : 6);
//                 // save sound opt
//                 persistence.set(persistence.SOUND, parent.soundOn).commit();
//             }
//         }));
//         this.btnSound.setFrame(parent.soundOn ? 7 : 6);
//         // toggle music
//         btny += props.height;
//         this.btnMusic = new game.MenuScene.HUD.Clickable(btnx, btny, _.extend(_.clone(props), {
//             frame: [8, 9],
//             onClick: function() {
//                 parent.musicOn = !parent.musicOn;
//                 parent.btnMusic.setFrame(parent.musicOn ? 9 : 8);
//                 // save music opt
//                 persistence.set(persistence.MUSIC, parent.musicOn).commit();
//             }
//         }));
//         this.btnMusic.setFrame(parent.musicOn ? 9 : 8);

//         this.addChild(this.btnSound);
//         this.addChild(this.btnMusic);

//         this.sort();
//     },
//     /**
//      * @override
//      */
//     draw: function(context) {
//         this.parent(context);
//         this.drawBackButton(context);
//     }    
// });