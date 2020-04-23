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

    this.nextmove = null;
};

BasicGame.World3.prototype = {

   create: function () {
    this.char = this.game.add.sprite( 25, this.game.world.centerY+100, 'large_char' );
    this.boss = this.game.add.sprite( this.game.world.width-275, this.game.world.centerY-100, 'boss' );
    this.attack_button = this.add.button( 100, this.game.world.height -100, 'attack_button', this.attack, this, 'over', 'out', 'down');
    this.defend_button = this.add.button( this.game.world.centerX - 50, this.game.world.height -100, 'block_button', this.defend, this, 'over', 'out', 'down');
    this.prepare_button = this.add.button(this.game.world.width - 263, this.game.world.height -100, 'prepare_button', this.prepare, this);

   },



   update: function () {

     
   },

   attack: function () {
        if(this.prepared){
            this.enemy_health -= 15;
        }else{
            this.enemy_health -= 10;
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
        this.prepared - true;
        this.EnemyTurn(2);

   },

   EnemyTurn: function (value) {

        if(this.nextmove != null && this.nextmove > 1){
            if(this.defending && !this.prepared){
                if(this.heavy){
                    this.health -= 25;
                }else{
                    this.health -= 10;
                }
            }else if( !this.defending){
                if(this.heavy){
                    this.health -= 65;
                }else{
                    this.health-= 30;
                }
            }
        }else if(this.nextmove != null && this.nextmove > .3 && !this.heavy){
            this.heavy = true;
        }else if(this.nextmove != null){

        }
        this.nextmove = Math.random()*3;
   },

   quitGame: function (val) {

       //  Here you should destroy anything you no longer need.
       //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

       this.scoredown.play();
       if (val == 0) {
           this.state.start('Fail');
       } else if (val == 1) {
           this.state.start('Win');
       } else {
           this.state.start('TitleScreen')
       }
   }

};