"use strict";

BasicGame.World2 = function (game) {

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

    this.food = null;

    this.enemies = null;

    this.enemy = null;

    this.homingEnemies = null;

    this.score = 1;

    this.ctr = 0;

    //this.text;

};

BasicGame.World2.prototype = {

    create: function () {
        this.game.physics.arcade.gravity.y = 0;
     
        this.char = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'char' );
       /* this.char.frame = 6;
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

        this.ctr = 0;

        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        //this.game.physics.enable( this.enemies, Phaser.Physics.ARCADE );
        this.createEnemies();

        this.createFood();

        /*var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        this.text = this.game.add.text( 15, 15, 'Score: 0', style );
        this.text.anchor.setTo( 0.5, 0.0 );*/

    },



    update: function () {

        this.physics.arcade.overlap(this.char, this.enemies, this.damage, null, this);// error in this.char.body
        this.physics.arcade.overlap(this.char, this.food, this.point, null, this);

        //this.text.setText('Score: ' + this.score);
        if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            // If the LEFT key is down, move left
            this.char.body.velocity.x = -this.SPEED;
            //this.char.animations.play('walkLeft')
        } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            // If the RIGHT key is down, move right
            this.char.body.velocity.x = this.SPEED;
           // this.char.animations.play('walkRight');
        }else{
            this.char.body.velocity.x = 0;

        } if (this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            // If the UP key is down, move up
            this.char.body.velocity.y = -this.SPEED;
            if(!this.input.keyboard.isDown(Phaser.Keyboard.LEFT) && !this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
               // this.char.animations.play('walkUp')
            }
        } else if(this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            // If the DOWN key is... down, move.. well down. Betcha' didn't see that coming.
            this.char.body.velocity.y = this.SPEED;
            if(!this.input.keyboard.isDown(Phaser.Keyboard.LEFT) && !this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
               // this.char.animations.play('walkDown');
            }
        } else {
            // Stop moving
            this.char.body.velocity.y = 0;
            if(!this.input.keyboard.isDown(Phaser.Keyboard.LEFT) && !this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
               // this.char.frame = 6;
             }
        }


        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
    },

    damage: function (player, enemy) {
        this.score--;
       // this.scoredown.play();
        enemy.destroy();
        switch (this.score) {
            case 0:
               // this.death.play();
               //this.death.play();
                this.quitGame(0);
                this.state.start('Fail');
                break;
            default:
                //player.loadTexture('char1', 0, false);
                if(this.score< 0){
                    //this.death.play();
                    this.quitGame(0);
                } else {
                    this.score = 1;
                }
        }
        player.resetFrame();
        player.anchor.setTo(0.5, 0.5);
        // this.scoredown.play();
    },


    createEnemies: function () {
        var p = 0;
        while(p < 7) {
            var yVelocity = (Math.random()*this.SPEED)-(this.SPEED/2);
            var xVelocity = Math.sqrt(((this.SPEED*this.SPEED)/2)-(yVelocity*yVelocity));
            if(Math.random()*2 > 1){
                xVelocity = xVelocity*-1;
            }
            var PositionX = null;
            var PositionY = null;
            if(yVelocity>Math.abs(xVelocity)){
                PositionY = this.game.world.height;
                PositionX = Math.random()*this.game.world.width;
            }else if(yVelocity < -Math.abs(xVelocity)){
                PositionY = 0;
                PositionX = Math.random()*this.game.world.width;
            }else if(xVelocity > 0){
                PositionX = 0;
                PositionY = Math.random()*this.game.world.height;
            }else{
                PositionX = this.game.world.width;
                PositionY = Math.random()*this.game.world.height;
            }
            this.enemy = this.enemies.create(PositionX, PositionY, 'cat1');
            this.enemy.anchor.setTo(0.5,0.5);
            this.enemy.animations.add('walkDown', [6,7,8], 10, true);
            this.enemy.animations.add('WalkUp', [0,1,2], 10, true);
            this.enemy.animations.add('Walkright', [3,4,5], 10, true);
            this.enemy.animations.add('WalkLeft', [9,10,11], 10, true);
            this.enemy.body.velocity.x = xVelocity;
            this.enemy.body.velocity.y = yVelocity;
            p++;
            if(yVelocity>Math.abs(xVelocity)){
                this.enemy.animations.play('WalkUp');
            }else if(yVelocity < -Math.abs(xVelocity)){
                this.enemy.animations.play('WalkDown');
            }else if(xVelocity > 0){
                this.enemy.animations.play('WalkRight');
            }else{
                this.enemy.animations.play('WalkLeft');
            }
        }
        this.enemies.setAll('body.collideWorldBounds', true);
        this.enemies.setAll('body.bounce.x', 1);
        this.enemies.setAll('body.bounce.y', 1);
    },
    createFood: function() {
        var food = this.game.add.sprite((Math.random()*this.game.world.width), Math.random()*this.game.world.height, 'key');
        this.game.physics.enable(food, Phaser.Physics.ARCADE);
        food.anchor.setTo(0.5, 0.5);
        food.body.collideWorldBounds = false;
        this.food = food;
    },

    point: function () {
        this.score++;
        //this.scoreup.play();
        var ctr = 0;
        this.createEnemies();
        this.food.destroy();
        this.createFood();
        switch (this.score) {
            case 2:
                //this.char.loadTexture('char2', 0, false);
                break;
            case 3:
                //this.char.loadTexture('char3', 0, false);
                break;
            case 4:
                //this.char.loadTexture('char4', 0, false);
                break;
            case 5:
                this.quitGame(1);
                break;
            default:
            //this.char.loadTexture('char4', 0, false);
        }
        this.char.resetFrame();
        this.char.anchor.setTo(0.5, 0.5);
        if(this.score == 2){
            this.quitGame(1);
        }
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
            this.state.start('TitleScreen')
        }
    }

};