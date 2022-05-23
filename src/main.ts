import Phaser from 'phaser'

import Game from './scenes/Game'
import UI from './scenes/UI'
import TestRoom from './scenes/TestRoom'

const WALL = 0;

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 600,
	height: 400,
	zoom:2,
	pixelArt: true,
	fps: {
		target: 60,
		forceSetTimeOut: true
	},
	physics: {
		default: 'matter',
		matter: {
			debug:true,
			gravity:true
		}
	},
	//scene: [Game, UI]
	scene: [TestRoom]
}

export default new Phaser.Game(config)