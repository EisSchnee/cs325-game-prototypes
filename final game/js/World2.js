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

    this.active = true;

    this.enemies = null;

    this.enemy = null;

    this.homingEnemies = null;

    this.score = 1;

    this.ctr = 0;
    this.shield = null;
    this.key = null;

    this.health = 100;
    this.music = new Audio('assets/335571__magntron__gamemusic.mp3');
    this.hit = new Audio('assets/404751__owlstorm__retro-video-game-sfx-computation.wav');
    this.death = new Audio('assets/414209_jacksonacademyashmore_death.wav');
    this.collect = new Audio('assets/341695__projectsu012__coins-1.wav');

    //this.text;

};

BasicGame.World2.prototype = {

    create: function () {
        this.map = this.game.add.tilemap('map');
        // for csv files specify the tile size.
       // this.map = this.game.add.tilemap('map', 32, 64);
        
        //add tiles
        this.map.addTilesetImage('tiles');
        
        // Create a layer from the map
        //using the layer name given in the .json file
        this.layer1 = this.map.createLayer('Tile Layer 1');
        //for csv files
        //this.layer1 = this.map.createLayer(0);
        
        //Resize the world
       this.layer1.resizeWorld();
        var style2 = { font: "40px Verdana", fill: "#FF0000", align: "center" };

        this.game.physics.arcade.gravity.y = 0;
     
        this.char = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'top_char' );
        this.char.frame = 2;

        this.char.animations.add('walkHori', [10, 11, 12, 13, 14], 10, true);
        this.char.animations.add('walkVerti', [0, 1, 2, 3, 4], 10, true);
        this.char.animations.add('WalkNW', [15, 16, 17, 18, 19], 10, true);
        this.char.animations.add('WalkSW', [5, 6, 7, 8, 9], 10, true);

        this.char.enableBody = true;
        this.char.anchor.setTo(0.5, 0.5);

        this.game.physics.enable(this.char, Phaser.Physics.ARCADE);

        this.char.body.collideWorldBounds = true;
        this.game.camera.follow(this.char);

        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.Z,
            Phaser.Keyboard.X,
            Phaser.Keyboard.C
        ]);
        this.player_health_text = this.game.add.text(200, 200, 'health: 100', style2);
        this.ctr = 0;

        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        //this.game.physics.enable( this.enemies, Phaser.Physics.ARCADE );
        if(localStorage.getItem("hasKey") == "t"){
            this.createEnemies();
        }
        var yVelocity = (Math.random()*this.SPEED)-(this.SPEED/2);
            var xVelocity = Math.sqrt(((this.SPEED*this.SPEED)/2)-(yVelocity*yVelocity));
            if(Math.random()*2 > 1){
                xVelocity = xVelocity*-1;
            }
            
            var PositionX = Math.random()*this.game.world.width;
            var PositionY = Math.random()*this.game.world.height;
            this.key = this.enemies.create(PositionX, PositionY, 'key');
            PositionX = Math.random()*this.game.world.width;
            PositionY = Math.random()*this.game.world.height;
            this.shield = this.enemies.create(PositionX, PositionY, 'shield');
            

            


        

        /*var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        this.text = this.game.add.text( 15, 15, 'Score: 0', style );
        this.text.anchor.setTo( 0.5, 0.0 );*/

    },



    update: function () {

        //this.text.setText('Score: ' + this.score);
        if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            // If the LEFT key is down, move left
            this.char.body.velocity.x = -this.SPEED;
            if(this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                // If the DOWN key is... down, move.. well down. Betcha' didn't see that coming.
                this.char.body.velocity.y = this.SPEED;
                this.char.animations.play('walkSW');
            }else if(this.input.keyboard.isDown(Phaser.Keyboard.UP)){
                this.char.body.velocity.y = -this.SPEED;
                this.char.animations.play('walkNW');
            }else{
                this.char.animations.play('walkHori');
                this.char.body.velocity.y = 0;
            }
        } else if(this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            // If the RIGHT key is down, move right
            this.char.body.velocity.x = this.SPEED;
            if(this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                // If the DOWN key is... down, move.. well down. Betcha' didn't see that coming.
                this.char.body.velocity.y = this.SPEED;
                this.char.animations.play('walkNW');
            }else if(this.input.keyboard.isDown(Phaser.Keyboard.UP)){
                this.char.body.velocity.y = -this.SPEED;
                this.char.animations.play('walkSW');
            }else{
                this.char.animations.play('walkHori');
                this.char.body.velocity.y = 0;
            }
        } else if(this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            // If the UP key is down, move up
            this.char.body.velocity.y = -this.SPEED;
            this.char.animations.play('walkVerti');
            this.char.body.velocity.x = 0;

        } else if(this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            // If the DOWN key is... down, move.. well down. Betcha' didn't see that coming.
            this.char.body.velocity.y = this.SPEED;
            this.char.animations.play('walkVerti');
            this.char.body.velocity.x = 0;

        } else {
            // Stop moving
            this.char.body.velocity.y = 0;
            this.char.body.velocity.x = 0;
            this.char.frame = 3;
        }
        if(this.active){
        this.physics.arcade.overlap(this.char, this.key, this.getKey, null, this);
        }if(this.active){
        this.physics.arcade.overlap(this.char, this.shield, this.getShield, null, this);
        }if(this.active){
        this.physics.arcade.overlap(this.char, this.enemies, this.damage, null, this);
        }
    },
    getKey: function (){
        localStorage.set("hasKey", "t");
        this.quitGame(3);
    },
    
    getShield: function () {
        localStorage.set("hasShield", "t");
        this.quitGame(3);

    },

    damage: function (player, enemy) {
        this.health -= 35;
       // this.scoredown.play();
        enemy.destroy();
        this.player_health_text.setText('health: ' + this.health);
        if(this.health <= 0){
            this.quitGame(3);
        }
        player.resetFrame();
        player.anchor.setTo(0.5, 0.5);
        // this.scoredown.play();
    },


    createEnemies: function () {
        var p = 0;
        while(p < 20) {
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
            this.enemy = this.enemies.create(PositionX, PositionY, 'enemy');
            this.enemy.anchor.setTo(0.5,0.5);
            this.enemy.animations.add('standard', [0,1,2], 3, true);
            this.enemy.animations.play('standard');

            this.enemy.body.velocity.x = xVelocity;
            this.enemy.body.velocity.y = yVelocity;
            p++;
 
        }
        this.enemies.setAll('body.collideWorldBounds', true);
        this.enemies.setAll('body.bounce.x', 1);
        this.enemies.setAll('body.bounce.y', 1);
    },


    quitGame: function (val) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        this.active = false;
        
        this.char.destroy();

        //this.SPEED.destroy();

        //this.objects.destroy();

        //this.food.destroy();

        this.enemies.destroy();

        this.enemy.destroy();

        //this.homingEnemies.destroy();

        //this.score.destroy();

        //this.ctr.destroy();

        //this.health.destroy();
        this.key.destroy();
        this.shield.destroy();

        if (val == 0) {
            this.state.start('World1');
            this.game.state.shutdown();
        } else if (val == 1) {
            this.state.start('World2');
            this.game.state.shutdown();
        } else if(val == 2){
            this.state.start('World3');
            this.game.state.shutdown();

        } else{
            this.state.start('Win');
            this.game.state.shutdown();
        }
    }

};