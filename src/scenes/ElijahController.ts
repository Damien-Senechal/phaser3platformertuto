import { BodyType } from 'matter'
import Phaser, { BlendModes } from 'phaser'
import StateMachine from '~/statemachine/StateMachine'
import EnnemiesController from './EnnemiesController'

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys

export default class PlayerController
{
    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine
    private ennemies: EnnemiesController
    private health = 100
    private keyD
    private keyQ
    private keySpace
    private hook
    private rope
    private graphics
    private smoke
    private isGrounded
    private refY
    private canFireHook

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, smoke, ennemies: EnnemiesController)
    {
        this.scene = scene
        this.sprite = sprite
        this.sprite.flipX = true
        this.smoke =  smoke
        this.ennemies = ennemies
        this.isGrounded = false
        this.refY=0
        this.canFireHook = true

        this.inputManager()
        this.createAnimations()

        this.hook = null
        this.rope = null

        //this.scene.input.on("pointerdown", this.fireHook, this.scene)

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
            .addState('falling', {
                onEnter: this.fallingOnEnter,
                onUpdate: this.fallingOnUpdate,
                onExit: this.fallingOnExit
            })
            .setState('falling')

            this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
                const bodyA = data.bodyA as MatterJS.BodyType
                const bodyB = data.bodyB as MatterJS.BodyType
                const gameObjectA = bodyA
                const gameObjectB = bodyB.gameObject

                //dconsole.log(gameObjectA)
                //console.log(gameObjectB)

                if(!gameObjectA)
                {
                    return
                }

                if(gameObjectA.label === 'ground' || gameObjectA.label === 'corner')
                {
                    
                    this.sprite.body.velocity.y = 0
                    if(this.stateMachine.isCurrentState('jump'))
                    {
                        this.stateMachine.setState('idle')
                    }
                    if(this.stateMachine.isCurrentState('falling'))
                    {
                        this.isGrounded = true
                        this.stateMachine.setState('idle')
                    }            
                    return
                }
            })

            
            this.scene.input.on("pointerdown", this.fireHook, this)
    }

    update(dt: number)
    {
        // is there a constraint? Shrink it
        if(this.rope){
            this.rope.length -= 2;
            let hookPosition = this.hook.position;
            let heroPosition = this.sprite.body.position;
            let distance = Phaser.Math.Distance.Between(hookPosition.x, hookPosition.y, heroPosition.x, heroPosition.y);
            if(distance - this.rope.length > 6){
                this.rope.length = distance;
            }
            this.rope.length = Math.max(this.rope.length, 16 * 2);
        }
        this.stateMachine.update(dt)

        //console.log("this.sprite.y : "+this.sprite.body.velocity.y)
        //console.log("this.yPos : "+this.yPos)
        //console.log('this.sprite.y = '+this.sprite.y)
        //console.log('refY = '+this.refY)
        console.log(this.canFireHook)
    }


    private idleOnEnter()
    {
        if(this.stateMachine.previousStateName === 'falling')
        {
            this.sprite.setVelocityY(0)
        }
        this.sprite.play('idle')
    }

    private idleOnUpdate()
    {
        this.refY = this.sprite.y
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
        this.sprite.play('walk')

        if(this.sprite.flipX)
        {
            this.smoke.createEmitter({
                speed:25,
                //gravityX:-100,
                gravityY:-25,
                lifespan:500,
                scale:{start:1, end:0.1},
                follow:{x:this.sprite.x, y:this.sprite.y+8},
                maxParticles: 10,
                angle: {max:250, min:180}
                //deathZone: {type: 'onEnter', source: this.ground}
            })
        }
        else{
            this.smoke.createEmitter({
                speed:25,
                //gravityX:-100,
                gravityY:-25,
                lifespan:500,
                scale:{start:1, end:0.1},
                follow:{x:this.sprite.x, y:this.sprite.y+8},
                maxParticles: 10,
                angle: {max:360, min:250}
                //deathZone: {type: 'onEnter', source: this.ground}
            })
        }
    }

    private walkOnUpdate()
    {
        const speed = 2.5

        if(this.sprite.body.velocity.y > 0 && this.isGrounded && (this.refY+.5 < this.sprite.y || this.refY-.5 > this.sprite.y))
        {
            this.isGrounded = false
            this.stateMachine.setState('falling')
        }

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
        this.isGrounded = false
        this.sprite.play('jumpUP')
        
        this.smoke.createEmitter({
            speed:25,
            //gravityX:-100,
            gravityY:-25,
            lifespan:500,
            scale:{start:1, end:0.1},
            follow:{x:this.sprite.x, y:this.sprite.y+8},
            maxParticles: 10,
            angle:{min:180, max:360},
            
            //deathZone: {type: 'onEnter', source: this.ground},

        })
        this.sprite.setVelocityY(-5)
    }

    private jumpOnUpdate()
    {
        if(this.sprite.body.velocity.y > 0)
        {
            this.stateMachine.setState('falling')
        }
        const speed = 2.5

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
        this.sprite.play('jumpUP')
    }

    private grappleOnUpdate()
    {
        if(this.keySpace.isDown)
        {
            this.releaseHook()
        }
        this.scene.matter.world.on("collisionstart", (e, b1, b2)=>{
            if((b1.label == 'HOOK') || (b2.label == 'HOOK') && !this.rope && this.hook)
            {
                this.scene.matter.body.setStatic(this.hook, true)
                

                let distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.hook.position.x, this.hook.position.y)
                console.log(distance)
                if(distance > 16*2 && distance < 200)
                {
                    this.rope = this.scene.matter.add.constraint(this.sprite.body as BodyType, this.hook, distance, 0)
                }
                else{
                    this.canFireHook = true
                    this.releaseHook();
                }
            }
        }, this)

        if(!this.graphics)
        {
            this.graphics = this.scene.add.graphics();
        }
        
        this.graphics.clear()

        if(this.rope)
        {
            this.scene.matter.world.renderConstraint(this.rope, this.graphics, 0x00ff00, 1, 1, 1, 1, 1)
        }
        
        
        
    }

    private grappleOnExit()
    {
        this.graphics.clear()
    }

    private fallingOnEnter()
    {
        this.sprite.play('jumpDown')
        this.isGrounded = false
    }

    private fallingOnUpdate()
    {
        if(this.isGrounded)
        {
            this.stateMachine.setState('idle')
        }
        const speed = 2.5

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

    private fallingOnExit()
    {
        this.isGrounded = true
        this.sprite.setVelocityY(0)
    }

    private inputManager()
    {
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.keyQ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }

    private fireHook(e)
    {
        if(this.rope)
        {
            //destroy the current constraint
            this.releaseHook()
        }
        if(this.canFireHook)
        {
            this.canFireHook = false
            this.stateMachine.setState('grapple')
            let angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, e.worldX, e.worldY)
    
            this.hook = this.scene.matter.add.rectangle(this.sprite.x+(16*2)*Math.cos(angle), this.sprite.y+(16*2)*Math.sin(angle), 5, 5, {
                ignoreGravity:true
            })
            this.hook.label = 'HOOK'
    
    
            this.scene.matter.body.setVelocity(this.hook,{
                x: 10* Math.cos(angle),
                y: 10* Math.sin(angle)
            })
            //this.scene.cameras.main.startFollow(this.hook, true, 0.1, 0.1)
            //console.log(angle)
        }
    }

    private releaseHook()
    {
        //is there a constraint? remove it
        if(this.rope)
        {
            this.canFireHook = true
            this.scene.matter.world.removeConstraint(this.rope)
            this.rope = null
        }

        if(this.hook)
        {
            this.scene.matter.world.remove(this.hook)
            this.hook = null
        }

        this.stateMachine.setState('jump')
    }

    private createAnimations(){
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('Elijah', { frames: [0, 1, 2, 3, 4 ] }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNumbers('Elijah', { frames: [ 5, 6, 7, 8, 9, 10 ] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'jumpUP',
            frames: this.scene.anims.generateFrameNumbers('Elijah', { frames: [ 11 ] }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'jumpDown',
            frames: this.scene.anims.generateFrameNumbers('Elijah', { frames: [ 12 ] }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'jumpTouch',
            frames: this.scene.anims.generateFrameNumbers('Elijah', { frames: [ 13, 14 ] }),
            frameRate: 10,
            repeat: 0
        });
    }
}