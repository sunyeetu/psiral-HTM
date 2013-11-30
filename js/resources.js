/**
 * resources.js
 *
 * Copyright (c) 2013 Petar Petrov
 *
 * This work is licensed under the Creative Commons Attribution-NoDerivs 3.0 Unported License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/3.0/.
 */

game.resources = [
    // Gfx
    {name: "boardtileset", type:"image", src: "assets/gfx/tiles.png"},
    {name: "fountain", type:"image", src: "assets/gfx/fountain.png"},
    {name: "spells", type:"image", src: "assets/gfx/spells.png"},
    {name: "earth", type:"image", src: "assets/gfx/wz_earth.png"},
    {name: "water_front", type:"image", src: "assets/gfx/wz_water.png"},
    {name: "fire_front", type:"image", src: "assets/gfx/wz_fire.png"},
    {name: "air_front", type:"image", src: "assets/gfx/wz_air.png"},

    // Hud
    {name: "hud_faces", type:"image", src: "assets/gui/mana_character_icons.png"},
    {name: "hud_mana", type:"image", src: "assets/gui/mana_points.png"},
    {name: "hud_text", type:"image", src: "assets/gui/upper_text_box.png"},

    {name: "dlg_big", type:"image", src: "assets/gui/popup_bg_01.png"},
    {name: "dlg_small", type:"image", src: "assets/gui/popup_bg_02.png"},
    {name: "dlg_faces", type:"image", src: "assets/gui/popup_menu_character_icons.png"},
    {name: "dlg_btn_choice", type:"image", src: "assets/gui/choice_btns.png"},
    {name: "dlg_dice_anim", type:"image", src: "assets/gui/dice_points.png"},
    {name: "dlg_btn_spells", type:"image", src: "assets/gui/magic_btns.png"},
    {name: "dlg_btn_back", type:"image", src: "assets/gui/magic_btn_back.png"},

    // Menu
    {name: "menu_background", type:"image", src: "assets/gui/splash_img.jpg"},
    {name: "menu_characters", type:"image", src: "assets/gui/character_choice.png"},
    {name: "menu_buttons", type:"image", src: "assets/gui/play_btn.png"},

    // Sound
    {name: "click", type: "audio", src: "assets/sfx/", channel: 1},
    {name: "rolldice", type: "audio", src: "assets/sfx/", channel : 1},
    {name: "rolldice2", type: "audio", src: "assets/sfx/", channel : 1},
    {name: "teleport", type: "audio", src: "assets/sfx/", channel : 1},
    {name: "freeze", type: "audio", src: "assets/sfx/", channel : 1},
    {name: "blind", type: "audio", src: "assets/sfx/", channel : 1},
    {name: "path", type: "audio", src: "assets/sfx/", channel : 1},
    {name: "change", type: "audio", src: "assets/sfx/", channel : 1},
    {name: "abyss", type: "audio", src: "assets/sfx/", channel : 1},
    {name: "walk", type: "audio", src: "assets/sfx/", channel : 1},
    {name: "win", type: "audio", src: "assets/sfx/", channel : 1},
    
    // Music
    {name: "elementary_wave", type: "audio", src: "assets/muzik/", channel: 1, stream: true},
    {name: "observingthestar", type: "audio", src: "assets/muzik/", channel: 1, stream: true},
    {name: "lifeline", type: "audio", src: "assets/muzik/", channel: 1, stream: true},
];
