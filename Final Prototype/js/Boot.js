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
        this.load.image('loadbar', 'assets/loadbar.png');
        this.load.image('char', 'assets/Char.png');
        this.load.image('healthBar', 'assets/healthBar.png');
        this.load.image('items', 'assets/items.png');
        this.load.image('key', 'assets/key.png');
        this.load.image('lock', 'assets/lock.png');
        this.load.image('match', 'assets/match.png');
        this.load.image('shovel', 'assets/shovel.png');
        this.load.image('vines', 'assets/vines.png');
        this.load.image('world1', 'assets/world1_portal.png');
        this.load.image('world2', 'assets/world2_portal.png');
        this.load.image('world3', 'assets/world3_portal.png');
        this.load.image('ground', 'assets/groundblock.png');
        this.load.image('background', 'assets/background.png');
         
        this.load.image('attack_button', 'assets/attack_button.png');
        this.load.image('block_button', 'assets/block_button.png');
        this.load.image('prepare_button', 'assets/prepare_button.png');
        this.load.image('boss', 'assets/boss.png');
        this.load.image('large_char', 'assets/large_char.png');

        //https://opengameart.org/content/cats-rework
		this.load.spritesheet('cat1', 'assets/cat_orange.png', 64, 96);
		this.load.spritesheet('cat2', 'assets/cat_white.png', 64, 96);
		this.load.spritesheet('cat3', 'assets/cat_brown.png', 64, 96);
		this.load.spritesheet('cat4', 'assets/cat_black.png', 64, 96);

        //this.load.tilemap('map', 'assets/tilemap_example.json', null, Phaser.Tilemap.TILED_JSON);
        // alternatively, from .csv file
        this.game.load.tilemap('map', 'assets/tilemap_example.csv', null, Phaser.Tilemap.CSV);
        
        //load tiles for map
        this.load.image('tiles', 'assets/tiles.png');

        this.load.atlas('continue', 'assets/pause-continue.png', 'assets/continue.json');
        this.load.image('continue', 'assets/pause-continue.png');
        this.load.image('failBackground', 'assets/fail-background.png');
        this.load.image('WinScreen', 'assets/WinScreen.png', this.game.width, this.game.height);
    },

    create: function () {

        //  By this point the preloader assets have loaded to the cache, we've set the game settings
        //  So now let's start the real preloader going
        this.state.start('TitleScreen');

    }

};
