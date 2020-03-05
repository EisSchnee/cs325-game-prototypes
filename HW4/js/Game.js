"use strict";

BasicGame.Game = function (game) {

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
   // this.char = null;

    this.paddletop = null;
    this.paddlebottom = null;
    this.paddleleft = null;
    this.paddleright = null;
    
    this.paddles = null;

    this.PADDLESPEED = 150;
    this.BALLSPEED = 75;
    this.timer = 0;

    //this.objects = [0];

   // this.food = null;

    //this.enemies = null;

   // this.enemy = null;
    this.ball;
    //this.homingEnemies = null;

    this.score = 0;

    this.ctr = 0;

    //this.text;

    this.scoreup = new Audio('assets/soft-hitclap.wav');
    this.scoredown = new Audio('assets/seeya.wav');
    
};

BasicGame.Game.prototype = {

    create: function () {

        this.paddlebottom = this.game.add.sprite( this.game.world.centerX, this.game.world.height - 10, 'paddle2' );
        this.paddleright = this.game.add.sprite( this.game.world.width-10, this.game.world.centerY, 'paddle2' );
        this.paddleleft = this.game.add.sprite( 10, this.game.world.centerY, 'paddle1' );
        this.paddletop = this.game.add.sprite( this.game.world.centerX, 10, 'paddle1' );

        this.paddletop.enableBody = true;;
        this.paddletop.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.paddletop, Phaser.Physics.ARCADE);
        this.paddletop.body.collideWorldBounds = true;

        this.paddleright.enableBody = true;
        this.paddleright.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.paddleright, Phaser.Physics.ARCADE);
        this.paddleright.body.collideWorldBounds = true; 
        this.paddleright.angle = 90;

        this.paddleleft.enableBody = true;
        this.paddleleft.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.paddleleft, Phaser.Physics.ARCADE);
        this.paddleleft.body.collideWorldBounds = true;
        this.paddleleft.angle = 90;

        this.paddlebottom.enableBody = true;
        this.paddlebottom.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.paddlebottom, Phaser.Physics.ARCADE);
        this.paddlebottom.body.collideWorldBounds = true;

        this.ball = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'ball' );
        this.ball.enableBody = true;
        this.ball.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.ball, Phaser.Physics.ARCADE);
        this.ball.body.collideWorldBounds = false;
        this.ball.body.bounce.x = 1;
        this.ball.body.bounce.y = 1;

        var yVelocity = (Math.random()*this.BALLSPEED)-(this.BALLSPEED/2);
        var xVelocity = Math.sqrt(((this.BALLSPEED*this.BALLSPEED)/2)-(yVelocity*yVelocity));
        if(Math.random()*2 > 1){
            xVelocity = xVelocity*-1;
        }

        this.ball.body.velocity.x = xVelocity;
        this.ball.body.velocity.y = yVelocity;

        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.KeyCode.W,
            Phaser.KeyCode.A,
            Phaser.KeyCode.S,
            Phaser.KeyCode.D,
            Phaser.Keyboard.SHIFT
        ]);

        this.ctr = 0;

        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        this.text = this.game.add.text( 50, 50, 'Score: 0', style );
        this.text.anchor.setTo( 0.5, 0.0 );

    },



    update: function () {

        this.physics.arcade.collide(this.ball, this.paddleleft, this.collideside, null, this);
        this.physics.arcade.collide(this.ball, this.paddleright, this.collideside, null, this);
        this.physics.arcade.collide(this.ball, this.paddletop, this.collideroof, null, this);
        this.physics.arcade.collide(this.ball, this.paddlebottom, this.collideroof, null, this);
        var speed = 0;

        if (this.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            speed = this.PADDLESPEED * 2;
        }else{
            speed = this.PADDLESPEED;
        }
        //this.text.setText('Score: ' + this.score);
        if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            // If the LEFT key is down, move left
            this.paddlebottom.body.velocity.x = -speed;
        } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            // If the RIGHT key is down, move right
            this.paddlebottom.body.velocity.x = speed;
        }else{
            this.paddlebottom.body.velocity.x = 0;


        } if (this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            // If the UP key is down, move up
            this.paddleright.body.velocity.y = -speed;

        } else if(this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            // If the DOWN key is... down, move.. well down. Betcha' didn't see that coming.
            this.paddleright.body.velocity.y = speed;
        } else {
            // Stop moving
            this.paddleright.body.velocity.y = 0;


        } if (this.input.keyboard.isDown(Phaser.KeyCode.A)) {
            this.paddletop.body.velocity.x = -speed;

         } else if(this.input.keyboard.isDown(Phaser.KeyCode.D)) {
        this.paddletop.body.velocity.x = speed;
         } else {
        // Stop moving
        this.paddletop.body.velocity.x = 0;
         
    
        } if (this.input.keyboard.isDown(Phaser.KeyCode.W)) {
            this.paddleleft.body.velocity.y = -speed;

        } else if(this.input.keyboard.isDown(Phaser.KeyCode.S)) {
            this.paddleleft.body.velocity.y = speed;
        } else {
            // Stop moving
            this.paddleleft.body.velocity.y = 0;
        }

        if (this.ball.x > this.game.width || this.ball.x < 0 || this.ball.y > this.game.height || this.ball.y < 0){
            this.quitGame(0);
        }

        this.timer++;
        if((this.timer % 100) == 0){
            this.ball.body.velocity.x = this.ball.body.velocity.x + 1;
            this.ball.body.velocity.y = this.ball.body.velocity.y + 1;
            this.score++;
            this.text.setText('Score: ' + this.score);
        }
        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
    },

    collideside: function () {
        this.scoreup.play();
        this.ball.body.velocity.x = -this.ball.body.velocity.x;
    },

    collideroof: function () {
        this.scoreup.play();
        this.ball.body.velocity.y = -this.ball.body.velocity.y;
    }

    quitGame: function (val) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        this.scoredown.play();
        if (val == 0) {
            this.state.start('Fail');
        } else if (val == 1) {
            this.state.start('Win');
        } else {
            this.state.start('MainMenu')
        }
    }

};