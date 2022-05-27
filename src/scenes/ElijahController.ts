import Phaser from 'phaser'
import StateMachine from '~/statemachine/StateMachine'
import ObstaclesController from './ObstaclesController'

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys

export default class PlayerController
{
    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine
    //private obstacles: ObstaclesController
    private health = 100
    private keyD
    private keyQ
    private keySpace

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite)
    {
        this.scene = scene
        this.sprite = sprite
        //this.obstacles = obstacles

        this.inputManager()

        this.stateMachine = new StateMachine(this, 'player')

        this.stateMachine.addState('idle', {
            onEnter: this.idleOnEnter,
            onUpdate: this.idleOnUpdate,
            onExit: this.idleOnExit
        })
            .addState('walk', {
                onEnter: this.walkOnEnter,
                onUpdate: this.walkOnUpdate,
                onExit: this.walkOnExit
            })
            .addState('jump', {
                onEnter: this.jumpOnEnter,
                onUpdate: this.jumpOnUpdate,
                onExit: this.jumpOnExit
            })
            .addState('grapple', {
                onEnter: this.grappleOnEnter,
                onUpdate: this.grappleOnUpdate,
                onExit: this.grappleOnExit
            })
            .setState('idle')

            this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
                const body = data.bodyA as MatterJS.BodyType
                const gameObject = body.gameObject
                console.log(gameObject)

                if(!gameObject)
                {
                    return
                }

                if(gameObject instanceof Phaser.Physics.Matter.TileBody)
                {
                    if(this.stateMachine.isCurrentState('jump'))
                    {
                        this.stateMachine.setState('idle')
                    }
                    return
                }
            })
    }

    update(dt: number)
    {
        this.stateMachine.update(dt)
    }


    private idleOnEnter()
    {
        
    }

    private idleOnUpdate()
    {
        if(this.keyD.isDown || this.keyQ.isDown)
        {
            this.stateMachine.setState('walk')
        }

        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.keySpace)
        if(spaceJustPressed)
        {
            this.stateMachine.setState('jump')
        }
    }

    private idleOnExit()
    {

    }

    private walkOnEnter()
    {
        
    }

    private walkOnUpdate()
    {
        const speed = 3

        if(this.keyQ.isDown)
        {
            this.sprite.flipX = true
            this.sprite.setVelocityX(-speed)
        }
        else if(this.keyD.isDown)
        {
            this.sprite.flipX = false
            this.sprite.setVelocityX(speed)
        }
        else{
            this.sprite.setVelocityX(0)
            this.stateMachine.setState('idle')
        }

        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.keySpace)
        if(spaceJustPressed)
        {
            this.stateMachine.setState('jump')
        }
    }

    private walkOnExit()
    {

    }

    private jumpOnEnter()
    {
        this.sprite.setVelocityY(-5)
    }

    private jumpOnUpdate()
    {
        const speed = 3

        if(this.keyQ.isDown)
        {
            this.sprite.flipX = true
            this.sprite.setVelocityX(-speed)
        }
        else if(this.keyD.isDown)
        {
            this.sprite.flipX = false
            this.sprite.setVelocityX(speed)
        }
    }

    private jumpOnExit()
    {

    }

    private grappleOnEnter()
    {

    }

    private grappleOnUpdate()
    {

    }

    private grappleOnExit()
    {

    }

    private inputManager()
    {
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.keyQ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }
}