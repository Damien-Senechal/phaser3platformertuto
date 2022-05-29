import * as matter from 'matter'
import Phaser, { Tilemaps } from 'phaser'
import ElijahController from './ElijahController'
import LoadRessources from './LoadRessources'


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
        this.matter.world.update60Hz()
    }

    preload()
    {
        new LoadRessources(this)
        
        /*this.load.image('Elijah', 'ressources/sprite/elijah.png')
        this.load.image('tiles', 'ressources/tileset/tile_desert3.png')
        this.load.tilemapTiledJSON('tilemap', 'ressources/json/leveltestgrappin.json')*/
    }

    create()
    {
        /*this.elijah = this.matter.add.sprite(200, 200, 'Elijah')
        this.cameras.main.startFollow(this.elijah)
        this.load.image('tiles', 'assets/sheet.png')*/

        const map = this.make.tilemap( {key: 'tilemap' } )
        const tileset = map.addTilesetImage('tile_desert3', 'tiles')

        const ground = map.createLayer('ground', tileset)
        //ground.setCollisionByProperty({ collides: true })

        //map.createLayer('obstacles', tileset)

        const objectsLayer = map.getObjectLayer('objects')
        const collisionsLayer = map.getObjectLayer('collisions')

        this.matter.world.convertTilemapLayer(ground)

        collisionsLayer.objects.forEach(objData => {
            const {x = 0, y = 0, name, width = 0, height = 0} = objData
            switch (name)
            {
                case 'Ground' :
                {
                    const ground = this.matter.add.rectangle(x+width/2, y+height/2, width, height, {isStatic: true})
                    ground.label = 'ground'
                    break
                }
                case 'Wall' :
                {
                    const ground = this.matter.add.rectangle(x+width/2, y+height/2, width, height, {isStatic: true})
                    ground.label = 'wall'
                    break
                }
            }
            
            
        })

        objectsLayer.objects.forEach(objData => {
            const {x = 0, y = 0, name, width = 0, height = 0} = objData

            switch(name)
            {
                case 'Elijah_spawn':
                {   
                    this.elijah = this.matter.add.sprite(x, y, 'Elijah', 0, {label: 'Elijah'})
                        .setData('type', 'Elijah')
                    this.elijah.setBody({
                            width:16,
                            height:17
                        })
                    this.elijah.setFixedRotation()
                    this.elijah.setFriction(1)
                    
                    
                    let smoke = this.add.particles('smoke')
                    this.elijahController = new ElijahController(this, this.elijah, smoke)


                    this.cameras.main.startFollow(this.elijah, false, 0.1, 0.1)
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