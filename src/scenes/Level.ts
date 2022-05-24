import { Vector } from 'matter'
import Phaser from 'phaser'
import ObstaclesController from './ObstaclesController'
import PlayerController from './PlayerController'
import SnowmanController from './SnowmanController'
import LoadRessources from './LoadRessources'

export default class Level extends Phaser.Scene
{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private elijah?: Phaser.Physics.Matter.Sprite
    private playerController?: PlayerController
    private screenHeight
    private screenWidth

    constructor()
    {
        super('level')
    }

    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.events.once(Phaser.Scenes.Events.DESTROY, () => {
            this.destroy()
        })

        this.screenHeight = this.game.config.height
        this.screenWidth = this.game.config.width

        //update world physics 30 times per second
        this.matter.world.update30Hz();
    }

    preload()
    {
        new LoadRessources(this)
    }

    create()
    {
        this.elijah = this.matter.add.sprite(200, 200, 'Elijah')
        this.cameras.main.startFollow(this.elijah)
        this.load.image('tiles', 'assets/sheet.png')
    }

    destroy()
    {
        
    }

    update(time: number, delta: number)
    {

    }
}