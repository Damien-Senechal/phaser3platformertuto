import Phaser from 'phaser'

import Game from './scenes/Game'
import UI from './scenes/UI'
import TestRoom from './scenes/TestRoom'
import Level from './scenes/Level'

const WALL = 0;

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 300,
	height: 200,
	zoom:2,
	pixelArt: true,
	fps: {
		target: 60,
		forceSetTimeOut: true
	},
	physics: {
		default: 'matter',
		matter: {
			debug:false,
			gravity:{y:1}
			
		}
	},
	//scene: [Game, UI]
	scene: [Level]
}

export default new Phaser.Game(config)