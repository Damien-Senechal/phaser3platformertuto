import {Events} from 'matter'
import StateMachine from '~/statemachine/StateMachine'
import { sharedInstance as events } from './EventCenter'
import EnnemiesController from './EnnemiesController'
import * as MatterJS from 'matter-js'

export default class PigController
{
    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine
    private ennemies: EnnemiesController
    private target

    private moveTime = 0
    private speed = 1

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, ennemies: EnnemiesController, target: Phaser.Physics.Matter.Sprite)
    {
        this.scene = scene
        this.sprite = sprite
        this.ennemies = ennemies
        this.target = target

        //this.createAnimations()

        const pigController = {
            sprite,
            sensors: {
                center: MatterJS.BodyType
            }
        }
        const pigBody = this.scene.matter.bodies.rectangle(sprite.x, sprite.y, 16, 16, {
            isSensor: false,
            label: 'pig'
        })
        pigController.sensors.center = this.scene.matter.bodies.rectangle(sprite.x, sprite.y, 200, 10, {
            isSensor:true
        })
        const compoudPig = this.scene.matter.body.create({
            parts:[pigBody, pigController.sensors.center ]
        })
        pigController.sprite.setExistingBody(compoudPig)
        pigController.sprite.setFixedRotation()
        //qpigController.sprite.setStatic(true)

        this.stateMachine = new StateMachine(this, 'pig')

        this.stateMachine.addState('idle', {
            onEnter: this.idleOnEnter
        })
        .addState('move-left', {
            onEnter: this.moveLeftOnEnter,
            onUpdate: this.moveLeftOnUpdate
        })
        .addState('move-right', {
            onEnter: this.moveRightOnEnter,
            onUpdate: this.moveRightOnUpdate
        })
        .addState('dead', {
            onEnter: this.deadOnEnter
        })
        .addState('attack', {
            onUpdate: this.attackOnUpdate
        })
        .addState('back', {
            onUpdate: this.backOnUpdate
        })
        .setState('idle')

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const bodyB = data.bodyB as MatterJS.BodyType
            const bodyA = data.bodyA as MatterJS.BodyType

            //console.log(bodyA)
            //console.log(bodyB)

            if(bodyA.label === 'corner' || bodyB.label === 'corner')
            {
                if(this.stateMachine.isCurrentState('move-left'))
                {   
                    this.moveTime = 0
                    this.stateMachine.setState('move-right')
                }
                else if(this.stateMachine.isCurrentState('move-right'))
                {
                    this.moveTime = 0
                    this.stateMachine.setState('move-left')
                }
                return
            }

            if(bodyA.label === 'hitbox-attack' || bodyB.label === 'hitbox-attack')
            {
                this.stateMachine.setState('dead')
                return
            }
        })

        this.scene.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
            console.log(bodyA.label)
            if(bodyA.label==='Elijah' && bodyB === pigController.sensors.center){
                this.stateMachine.setState('attack')
                this.target.x = bodyA.position.x
                this.target.y = bodyA.position.y
            }
            if(bodyA.label==='Elijah' && bodyB.label === 'pig'){
                this.target.x = bodyA.position.x
                this.target.y = bodyA.position.y
                this.stateMachine.setState('back')
            }
        })

        this.scene.matter.world.on('collisionend', (event, bodyA, bodyB) => {
            if(bodyA.label==='Elijah' && bodyB === pigController.sensors.center){
                this.stateMachine.setState('idle')
            }
            if(bodyA.label==='Elijah' && bodyB.label === 'pig'){
                this.target.x = bodyA.position.x
                this.target.y = bodyA.position.y
                this.stateMachine.setState('back')
            }
        })

        //TO DO attack event
        //events.on('snowman-stomped', this.handleStomped, this)
    }

    destroy()
    {
        //events.off('snowman-stomped', this.handleStomped, this)
    }

    update(dt: number)
    {
        this.stateMachine.update(dt)
    }

    private createAnimations()
    {

    }

    private idleOnEnter()
    {
        //this.sprite.play('idle')
        const r = Phaser.Math.Between(1, 100)
        if(r < 50)
        {
            this.stateMachine.setState('move-left')
        }   
        else
        {
            this.stateMachine.setState('move-right')
        }
    }

    private moveLeftOnEnter()
    {
        this.moveTime = 0
        //dthis.sprite.play('move-left')
    }

    private moveLeftOnUpdate(dt: number)
    {
        this.moveTime += dt
        this.sprite.setVelocityX(this.speed)

        if(this.moveTime > 2000)
        {
            this.stateMachine.setState('move-right')
        }
    }

    private moveRightOnEnter()
    {
        this.moveTime = 0
        //this.sprite.play('move-right')
    }

    private moveRightOnUpdate(dt: number)
    {
        this.moveTime += dt
        this.sprite.setVelocityX(-this.speed)

        if(this.moveTime > 2000)
        {
            this.stateMachine.setState('move-left')
        }
    }

    private deadOnEnter()
    {
        this.sprite.destroy()
    }

    private attackOnUpdate()
    {
        if(this.sprite.x < this.target.x)
        {
            this.sprite.setVelocityX(this.speed+2)
        }
        else if(this.sprite.x > this.target.x)
        {
            this.sprite.setVelocityX((this.speed+2)*-1)
        }
        else
        {
            this.sprite.setVelocityX(0)
        }
    }

    private backOnUpdate()
    {
        if(this.sprite.x < this.target.x)
        {
            this.sprite.setVelocityX((this.speed)*-1)
            this.scene.time.delayedCall(1000, () => {
                this.stateMachine.setState('attack')
            })
        }
        else if(this.sprite.x > this.target.x)
        {
            this.sprite.setVelocityX(this.speed)
            this.scene.time.delayedCall(1000, () => {
                this.stateMachine.setState('attack')
            })
        }
        else{
            this.stateMachine.setState('idle')
        } 
    }
}