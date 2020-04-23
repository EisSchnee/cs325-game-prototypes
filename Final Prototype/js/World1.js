"use strict";

BasicGame.World1 = function (game) {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/v2.6.2/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    //var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { create: create, update: update } );
    this.char = null;
    this.SPEED = 150;
    this.ground;
    this.map = null;
    this.layer1 = null;
    this.score = 5;

    this.enemies = null;

    this.enemy = null;
};

BasicGame.World1.prototype = {

    create: function() {
        this.game.physics.arcade.gravity.y = 2600;
        // Create the map. 
        //this.map = this.game.add.tilemap('map');
        // for csv files specify the tile size.
        this.map = this.game.add.tilemap('map', 20, 60);
        
        //add tiles
        this.map.addTilesetImage('tiles');
        
        // Create a layer from the map
        //using the layer name given in the .json file
        //this.layer1 = this.map.createLayer('Tile Layer 1');
        //for csv files
        this.layer1 = this.map.createLayer(0);
        
        //  Resize the world
        this.layer1.resizeWorld();
        
        // Create a sprite at the center of the screen using the 'logo' image.
        this.char = this.game.add.sprite( this.game.world.width + 100, this.game.world.centerY-200, 'char' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        this.game.physics.enable( this.char, Phaser.Physics.ARCADE );
        this.char.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        // Make it bounce off of the world bounds.
        this.char.body.collideWorldBounds = true;
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        
        this.ground = this.game.add.group();
        for(var x = 0; x < this.game.width; x += 32) {
         // Add the ground blocks, enable physics on each, make them immovable
            var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
            this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
            groundBlock.body.immovable = true;
            groundBlock.body.allowGravity = false;
            this.ground.add(groundBlock);
        }

        this.game.camera.follow(this.char);
        

        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);
        
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.createEnemies();

    },
    
    update: function() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
       // bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, this.game.input.activePointer, 500, 500, 500 );
       this.game.physics.arcade.collide(this.char, this.ground);
       this.physics.arcade.overlap(this.char, this.enemies, this.damage, null, this);
       
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

       var onTheGround = this.char.body.touching.down;

       if (onTheGround && this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
           // Jump when the player is touching the ground and the up arrow is pressed
           this.char.body.velocity.y = -1000;
       }
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
