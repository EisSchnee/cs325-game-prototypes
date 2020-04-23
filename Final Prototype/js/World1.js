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
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { create: create, update: update } );
    this.char = null;
    this.SPEED = 150;

    var map;
    var layer1;
    var bouncy;
};

BasicGame.World2.prototype = {

    function create() {

        game.physics.arcade.gravity.y = 2600;
        // Create the map. 
        map = game.add.tilemap('map');
        // for csv files specify the tile size.
        //map = game.add.tilemap('map', 32, 32);
        
        //add tiles
        map.addTilesetImage('tiles');
        
        // Create a layer from the map
        //using the layer name given in the .json file
        layer1 = map.createLayer('Tile Layer 1');
        //for csv files
        //layer1 = map.createLayer(0);
        
        //  Resize the world
        layer1.resizeWorld();
        
        // Create a sprite at the center of the screen using the 'logo' image.
        char = game.add.sprite( game.world.X + 100, game.world.centerY-200, 'char' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        char.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        char.body.collideWorldBounds = true;
        
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

        game.camera.follow(char);
        

        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);

        this.game.physics.arcade.collide(this.char, this.ground);

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
        

    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, this.game.input.activePointer, 500, 500, 500 );
    }
};
