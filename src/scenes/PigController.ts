import {Events} from 'matter'
import StateMachine from '~/statemachine/StateMachine'
import { sharedInstance as events } from './EventCenter'
import EnnemiesController from './EnnemiesController'

export default class PigController
{
    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine
    private ennemies: EnnemiesController

    private moveTime = 0
    private speed = 1

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, ennemies: EnnemiesController)
    {
        this.scene = scene
        this.sprite = sprite
        this.ennemies = ennemies

        //this.createAnimations()

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
        .addState('dead')
        .setState('idle')

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const bodyB = data.bodyB as MatterJS.BodyType
            const bodyA = data.bodyA as MatterJS.BodyType

            console.log(bodyA)
            console.log(bodyB)

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
}