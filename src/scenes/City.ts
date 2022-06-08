import * as matter from 'matter'
import Phaser, { Tilemaps } from 'phaser'
import ElijahController from './ElijahController'
import LoadRessources from './LoadRessources'
import EnnemiesController from './EnnemiesController'
import PigController from './PigController'


export default class Level extends Phaser.Scene
{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private elijah!: Phaser.Physics.Matter.Sprite
    private elijahController?: ElijahController
    private ennemies !: EnnemiesController
    private screenHeight
    private screenWidth
    private pigs: PigController[] = []
    private pigId = 0
    private tumbleweedTime = 0

    constructor()
    {
        super('city')
    }

    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.ennemies = new EnnemiesController()
        this.pigs = []

        this.screenHeight = this.game.config.height
        this.screenWidth = this.game.config.width

        //update world physics 60 times per second
        this.matter.world.update30Hz()
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.destroy()
        })
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
        this.scene.launch('interface')
        /*this.elijah = this.matter.add.sprite(200, 200, 'Elijah')
        this.cameras.main.startFollow(this.elijah)
        this.load.image('tiles', 'assets/sheet.png')*/

        const map = this.make.tilemap( {key: 'tilemap3' } )
        const tileset = map.addTilesetImage('Town_Tileset', 'tiles2')
        const tileset2 = map.addTilesetImage('bg-tileset', 'tiles3')

        const ground = map.createLayer('ground', tileset)
        ground.setDepth(0)
        const decors1 = map.createLayer('decors', tileset)
        decors1.setDepth(1)
        const decors2 = map.createLayer('decors2', tileset)
        decors2.setDepth(2)
        const para1 = map.createLayer('paralax1', tileset2)
        para1.setDepth(-1)
        const para2 = map.createLayer('paralax2', tileset2)
        para2.setDepth(-2)
        const para3 = map.createLayer('paralax3', tileset2)
        para3.setDepth(-3)
        const para4 = map.createLayer('paralax4', tileset2)
        para4.setDepth(-4)
        const para5 = map.createLayer('paralax5', tileset2)
        para5.setDepth(-5)
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
                    /*this.elijah.setBody({
                            width:11,
                            height:13,
                        }, {
                            label: 'Elijah',
                        })*/
                    this.elijah.setFixedRotation()
                    this.elijah.setFriction(1)
                
                    let smoke = this.add.particles('smoke')
                    this.elijahController = new ElijahController(this, this.elijah, smoke, this.ennemies)
                    this.cameras.main.startFollow(this.elijah, false, 0.1, 0.1)
                    break
                }
                case 'Pig':
                {
                    let pig = this.matter.add.sprite(x, y, 'Pig', 0)
                        .setFixedRotation()
                    pig.setFixedRotation()

                    this.pigs.push(new PigController(this, pig, this.ennemies, this.elijah, this.pigId))
                    this.ennemies.add('pig', pig.body as MatterJS.BodyType)
                    this.pigId+=1
                    break
                }
                case 'Corner':
                {
                    const Bodies = this.matter.add
                    const corner = Bodies.rectangle(x+(width*0.5), y+(height*0.5), 16, 16, {
                        isSensor: true,
                        isStatic: true,
                        label:'corner'
                    })
                    this.ennemies.add('corner', corner)
                    break
                }
                case 'Checkpoint':
                {
                    let checkpoint = this.matter.add.rectangle(x, y, 16, 1000, {
                        isStatic: true,
                        isSensor: true,
                        ignoreGravity: true,
                        label: 'Checkpoint'
                    })
                    break
                }
                case 'End':
                {
                    let end = this.matter.add.rectangle(x, y, 16, 1000, {
                        isStatic: true,
                        isSensor: true,
                        ignoreGravity: true,
                        label: 'End'
                    })
                    break
                }
                case 'medkit':
                {
                    let medkit = this.matter.add.sprite(x, y, 'medkit', 0, {
                        label: 'medkit'
                    })
                    break
                }
                case 'ammo':
                {
                    let medkit = this.matter.add.sprite(x, y, 'ammo', 0, {
                        label: 'ammo'
                    })
                    break
                }
            }
        })
        let acceleration =.5
        para1.scrollFactorX=acceleration
        para2.scrollFactorX=acceleration*.5
        para3.scrollFactorX=acceleration*.6
        para4.scrollFactorX=acceleration
        para5.scrollFactorX=acceleration
    }

    destroy()
    {
        this.scene.stop('interface')
        this.pigs.forEach(pig => pig.destroy())
    }
d
    update(t: number, dt: number)
    {
        this.elijahController?.update(dt)
        this.pigs.forEach(pig => pig.update(dt))
        if(this.elijah.x>2700)
        {
            //this.cameras.main.stopFollow()
        }
        this.tumbleweed(t)
        //console.log(this.pigs)
        //console.log(this.elijah.x)
    }

    tumbleweed(dt: number)
    {
        if(this.tumbleweedTime === 0)
        {
            this.tumbleweedTime = dt + 10000
        }
        else if(dt >= this.tumbleweedTime)
        {
            let tumbleweed = this.matter.add.sprite(this.elijah.x + 300, this.elijah.y, 'tumbleweed', 0,  {
                friction:0,
                frictionAir:0,
                frictionStatic:0,
            })
            tumbleweed.setBody({
                type: 'circle',
                radius: 10
            });
            tumbleweed.setVelocityX(-5)
            tumbleweed.setBounce(1)
            this.time.delayedCall(9000, () => {
                tumbleweed.destroy()
            })
            this.tumbleweedTime = 0
        }

        //this.matter.add.circle(this.elijah.x, this.elijah.y, 20)
    }
}