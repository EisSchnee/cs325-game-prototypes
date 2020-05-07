"use strict";

window.onload = function() {

	//	Create your Phaser game and inject it into the 'game' div.
	//	We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
	var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game' );

	//	Add the States your game has.
	//	You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
	game.state.add('Boot', BasicGame.Boot);
	game.state.add('TitleScreen', this.BasicGame.TitleScreen);
	game.state.add('World1', BasicGame.World1);
	game.state.add('World2', BasicGame.World2);
	game.state.add('World3', BasicGame.World3);
	game.state.add('Fail', BasicGame.Fail);
	game.state.add('Win',  BasicGame.Win);
	
	//	Now start the Boot state.
	game.state.start('Boot');

};
