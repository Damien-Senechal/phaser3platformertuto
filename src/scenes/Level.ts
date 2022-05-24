import { Vector } from 'matter'
import Phaser from 'phaser'
import ObstaclesController from './ObstaclesController'
import PlayerController from './PlayerController'
import SnowmanController from './SnowmanController'

export default class Level extends Phaser.Scene
{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private elijah?: Phaser.Physics.Matter.Sprite
    private playerController?: PlayerController
    private screenHeight
    private screenWidth

    constructor()
    {
        super('game')
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

        //set the bound of the world
        this.matter.world.setBounds(10, 10,  this.screenWidth - 20, this.screenHeight - 20);
    }

    preload()
    {
        this.load.image('Elijah', 'assets/elijah_proto_sprite.png')
    }

    create()
    {
        this.elijah = this.matter.add.sprite(200, 200, 'Elijah')
                        .setFixedRotation()
    }

    destroy()
    {
        
    }

    update(time: number, delta: number)
    {

    }
}