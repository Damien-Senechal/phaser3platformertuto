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
    private alive = true
    private id

    private moveTime = 0
    private speed = 1

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, ennemies: EnnemiesController, target: Phaser.Physics.Matter.Sprite, id: number)
    {
        this.scene = scene
        this.sprite = sprite
        this.ennemies = ennemies
        this.target = target
        this.id = id

        this.createAnimations()

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
        const pigHitBox = this.scene.matter.bodies.circle(sprite.x, sprite.y, 15, {
            isSensor: true,
            label: 'pig-hitbox'
        })
        pigController.sensors.center = this.scene.matter.bodies.rectangle(sprite.x, sprite.y, 200, 10, {
            isSensor:true,
            label: 'detection-zone'
        })
        const compoudPig = this.scene.matter.body.create({
            parts:[pigBody, pigHitBox, pigController.sensors.center ]
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

        events.on('pig-killed', this.handleAttack, this)
        //events.on('reset', this.reset, this)

        /*pigController.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const bodyB = data.bodyB as MatterJS.BodyType
            const bodyA = data.bodyA as MatterJS.BodyType

            console.log('lol')
            console.log(bodyB.label)

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
        })*/

        this.scene.matter.world.on('collisionstart', (event, b1, b2) => {
            for (var i = 0; i < event.pairs.length; i++) {
    
                if(b2.label === 'corner' && b1.label === 'pig' && this.alive)
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
                

                if(b1.label==='Elijah' && b2 === pigController.sensors.center && this.alive){
                    this.stateMachine.setState('attack')
                    this.target.x = b1.position.x
                    this.target.y = b1.position.y
                    return
                }
                if(b1.label==='Elijah' && b2.label === 'pig' && this.alive){
                    this.target.x = b1.position.x
                    this.target.y = b1.position.y
                    this.stateMachine.setState('back')
                    return
                }
            }
        }, this);

        this.scene.matter.world.on('collisionend', (event, b1, b2) => {
            for (var i = 0; i < event.pairs.length; i++) {
                if(b1.label==='Elijah' && b2 === pigController.sensors.center && this.alive){
                    this.stateMachine.setState('idle')
                    return
                }
                if(b1.label==='Elijah' && b2.label === 'pig' && this.alive){
                    this.target.x = b1.position.x
                    this.target.y = b1.position.y
                    this.stateMachine.setState('back')
                    return
                }
            }
        }, this)
    }

    destroy()
    {
        events.off('pig-killed', this.handleAttack,this)
        events.off('reset', this.reset, this)
    }

    update(dt: number)
    {
        this.stateMachine.update(dt)
    }

    private createAnimations()
    {
        this.scene.anims.create({
            key: 'idlePig',
            frames: this.scene.anims.generateFrameNumbers('Pig', { start:0, end: 4 }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'walkPig',
            frames: this.scene.anims.generateFrameNumbers('Pig', { start:5, end: 10 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'jumpDown',
            frames: this.scene.anims.generateFrameNumbers('Pig', { frames : [11] }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'diePig',
            frames: this.scene.anims.generateFrameNumbers('Pig', { start:12, end: 16 }),
            frameRate: 10,
            repeat: 0
        });
    }

    private idleOnEnter()
    {
        if(this.alive)
        {
            this.sprite.play('idlePig')
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
    }

    private moveLeftOnEnter()
    {
        if(this.alive)
        {
            this.sprite.play('walkPig')
            this.sprite.flipX =false
            this.moveTime = 0
            //dthis.sprite.play('move-left')
        }
    }

    private moveLeftOnUpdate(dt: number)
    {
        if(this.alive)
        {
            this.moveTime += dt
            if(this.alive)
            {
                this.sprite.setVelocityX(this.speed)
            }

            if(this.moveTime > 2000)
            {
                this.stateMachine.setState('move-right')
            }
        }
        
    }

    private moveRightOnEnter()
    {
        if(this.alive)
        {
            this.sprite.flipX = true
            this.moveTime = 0
            this.sprite.play('walkPig')
        }
        
    }

    private moveRightOnUpdate(dt: number)
    {
        if(this.alive)
        {
            this.moveTime += dt
            if(this.alive)
            {
                this.sprite.setVelocityX(-this.speed)
            }
        

            if(this.moveTime > 2000)
            {
                this.stateMachine.setState('move-left')
            }
        }
        
    }

    private deadOnEnter()
    {
        let corpse = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'Pig')
        corpse.play('diePig')
        this.sprite.destroy()
        events.emit('reset')
        
    }


    private attackOnUpdate()
    {
        if(this.alive)
        {
            if(this.sprite.x < this.target.x)
            {
                this.sprite.flipX = false
                this.sprite.setVelocityX(this.speed+1)
            }
            else if(this.sprite.x > this.target.x)
            {
                this.sprite.flipX = true
                this.sprite.setVelocityX((this.speed+1)*-1)
            }
            else
            {
                this.sprite.setVelocityX(0)
            }

            this.scene.time.delayedCall(3000, () => {
                if(this.alive)
                {
                    this.stateMachine.setState('idle')
                }
            })
        }
        
    }

    private backOnUpdate()
    {
        if(this.alive)
        {
            if(this.sprite.x < this.target.x)
            {
                if(this.alive)
                {
                    this.sprite.flipX = false
                    this.sprite.setVelocityX((this.speed)*-1)
                }
                this.scene.time.delayedCall(1000, () => {
                    this.stateMachine.setState('attack')
                })
            }
            else if(this.sprite.x > this.target.x)
            {
                if(this.alive)
                {
                    this.sprite.flipX = true
                    this.sprite.setVelocityX(this.speed)
                }       
                this.scene.time.delayedCall(1000, () => {
                    this.stateMachine.setState('attack')
                })
            }
            else{
                this.stateMachine.setState('idle')
            } 
        }
        
    }

    private handleAttack(pig: Phaser.Physics.Matter.Sprite)
    {
        if(this.sprite !== pig)
        {
            this.stateMachine.setState('idle')
            return
        }

        this.alive = false
        events.off('pig-killed', this.handleAttack, this)

        this.stateMachine.setState('dead')
    }

    private reset()
    {
        events.off('pig-killed', this.handleAttack, this)
        if(this.alive)
        {
            this.stateMachine.setState('idle')
        }
    }
}