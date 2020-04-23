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

BasicGame.Game.prototype = {

   create: function () {
    this.attack_button = this.add.button( 100, game.world.Y -100, 'attack_button', this.attack, this, 'over', 'out', 'down');
    this.defend_button = this.add.button( game.world.centerX, game.world.Y -100, 'defend_button', this.defend, this, 'over', 'out', 'down');
    this.prepare_button = this.add.button(game.world.X - 100, game.world.Y -100, 'prepare_button', this.prepare, this);
    this.char = this.game.add.sprite( 100, this.game.world.centerY+100, 'char' );
    this.boss = this.game.add.sprite( this.game.world.X-100, this.game.world.centerY+100, 'boss' );
   },



   update: function () {

     
   },

   attack: function () {
        if(prepared){
            enemy_health -= 15;
        }else{
            enemy_health -= 10;
        }

        this.prepared = false;
        Enemyturn(0);
   }

   defend: function () { 
        this.defending = true;
        Enemyturn(1);
   }

   prepare: function () {
        this.prepared - true;
        Enemyturn(2);

   }

   Enemyturn: function (value) {

        if(nextmove != null && nextmove > 1){
            if(defending && !prepared){
                if(heavy){
                    health -= 25;
                }else{
                    health -= 10;
                }
            }else if( !defending){
                if(heavy){
                    health -= 65;
                }else{
                    health-= 30;
                }
            }
        }else if(nextmove != null && val > .3 && !heavy){
            this.heavy = true;
        }else if(nextmove != null){

        }
        nextmove = math.random()*3;
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