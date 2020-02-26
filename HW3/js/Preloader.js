"use strict";

BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {
		//****
		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(0, 0, 'menuBackground');
		this.preloadBar = this.add.sprite(300, 400, 'preloaderSlider');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);
		
		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, swap them for your own.
		//this.load.image('titlePage', 'assets/title.jpg');
		this.load.atlas('continue', 'assets/pause-continue.png', 'assets/continue.json');
		
		//https://opengameart.org/content/rodents-rat-rework
		this.load.spritesheet('char', 'assets/mouse_brown.png', 32, 32);

		//https://opengameart.org/content/cats-rework
		this.load.spritesheet('cat1', 'assets/cat_orange.png', 32, 48);
		this.load.spritesheet('cat2', 'assets/cat_white.png', 32, 48);
		this.load.spritesheet('cat3', 'assets/cat_brown.png', 32, 48);
		this.load.spritesheet('cat4', 'assets/cat_black.png', 32, 48);

		//https://opengameart.org/content/loyalty-lies-items-food
		this.load.image('cheese', 'cheese.png');


		//http://soundbible.com/674-Cat-Meow.html
		this.load.audio('hitSound', ['assets/Cat Meow.mp3']);

		http://soundbible.com/912-Eat-Chips.html
		this.load.audio('lifeSound', ['assets/Eat Chips.mp3'])
		
		//	**+ lots of other required assets here
		this.load.image( 'spinnerCircle', 'assets/spinner-circle.png' );
		this.load.image('failBackground', 'assets/fail-background.png', this.game.width, this.game.height);
		this.load.image('pauseBackground', 'assets/pause-overlay.png');

		this.load.image('continue', 'assets/pause-continue.png');
		this.load.image('WinScreen', 'assets/WinScreen.png', this.game.width, this.game.height);
	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		//** 
		if (this.cache.isSoundDecoded('lifeSound') && this.cache.isSoundDecoded('hitSound')
			 && this.cache.isSoundDecoded('deathSound') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};

