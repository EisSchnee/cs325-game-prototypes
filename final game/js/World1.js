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
    this.score = 1;
    
    this.active = true;

    this.enemies = null;
    this.items = null;
    this.enemy = null;
    this.match = null;

    this.sword = null;
    this.lock = null;

    this.health = 100;
    this.platforms = null;
    this.music = new Audio('assets/335571__magntron__gamemusic.mp3');
    this.hit = new Audio('assets/404751__owlstorm__retro-video-game-sfx-computation.wav');
    this.death = new Audio('assets/414209_jacksonacademyashmore_death.wav');
    this.collect = new Audio('assets/341695__projectsu012__coins-1.wav');
};

BasicGame.World1.prototype = {

    create: function() {
        this.active = true;
        this.game.physics.arcade.gravity.y = 400;
        // Create the map. 
        var style2 = { font: "40px Verdana", fill: "#FF0000", align: "center" };
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
        
        //  Resize the world
        this.layer1.resizeWorld();
        
        // Create a sprite at the center of the screen using the 'logo' image.
        this.char = this.game.add.sprite( this.game.world.width + 100, this.game.world.height-100, 'char' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        this.game.physics.enable( this.char, Phaser.Physics.ARCADE );
        this.char.anchor.setTo( 0.5, 0.5 );
        this.char.frame = 0;
        this.char.animations.add('walkRight', [1, 2, 3, 4], 10, true);
        this.char.animations.add('walkLeft', [6, 7, 8, 9], 10, true);
        
        this.char.body.collideWorldBounds = true;
        
        this.ground = this.game.add.group();
       /* for(var x = 0; x < this.game.width; x += 32) {
         // Add the ground blocks, enable physics on each, make them immovable
            var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
            this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
            groundBlock.body.immovable = true;
            groundBlock.body.allowGravity = false;
            this.ground.add(groundBlock);
        }*/
        this.player_health_text = this.game.add.text(200, 200, 'health: 100', style2);
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
        
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

        this.createPlatforms();

        if(localStorage.getItem("hasKey")){
            this.createEnemies();
        }

    },
    
    update: function() {

            //TODO check collision of  
            this.game.physics.arcade.collide(this.match, this.platforms);
            this.game.physics.arcade.collide(this.sword, this.platforms);
            this.game.physics.arcade.collide(this.char, this.ground);
            this.game.physics.arcade.collide(this.char, this.platforms);
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

            var onTheGround = this.char.body.touching.down || this.char.body.touching.left || this.char.body.touching.right;

            if ((onTheGround || this.char.body.y > this.game.world.height - 100) && this.input.keyboard.isDown(Phaser.Keyboard.UP) ) {
                // Jump when the player is touching the ground and the up arrow is pressed
                this.char.body.velocity.y = -400;
            }

            if(this.active){
                this.physics.arcade.overlap(this.char, this.enemies, this.damage, null, this);
            }if(this.active){    
                this.physics.arcade.overlap(this.char, this.match, this.getMatch, null, this);
            }if(this.active){    
                this.physics.arcade.overlap(this.char, this.sword, this.getSword, null, this);
            }
    },
    createPlatforms: function() {
        var platheight = 200;
        var platnum = 10;

        var currentheight = this.game.world.height;
        this.platforms = this.game.add.group();
        while(platnum > 0){
            currentheight -= platheight;
            if(platnum == 4){
                this.sword = this.game.add.sprite(this.game.width / 4, currentheight - 100, 'sword');
                this.game.physics.enable(this.sword, Phaser.Physics.ARCADE);
                this.sword.anchor.setTo(0.5, 0.5);
                this.sword.body.collideWorldBounds = true;
            }
            for(var i = 1; i < platnum; i++){
                var platform = this.game.add.sprite((this.game.width / platnum) * i, currentheight, 'platform');
                this.game.physics.enable(platform, Phaser.Physics.ARCADE);
                platform.body.immovable = true;
                platform.body.allowGravity = false;
                this.platforms.add(platform);
            }
            platnum --;
        }
        this.match = this.game.add.sprite(this.game.width / 2, currentheight - 100, 'match');
        this.game.physics.enable(this.match, Phaser.Physics.ARCADE);
        this.match.anchor.setTo(0.5, 0.5);
        this.match.body.collideWorldBounds = true;
    },
    getMatch: function () {
        localStorage.setItem("hasMatch", true);
        this.quitGame(3);
    },

    getSword: function () {
        localStorage.setItem("hasSword", true);
        this.quitGame(3);
    },

    createEnemies: function () {
        var p = 0;
        while(p < 10) {
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

    damage: function (player, enemy) {
        this.health = this.health - 25;
       // this.scoredown.play();
        enemy.destroy();
        this.player_health_text.setText('health: ' + this.health);
        if(this.health <= 0){
            this.quitGame(2);
        }

        player.resetFrame();
        player.anchor.setTo(0.5, 0.5);
        // this.scoredown.play();
    },

    quitGame: function (val) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        this.active = false;
        this.char.destroy();
        //this.SPEED.destroy();
        this.ground.destroy();
        this.map.destroy();
        this.layer1.destroy();
        //this.score.destroy();

        this.enemies.destroy();
       // this.items.destroy()
        this.enemy.destroy();
        this.match.destroy();

        this.sword.destroy();
        //this.lock.destroy();

        //this.health.destroy();
        this.platforms.destroy();

        if (val == 0) {
            this.state.start('Fail');
        } else if (val == 1) {
            this.state.start('Win');
        } else {
            this.state.start('TitleScreen')
        }
    }

};
