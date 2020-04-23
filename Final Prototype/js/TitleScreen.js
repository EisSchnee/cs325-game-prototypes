"use strict";

BasicGame.TitleScreen = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    /*
    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)
    
    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    */

    // For optional clarity, you can initialize
    // member variables here. Otherwise, you will do it in create().
    this.char = null;

    this.SPEED = 150;

    this.objects = [0];

    this.score = 1;

    this.ctr = 0;

    this.portal1 = null;
    this.portal2 = null;
    this.portal3 = null;
    this.loadbar = null;
    this.healthbar = null;
    this.items = null;
    this.vines = null;
    this.lock = null;
    this.ground = null;
    //this.text;

    
};

BasicGame.TitleScreen.prototype = {

    create: function () {

        game.physics.arcade.gravity.y = 2600;

        this.char = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY+100, 'char' );
      /*  this.char.frame = 6;
        this.char.animations.add('walkRight', [3, 4, 5], 10, true);
        this.char.animations.add('walkDown', [6,7,8], 10, true);
        this.char.animations.add('walkUp', [0,1,2], 10, true);
        this.char.animations.add('walkLeft', [9,10,11], 10, true);
    */

        this.char.enableBody = true;
        this.char.anchor.setTo(0.5, 0.5);

        this.game.physics.enable(this.char, Phaser.Physics.ARCADE);

        this.char.body.collideWorldBounds = true;

        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);

        this.portal1 = this.game.add.sprite(100, this.game.world.centerY - 150, 'world1');
        this.portal2 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 150, 'world2');
        this.portal3 = this.game.add.sprite(this.game.world.X - 100, this.game.world.centerY - 150, 'world3');
        this.loadbar = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loadbar');
        this.ctr = 0;
        /*var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        this.text = this.game.add.text( 15, 15, 'Score: 0', style );
        this.text.anchor.setTo( 0.5, 0.0 );*/

         // Create some ground for the player to walk on
        this.ground = this.game.add.group();
        for(var x = 0; x < this.game.width; x += 32) {
         // Add the ground blocks, enable physics on each, make them immovable
            var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
            this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
            groundBlock.body.immovable = true;
            groundBlock.body.allowGravity = false;
            this.ground.add(groundBlock);
        }
    },



    update: function () {

        this.physics.arcade.overlap(this.char, this.portal1, this.enterWorld1, null, this);
        this.physics.arcade.overlap(this.char, this.portal2, this.enterWorld2, null, this);
        this.physics.arcade.overlap(this.char, this.portal3, this.enterWorld3, null, this);
        
        this.game.physics.arcade.collide(this.char, this.ground);
        this.game.physics.arcade.collide(this.char, this.loadbar);

        if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            // If the LEFT key is down, move left
            this.char.body.velocity.x = -this.SPEED;
           // this.char.animations.play('walkLeft');
        } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            // If the RIGHT key is down, move right
            this.char.body.velocity.x = this.SPEED;
           // this.char.animations.play('walkRight');
        }else{
            this.char.body.velocity.x = 0;
        }

        var onTheGround = this.player.body.touching.down;

        if (onTheGround && this.upInputIsActive()) {
            // Jump when the player is touching the ground and the up arrow is pressed
            this.player.body.velocity.y = this.SPEED;
        }
        /*} if (this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            // If the UP key is down, move up
            this.char.body.velocity.y = -this.SPEED;
            if(!this.input.keyboard.isDown(Phaser.Keyboard.LEFT) && !this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                this.char.animations.play('walkUp')
            }
        } else if(this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            // If the DOWN key is... down, move.. well down. Betcha' didn't see that coming.
            this.char.body.velocity.y = this.SPEED;
            if(!this.input.keyboard.isDown(Phaser.Keyboard.LEFT) && !this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                this.char.animations.play('walkDown');
            }
        } else {
            // Stop moving
            this.char.body.velocity.y = 0;
            if(!this.input.keyboard.isDown(Phaser.Keyboard.LEFT) && !this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                this.char.frame = 6;
             }
        }*/


        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
    },

    enterWorld1: function () {
       this.state.start('World1');
    },


    enterWorld2: function () {
        this.state.start('World2');
    },

    enterWorld3: function() {
        this.state.start('World3');
    },

    quitGame: function (val) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        /*this.food.destroy();
        this.char.destroy();
        this.objects = [];
        this.score = 1;*/
        if (val == 0) {
            this.state.start('Fail');
        } else if (val == 1) {
            this.state.start('Win');
        } else {
            this.state.start('MainMenu')
        }
    }

};