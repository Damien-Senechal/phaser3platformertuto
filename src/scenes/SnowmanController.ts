import StateMachine from "../statemachine/StateMachine"

export default class SnowmanController
{
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine

    private moveTime = 0

    constructor(sprite: Phaser.Physics.Matter.Sprite)
    {
        this.sprite = sprite

        this.createAnimations()

        this.stateMachine = new StateMachine(this, 'snowman')

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
    }

    update(dt: number)
    {
        this.stateMachine.update(dt)
    }

    private createAnimations()
    {
        this.sprite.anims.create({
            key: 'idle',
            frames: [{ key: 'snowman', frame: 'snowman_left_1.png'}]
        })

        this.sprite.anims.create({
            key: 'move-left',
            frames: this.sprite.anims.generateFrameNames('snowman', {
                start: 1,
                end: 2,
                prefix: 'snowman_left_',
                suffix: '.png'
            }),
            frameRate: 5,
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'move-right',
            frames: this.sprite.anims.generateFrameNames('snowman', {
                start: 1,
                end: 2,
                prefix: 'snowman_right_',
                suffix: '.png'
            }),
            frameRate: 5,
            repeat: -1
        })
    }

    private idleOnEnter()
    {
        this.sprite.play('idle')
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
        this.sprite.play('move-left')
    }

    private moveLeftOnUpdate(dt: number)
    {
        this.moveTime += dt
        this.sprite.setVelocityX(-3)

        if(this.moveTime > 2000)
        {
            this.stateMachine.setState('move-right')
        }
    }

    private moveRightOnEnter()
    {
        this.moveTime = 0
        this.sprite.play('move-right')
    }

    private moveRightOnUpdate(dt: number)
    {
        this.moveTime += dt
        this.sprite.setVelocityX(3)

        if(this.moveTime > 2000)
        {
            this.stateMachine.setState('move-left')
        }
    }
}