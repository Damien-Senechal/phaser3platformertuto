import * as matter from 'matter'
import Phaser from 'phaser'
import ElijahController from './ElijahController'


export default class Level extends Phaser.Scene
{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private elijah?: Phaser.Physics.Matter.Sprite
    private elijahController?: ElijahController
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
        //new LoadRessources(this)
        this.load.image('Elijah', 'ressources/sprite/elijah.png')
        this.load.image('tiles', 'ressources/tileset/tile_desert3.png')
        this.load.tilemapTiledJSON('tilemap', 'ressources/json/leveltestgrappin.json')
    }

    create()
    {
        /*this.elijah = this.matter.add.sprite(200, 200, 'Elijah')
        this.cameras.main.startFollow(this.elijah)
        this.load.image('tiles', 'assets/sheet.png')*/

        const map = this.make.tilemap( {key: 'tilemap' } )
        const tileset = map.addTilesetImage('tile_desert3', 'tiles')

        const ground = map.createLayer('ground', tileset)
        ground.setCollisionByProperty({ collides: true })

        map.createLayer('obstacles', tileset)

        const objectsLayer = map.getObjectLayer('objects')

        this.matter.world.convertTilemapLayer(ground)

        objectsLayer.objects.forEach(objData => {
            const {x = 0, y = 0, name, width = 0, height = 0} = objData

            switch(name)
            {
                case 'Elijah_spawn':
                {
                    this.elijah = this.matter.add.sprite(x, y, 'Elijah')
                        .setFixedRotation()

                    this.elijahController = new ElijahController(this, this.elijah)

                    this.cameras.main.startFollow(this.elijah, true, 0.2, 0.2)
                    break
                }
            }
        })
    }

    destroy()
    {
        
    }

    update(t: number, dt: number)
    {
        this.elijahController?.update(dt)
    }
}