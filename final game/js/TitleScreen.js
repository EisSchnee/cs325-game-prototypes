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

    this.portalActive = [false, false, false, false];

    this.portal1 = null;
    this.portal2 = null;
    this.portal3 = null;
    this.loadbar = null;
    //this.healthbar = null;
    this.items = null;
    this.ground = null;
    this.background = null;
    //this.text;

    this.sword = null;
    this.shovel = null;
    this.match = null;
    this.key = null;
    this.shield = null;
    this.super = null;

    this.active = true;

    this.health = 100;
    this.credits = null;
    this.music = new Audio('assets/335571__magntron__gamemusic.mp3');
    this.hit = new Audio('assets/404751__owlstorm__retro-video-game-sfx-computation.wav');
    this.death = new Audio('assets/414209_jacksonacademyashmore_death.wav');
    this.collect = new Audio('assets/341695__projectsu012__coins-1.wav');
};

BasicGame.TitleScreen.prototype = {

    create: function () {
        this.active = true;
        this.game.camera.reset();
        this.game.scale.resize(800, 600);
        this.game.physics.arcade.gravity.y = 2600;
        this.background = this.game.add.sprite(0,0, 'background');


        this.char = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY-300, 'char' );
      /*  this.char.frame = 6;
        this.char.animations.add('walkRight', [3, 4, 5], 10, true);
        this.char.animations.add('walkDown', [6,7,8], 10, true);
        this.char.animations.add('walkUp', [0,1,2], 10, true);
        this.char.animations.add('walkLeft', [9,10,11], 10, true);
    */
        this.game.physics.enable(this.char, Phaser.Physics.ARCADE);
        //this.char.enableBody = true;
        this.char.anchor.setTo(0.5, 0.5);

        this.char.frame = 0;
        this.char.animations.add('walkRight', [1, 2, 3, 4], 10, true);
        this.char.animations.add('walkLeft', [6, 7, 8, 9], 10, true);

        this.char.body.collideWorldBounds = true;
        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.Z,
            Phaser.Keyboard.X,
            Phaser.Keyboard.C
        ]);

        //this.healthbar = this.game.add.sprite(0, 0, 'healthBar');
        this.items = this.game.add.sprite(this.game.world.width -200, 0, 'items');

        this.portal1 = this.game.add.sprite(30, this.game.world.centerY + 50, 'world1_closed');
        this.portal2 = this.game.add.sprite(this.game.world.centerX - 50, this.game.world.centerY + 50, 'world2_closed');
        this.portal3 = this.game.add.sprite(this.game.world.width - 130, this.game.world.centerY + 50, 'world3_closed');
        this.loadbar = this.game.add.sprite(this.game.world.centerX - 100, this.game.world.centerY - 75, 'loadbar');
        this.game.physics.enable(this.loadbar, Phaser.Physics.ARCADE);
        this.loadbar.body.immovable = true;
        this.loadbar.body.allowGravity = false;
        this.game.physics.enable(this.portal1, Phaser.Physics.ARCADE);
        this.portal1.body.immovable = true;
        this.portal1.body.allowGravity = false;
        this.game.physics.enable(this.portal2, Phaser.Physics.ARCADE);
        this.portal2.body.immovable = true;
        this.portal2.body.allowGravity = false;
        this.game.physics.enable(this.portal3, Phaser.Physics.ARCADE);
        this.portal3.body.immovable = true;
        this.portal3.body.allowGravity = false;
        this.ctr = 0;
        /*var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        this.text = this.game.add.text( 15, 15, 'Score: 0', style );
        this.text.anchor.setTo( 0.5, 0.0 );*/
        var style2 = { font: "40px Verdana", fill: "#FF0000", align: "center" };
        this.player_health_text = this.game.add.text(0, 0, 'health: 100', style2);
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
        var progress = localStorage.getItem("progress");
        if(progress == 0){
            //TODO load both green and lock.
            //load world 1
            //start progress bar at 0
            //play loading cutscene up to 25%
            this.loadbar.frame = 0;
            this.lock = this.game.add.sprite(this.game.world.width - 160, this.game.world.centerY + 30, 'lock');
            this.vines = this.game.add.sprite(0, this.game.world.height -249, 'vines');
            this.portal1.loadTexture('world1_open', 0, false);
            this.portalActive[0] = true;
            localStorage.setItem("progress", 1);
        }else if(progress == 1){
            //TODO load lock and green
            //load world 1
            //start progress bar 25%
            //check to see if match is acquired. if so, play cutscene and update progress.
            this.loadbar.frame = 0;
            this.lock = this.game.add.sprite(this.game.world.width - 160, this.game.world.centerY+30, 'lock');
            this.vines = this.game.add.sprite(0, this.game.world.height -249, 'vines');
            this.portal1.loadTexture('world1_open', 0, false);
            this.portalActive[0] = true;

            if(localStorage.getItem("hasMatch")){
                this.vines.loadTexture('vines2', 0, false);
                this.portal2.loadTexture('world2_open', 0, false);
                this.portalActive[1] = true;
                localStorage.setItem("progress", 2);
                this.loadbar.frame = 1;
            }
        }else if(progress == 2){
            //TODO load lock
            // load world 1 and 2
            //start progress bar at 50% 
            //check to see if lock is acquired. if so play cutscene and update progress
            this.loadbar.frame = 1;
            this.lock = this.game.add.sprite(this.game.world.width - 160, this.game.world.centerY + 30, 'lock');
            this.portal1.loadTexture('world1_open', 0, false);
            this.portalActive[0] = true;
            this.portal2.loadTexture('world2_open', 0, false);
            this.portalActive[1] = true;
            if(localStorage.getItem("hasKey")){
                this.portal3.loadTexture('world3_open', 0, false);
                this.portalActive[2] = true;
                localStorage.setItem("progress", 3);
                this.loadbar.frame = 2;
            }

        }else if(progress == 3){
            //TODO load world 1 2 and 3
            //start progress bar at 90%
            //check to see if shovel is acquired, if so, play cutscene and update progress
            this.loadbar.frame = 2;
            this.portal1.loadTexture('world1_open', 0, false);
            this.portalActive[0] = true;
            this.portal2.loadTexture('world2_open', 0, false);
            this.portalActive[1] = true;
            this.portal3.loadTexture('world3_open', 0, false);
            this.portalActive[2] = true;
            if(localStorage.getItem("hasShovel")){
                this.credits = this.game.add.sprite(this.game.world.width - 130, this.game.world.height + 100, 'credits');
                this.portalActive[3] = true;
                localStorage.setItem("progress", 4);
                this.loadbar.frame = 3;
            }
        }else {
            //TODO load world 1 2 and 3
            //start progress at 90%
            //load dug up credits
            this.loadbar.frame = 3;
            this.portal1.loadTexture('world1_open', 0, false);
            this.portalActive[0] = true;
            this.portal2.loadTexture('world2_open', 0, false);
            this.portalActive[1] = true;
            this.portal3.loadTexture('world3_open', 0, false);
            this.portalActive[2] = true;
            this.credits = this.game.add.sprite(this.game.world.width - 130, this.game.world.height + 100, 'credits');
            this.portalActive[3] = true;
            localStorage.setItem("progress", 4);
            this.loadbar.frame = 3;
        }
    },



    update: function () {
        this.game.physics.arcade.collide(this.char, this.ground);
        this.game.physics.arcade.collide(this.char, this.loadbar);
            if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                // If the LEFT key is down, move left
                this.char.body.velocity.x = -this.SPEED;
                this.char.animations.play('walkLeft');
            } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                // If the RIGHT key is down, move right
                this.char.body.velocity.x = this.SPEED;
                this.char.animations.play('walkRight');
            }else{
                this.char.body.velocity.x = 0;
                this.char.frame = 0;
            }

            var onTheGround = this.char.body.touching.down;

            if (onTheGround && this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                // Jump when the player is touching the ground and the up arrow is pressed
                this.char.body.velocity.y = -1000;
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
            if(this.active){
                this.physics.arcade.overlap(this.char, this.portal1, this.enterWorld1, null, this);
            }
            if(this.active){
                this.physics.arcade.overlap(this.char, this.portal2, this.enterWorld2, null, this);
            }
            if(this.active){
                this.physics.arcade.overlap(this.char, this.portal3, this.enterWorld3, null, this);
            } 
            if(this.active){
                this.physics.arcade.overlap(this.char, this.portal3, this.enterWorld3, null, this);
            }  
    
    },

    enterWorld1: function () {
       this.quitGame(0);
    },


    enterWorld2: function () {
        this.quitGame(1);
    },

    enterWorld3: function() {
        this.quitGame(2);
    },

    quitGame: function (val) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        this.active = false;
        this.char.destroy();

       //this.SPEED.destroy();

        //this.objects.destroy();

        //this.score.destroy();

       // this.ctr.destroy();

        this.portal1.destroy();
        this.portal2.destroy();
        this.portal3.destroy();
        this.loadbar.destroy();
    //this.healthbar = null;
        this.items.destroy();
        this.ground.destroy();
        this.background.destroy();
    //this.text;

        /*this.sword.destroy();
        this.shovel.destroy();
        this.match.destroy();
        this.key.destroy();
        this.shield.destroy();
        this.super.destroy();*/

        //this.health.destroy();
        if (val == 0) {
            this.state.start('World1');
        } else if (val == 1) {
            this.state.start('World2');
        } else if(val == 2){
            this.state.start('World3');

        } else{
            this.state.start('Win');
        }
    }

};