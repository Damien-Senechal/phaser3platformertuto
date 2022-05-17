import { Vector } from 'matter'
import Phaser from 'phaser'
import ObstaclesController from './ObstaclesController'
import PlayerController from './PlayerController'
import SnowmanController from './SnowmanController'

export default class Game extends Phaser.Scene
{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private penguin?: Phaser.Physics.Matter.Sprite
    private playerController?: PlayerController
    private obstacles!: ObstaclesController
    private snowmen: SnowmanController[] = []

    constructor()
    {
        super('game')
    }

    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.obstacles =  new ObstaclesController()
        this.snowmen = []

        this.events.once(Phaser.Scenes.Events.DESTROY, () => {
            this.destroy()
        })
    }

    preload()
    {
        this.load.atlas('penguin', 'assets/penguin.png', 'assets/penguin.json')
        this.load.atlas('snowman', 'assets/snowman.png', 'assets/snowman.json')
        this.load.image('tiles', 'assets/sheet.png')
        this.load.tilemapTiledJSON('tilemap', 'assets/game.json')

        this.load.image('coin', 'assets/coin.png')
        this.load.image('melon', 'assets/apple.png')

    }

    create()
    {
        this.scene.launch('ui')

        const map = this.make.tilemap( {key: 'tilemap' } )
        const tileset = map.addTilesetImage('iceworld', 'tiles')

        const ground = map.createLayer('ground', tileset)
        ground.setCollisionByProperty({ collides: true })

        map.createLayer('obstacles', tileset)

        const objectsLayer = map.getObjectLayer('objects')

        objectsLayer.objects.forEach(objData => {
            const {x = 0, y = 0, name, width = 0, height = 0} = objData
            
            switch(name)
            {
                case 'penguin-spawn':
                {
                    this.penguin = this.matter.add.sprite(x + (width*0.5), y, 'penguin')
                        .setFixedRotation()

                    this.playerController = new PlayerController(this, this.penguin, this.cursors, this.obstacles)

                    this.cameras.main.startFollow(this.penguin)
                    break
                }
                case 'snowman':
                {
                    const snowman = this.matter.add.sprite(x, y, 'snowman')
                        .setFixedRotation()

                    this.snowmen.push(new SnowmanController(this, snowman))
                    this.obstacles.add('snowman', snowman.body as MatterJS.BodyType)
                    break
                }
                case 'star':
                {
                    const coin = this.matter.add.sprite(x, y, 'coin', undefined, {
                        isStatic: true,
                        isSensor: true
                    }).setScale(2)
                    coin.setData('type', 'coin')
                    break
                }
                case 'melon':
                    const melon = this.matter.add.sprite(x, y, 'melon', undefined, {
                        isStatic: true,
                        isSensor: true
                    })
                    melon.setData('type', 'melon')
                         .setData('healthPoints', 10)
                         .setScale(2)
                    break
                case 'spikes':
                    const spike  = this.matter.add.rectangle(x + (width * 0.5), y + (height * 0.5), width, height, {
                        isStatic: true
                    })
                    this.obstacles.add('spikes', spike)
                    break
            }
        })

        this.matter.world.convertTilemapLayer(ground)
    }

    destroy()
    {
        this.snowmen.forEach(snowman => snowman.destroy())
    }

    update(t: number, dt: number)
    {
        this.playerController?.update(dt)
        this.snowmen.forEach(snowman => snowman.update(dt))
    }
}