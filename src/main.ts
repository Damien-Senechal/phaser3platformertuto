import Phaser from 'phaser'

import Game from './scenes/Game'
import UI from './scenes/UI'
import GameOver from './scenes/GameOver'
import TestRoom from './scenes/TestRoom'
import Level from './scenes/Level'
import Interface from './scenes/Interface'
import Menu from './scenes/Menu'
import Level2 from './scenes/Level2'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 600,
	height: 300,
	zoom:3, // 3
	pixelArt: true,
	backgroundColor: '#ffe0bb',
	fps: {
		target: 60,
		forceSetTimeOut: true
	},
	physics: {
		default: 'matter',
		matter: {
			debug:true,
			gravity:{y:1}
		}
	},
	//scene: [Game, UI, GameOver]
	scene: [Menu, Level, Level2, Interface, GameOver]
}

export default new Phaser.Game(config)