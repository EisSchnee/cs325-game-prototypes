"use strict";

var BasicGame = {};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    init: function () {

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            //  If you have any desktop specific settings, they can go in here
            this.scale.pageAlignHorizontally = true;
        }
        else
        {
            //  Same goes for mobile settings.
            //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1366, 768);
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
        }

    },

    preload: function () {
        //**
        //  Here we load the assets required for our Preloader state (in this case a background and a loading bar)
        this.load.spritesheet('loadbar', 'assets/loadbar.png', 184, 52);
        this.load.spritesheet('char', 'assets/char_sprite.png', 175, 80);
        this.load.spritesheet('top_char', 'assets/top_char.png', 73, 75);
        this.load.spritesheet('enemy', 'assets/enemy.png', 33, 30);
        this.load.image('shield', 'assets/shield.png');
        this.load.image('sword', 'assets/sword.png');
        this.load.image('super', 'assets/super.png');
        this.load.image('platform', 'assets/platform.png');
        //this.load.image('healthBar', 'assets/healthBar.png');
        this.load.image('items', 'assets/items.png');
        this.load.image('key', 'assets/key.png');
        this.load.image('lock', 'assets/lock.png');
        this.load.image('match', 'assets/match.png');
        this.load.image('shovel', 'assets/shovel.png');
        this.load.image('vines', 'assets/vines.png');
        this.load.image('world1_closed', 'assets/world1_portal.png');
        this.load.image('world2_closed', 'assets/world2_portal.png');
        this.load.image('world3_closed', 'assets/world3_portal.png');
        this.load.image('world1_open', 'assets/world1_open.png');
        this.load.image('world2_open', 'assets/world2_open.png');
        this.load.image('world3_open', 'assets/world3_open.png');
        this.load.image('ground', 'assets/groundblock.png');
        this.load.image('background', 'assets/background.png');
         
        this.load.image('attack_button', 'assets/attack_button.png');
        this.load.image('block_button', 'assets/block_button.png');
        this.load.image('prepare_button', 'assets/prepare_button.png');
        this.load.image('boss', 'assets/boss.png');
        this.load.image('large_char', 'assets/large_char.png');
        this.load.image('need_shield', 'assets/need_shield_button.png');
        this.load.image('need_sword', 'assets/need_sword_button.png');
        this.load.image('credits', 'assets/credits.png');

        this.load.tilemap('map', 'assets/tilemap_example.json', null, Phaser.Tilemap.TILED_JSON);
        // alternatively, from .csv file
        //this.game.load.tilemap('map', 'assets/tilemap_example.csv', null, Phaser.Tilemap.CSV);
        
        //load tiles for map
        this.load.image('tiles1', 'assets/tiles2.png');
        this.load.image('tiles2', 'assets/tiles2.png');

        this.load.atlas('continue', 'assets/pause-continue.png', 'assets/continue.json');
        this.load.image('continue', 'assets/pause-continue.png');
        this.load.image('failBackground', 'assets/fail-background.png');
        this.load.image('WinScreen', 'assets/WinScreen.png', this.game.width, this.game.height);
    },

    create: function () {

        //  By this point the preloader assets have loaded to the cache, we've set the game settings
        //  So now let's start the real preloader going
        localStorage.setItem("hasMatch", false);
        localStorage.setItem("hasKey", false);
        localStorage.setItem("hasSword",false);
        localStorage.setItem("hasShield",false);
        localStorage.setItem("hasSuper", false);
        localStorage.setItem("hasShovel", false);
        //localStorage.setItem("health",100);
        localStorage.setItem("progress", 0);
    
        this.state.start('TitleScreen');

    }

};
