"use strict";

BasicGame.World3 = function (game) {

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

    this.char = null;
    this.boss = null;
    this.attack_button = null;
    this.defend_button = null;
    this.prepare_button = null;
    this.health = 100;
    this.enemy_health = 100;
    this.prepared = false;
    this.defending = false;
    this.heavy = false;

    this.active = true;

    this.enemy_move_text = null;
    this.enemy_health_text = null;
    this.player_health_text = null;

    this.nextmove = null;
    this.music = new Audio('assets/335571__magntron__gamemusic.mp3');
    this.hit = new Audio('assets/404751__owlstorm__retro-video-game-sfx-computation.wav');
    this.death = new Audio('assets/414209_jacksonacademyashmore_death.wav');
    this.collect = new Audio('assets/341695__projectsu012__coins-1.wav');
};

BasicGame.World3.prototype = {

   create: function () {
    this.char = this.game.add.sprite( 25, this.game.world.centerY+100, 'large_char' );
    this.boss = this.game.add.sprite( this.game.world.width-275, this.game.world.centerY-100, 'boss' );
    if(localStorage.getItem("hasSword") == "t"){
        this.attack_button = this.add.button( 100, this.game.world.height -100, 'attack_button', this.attack, this, 'over', 'out', 'down');
    }else{
        this.attack_button = this.game.add.sprite(100, this.game.world.height -100, 'missing_sword');
    }
    if(localStorage.getItem("hasShield") == "t"){
        this.defend_button = this.add.button( this.game.world.centerX - 50, this.game.world.height -100, 'block_button', this.defend, this, 'over', 'out', 'down');
    }else{
        this.defend_button = this.game.add.sprite(this.game.world.centerX - 50, this.game.world.height -100, 'missing_shield');
    }
    this.prepare_button = this.add.button(this.game.world.width - 263, this.game.world.height -100, 'prepare_button', this.prepare, this);

    var style1 = { font: "25px Verdana", fill: "#9999ff", align: "center" };
    var style2 = { font: "40px Verdana", fill: "#FF0000", align: "center" };
        this.enemy_move_text = this.game.add.text( this.game.world.centerX + 200, 200, 'Enemy is thinking...', style1 );
        this.enemy_health_text = this.game.add.text( this.game.world.centerX + 200, 100, 'Enemy health: 100', style1 );
        this.player_health_text = this.game.add.text(200, 200, 'health: 100', style2);
        this.enemy_move_text.anchor.setTo( 0.5, 0.0 );
        this.enemy_health_text.anchor.setTo( 0.5, 0.0 );
        this.player_health_text.anchor.setTo( 0.5, 0.0 );
   },



   update: function () {

     
   },

   attack: function () {
        if(this.prepared){
            this.enemy_health -= 25;
            this.enemy_health_text.setText('health: ' + this.enemy_health);
        }else{
            this.enemy_health -= 15;
            this.enemy_health_text.setText('health: ' + this.enemy_health);
        }
        this.prepared = false;
        if(this.enemy_health <= 0){
            this.quitGame(1);
        }else{
            this.EnemyTurn(0);
        }
   },

   defend: function () { 
        this.defending = true;
        this.EnemyTurn(1);
   },

   prepare: function () {
        this.prepared = true;
        this.EnemyTurn(2);

   },

   EnemyTurn: function (value) {

        if(this.nextmove != null && this.nextmove > 1){
            if(this.defending && !this.prepared){
                if(this.heavy){
                    this.health -= 15;
                    this.player_health_text.setText('health: ' + this.health);
                }else{
                    this.health -= 3;
                    this.player_health_text.setText('health: ' + this.health);
                }
            }else if( !this.defending){
                if(this.heavy){
                    this.health -= 45;
                    this.player_health_text.setText('health: ' + this.health);
                }else{

                    this.health-= 25;
                    this.player_health_text.setText('health: ' + this.health);
                }
            }else if(this.heavy){
                this.health -= 3;
                this.player_health_text.setText('health: ' + this.health);
            }
            this.heavy = false;
        }else if(this.nextmove != null && this.nextmove > .3){
            this.heavy = true;
        }else if(this.nextmove != null){
            if(this.heavy){
                this.enemy_health += 20;
                this.enemy_health_text.setText('health: ' + this.enemy_health);
            }else{
                this.enemy_health += 10;
                this.enemy_health_text.setText('health: ' + this.enemy_health);
            }
            this.heavy = false;
        }
        this.nextmove = Math.random()*3;
        if(this.nextmove > 1){
            this.enemy_move_text.setText('Enemy is attacking!');
        }else if(this.nextmove > .3){
            this.enemy_move_text.setText('Enemy is preparing his next move!');
        }else {
            this.enemy_move_text.setText('Enemy is healing!');
        }
        if( this.health <= 0){
            localStorage.setItem("hasShovel", "true");
            this.quitGame(3);
        }
   },

   quitGame: function (val) {

       //  Here you should destroy anything you no longer need.
       //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        this.active = false;
        this.char.destroy();
        this.boss.destroy();
        this.attack_button.destroy();
        this.defend_button.destroy();
        this.prepare_button.destroy();
        //this.enemy_health.destroy();
        //this.prepared.destroy();
        //this.defending.destroy();
        //this.heavy.destroy();

        this.enemy_move_text.destroy();
        this.enemy_health_text.destroy();
        this.player_health_text.destroy();

        //this.nextmove.destroy();
        if (val == 0) {
            this.state.start('World1');
          //  this.game.state.shutdown();
        } else if (val == 1) {
            this.state.start('World2');
          //  this.game.state.shutdown();
        } else if(val == 2){
            this.state.start('World3');
          //  this.game.state.shutdown();

        } else{
            this.state.start('Win');
           // this.game.state.shutdown();
        }
   }

};