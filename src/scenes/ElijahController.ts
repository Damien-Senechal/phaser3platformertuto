import { Events } from 'matter'
import Phaser, { BlendModes } from 'phaser'
import StateMachine from '~/statemachine/StateMachine'
import EnnemiesController from './EnnemiesController'
import { sharedInstance as events} from './EventCenter'
import * as MatterJS from 'matter-js'

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
    private keyE
    private hook
    private rope
    private graphics
    private smoke
    private isGrounded
    private refY
    private canFireHook
    private activeWeapon
    private activeWeaponSelection
    private lastPig
    private hitbox
    private isSlashing
    private bullet
    private canBlade
    private canShoot
    private checkpoint
    private bullets = 5
    private trunk!: Phaser.GameObjects.Sprite
    private pistolSprite!: Phaser.GameObjects.Sprite
    private angle
    private hitboxTouch
    private alive
    private isParry
    private lastGround

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
        this.activeWeapon = 'Hook'
        this.activeWeaponSelection = 0
        this.canBlade = true
        this.canShoot = true
        this.checkpoint = {
            x:this.sprite.x, 
            y:this.sprite.y
        }
        this.isSlashing = false
        this.hitboxTouch = false
        this.alive = true
        this.isParry = false
        
        /*this.hitbox = this.scene.matter.add.rectangle(this.sprite.body.position.x+20, this.sprite.body.position.y-2, 2, 2, {
            isSensor:true,
            isStatic: false,
            ignoreGravity: true,
            label:'hitbox-attack'
        })*/
        

        this.inputManager()
        this.createAnimations()

        this.hook = null
        this.rope = null
        this.bullet = null
        this.lastGround = null

        const elijahController = {
            sprite,
            sensors: {
                blade: MatterJS.BodyType,
                down: MatterJS.BodyType,
                up: MatterJS.BodyType,
                left: MatterJS.BodyType,
                right: MatterJS.BodyType
            }
        }
        const elijahBody = this.scene.matter.bodies.rectangle(sprite.x, sprite.y, 11, 13, {
            isSensor: false,
            label: 'Elijah'
        })

        /*elijahController.sensors.blade = this.scene.matter.bodies.rectangle(sprite.x, sprite.y-2, 32, 16, {
            isSensor: true,
            label: 'hitbox-attack'
        })*/

        elijahController.sensors.down = this.scene.matter.bodies.rectangle(sprite.x, sprite.y+10, 3, 5,{
            isSensor: true,
            label: 'hitbox-down'
        })

        elijahController.sensors.up = this.scene.matter.bodies.rectangle(sprite.x, sprite.y-10, 3, 5,{
            isSensor: true,
            label: 'hitbox-up'
        })

        elijahController.sensors.left = this.scene.matter.bodies.rectangle(sprite.x+12, sprite.y, 12, 3,{
            isSensor: true,
            label: 'hitbox-attack'
        })

        elijahController.sensors.right = this.scene.matter.bodies.rectangle(sprite.x-12, sprite.y, 12, 3,{
            isSensor: true,
            label: 'hitbox-attack'
        })
        
        const compoundElijah = this.scene.matter.body.create({
            parts: [
                    elijahBody,
                    //elijahController.sensors.blade,
                    elijahController.sensors.up,
                    elijahController.sensors.down,
                    elijahController.sensors.left,
                    elijahController.sensors.right
                ],
            restitution: 0.05
        })
        elijahController.sprite.setExistingBody(compoundElijah)
        elijahController.sprite.setFixedRotation()
        elijahController.sprite.setFriction(1)




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
            .addState('attack', {
                onEnter: this.attackOnEnter,
                onUpdate: this.attackOnUpdate,
                onExit: this.attackOnExit
            })
            .addState('shoot', {
                onEnter: this.shootOnEnter
            })
            .addState('pig-hit', {
                onEnter: this.pigOnEnter
            })
            .addState('dead', {
                onEnter: this.deadOnEnter,
                onUpdate: this.deadOnUpdate,
                onExit: this.deadOnExit
            })
            .addState('parry', {
                onEnter: this.parryOnEnter,
                onExit: this.parryOnExit

            })
            .addState('change-weapon', {
                onEnter: this.changeWeaponOnEnter
            })
            .setState('falling')

            /*this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
                const bodyA = data.bodyA as MatterJS.BodyType
                const bodyB = data.bodyB as MatterJS.BodyType
                const gameObjectA = bodyA
                const gameObjectB = bodyB

                //console.log(bodyB.label)

                //dconsole.log(gameObjectA)
                //console.log(gameObjectB)

                if(!gameObjectA)
                {
                    return
                }

                if(bodyB.label === 'pig')
                {
                    this.lastPig = bodyB.gameObject
                    this.stateMachine.setState('pig-hit')
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

                if(bodyB.label === 'Checkpoint')
            {
                //console.log(bodyB.label)
                this.checkpoint = {
                    x:bodyB.position.x,
                    y:bodyB.position.y,
                }
            }
            if(bodyB.label === 'End')
            {
                //console.log(bodyB.label)
                this.scene.scene.start('fort')
            }
            })*/

            this.scene.matter.world.on('collisionstart', (event, b1, b2) => {
                for (var i = 0; i < event.pairs.length; i++) {

                    //collision blade *start*

                    if(b2.label === 'hitbox-attack' && b1.label === 'pig-hitbox' && this.alive && !this.isParry)
                    {
                        this.lastPig = b1.gameObject
                        //events.emit('pig-killed',this.lastPig)
                        this.hitboxTouch = true
                        //console.log(this.hitboxTouch)
                        return
                    }
                    if(b1.label === 'hitbox-attack' && b2.label === 'pig-hitbox' && this.alive && !this.isParry)
                    {
                        this.lastPig = b2.gameObject
                        //events.emit('pig-killed',this.lastPig)
                        this.hitboxTouch = true
                        //console.log(this.hitboxTouch)
                        return
                    }

                    //collision blade *end*

                    //collision bullet *start*

                    if(b2.label === 'hitbox-shoot' && b1.label === 'pig-hitbox' && this.alive)
                    {
                        b2.gameObject.destroy()
                        this.lastPig = b1.gameObject
                        events.emit('pig-killed',this.lastPig)
                        return
                    }
                    else if(b2.label === 'hitbox-shoot' && b1.label === 'ground')
                    {
                        b2.gameObject.destroy()
                        return
                    }
                    if(b1.label === 'hitbox-shoot' && b2.label === 'pig-hitbox' && this.alive)
                    {
                        b1.gameObject.destroy()
                        this.lastPig = b2.gameObject
                        events.emit('pig-killed',this.lastPig)
                        return
                    }
                    else if(b1.label === 'hitbox-shoot' && b2.label === 'ground')
                    {
                        b1.gameObject.destroy()
                        return
                    }
                    
                    
                    
                    // Elijah Collision *start*

                    if(b1.label === 'Elijah' && b2.label === 'pig' && this.alive  && !this.isParry)
                    {
                        this.lastPig = b2.gameObject
                        this.stateMachine.setState('pig-hit')
                        return
                    }

                    /*if((b1.label === 'ground' && b2.label === 'Elijah') || (b1.label === 'corner' && b2.label === 'Elijah'))
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
                    }*/

                    if((b1 === elijahController.sensors.down || b2 === elijahController.sensors.down) && (b1.label === 'ground' || b2.label === 'ground') && this.alive)
                    {
                        this.isGrounded = true
                        this.canFireHook = true
                        this.lastGround = 0
                        console.log('on touche le sol')
                        return
                    }

                    if(b1.label === 'Elijah' && b2.label === 'Checkpoint' && this.alive)
                    {
                    //console.log(bodyB.label)
                        this.checkpoint = {
                            x:b2.position.x,
                            y:b2.position.y,
                            }
                        return
                    }
                    if(b1.label === 'Elijah' && b2.label === 'End' && this.alive)
                    {
                        //console.log(bodyB.label)
                        if(this.scene.scene.key === 'fort')
                        {
                            this.scene.scene.start('game-over')
                        }
                        else{
                            this.scene.scene.start('fort')
                        }
                        
                        return
                    }
                    if(b1.label === 'Elijah' && b2.label === 'Dead' && this.alive)
                    {
                        //console.log(bodyB.label)
                        this.scene.scene.start('game-over')
                        
                        return
                    }

                    // Elijah Collision *end*
                }
            }, this);

            this.scene.matter.world.on('collisionend', (event, b1, b2) => {
                for (var i = 0; i < event.pairs.length; i++) {
                    if(b2.label === 'hitbox-attack' && b1.label === 'pig-hitbox' && this.alive && !this.isParry)
                    {
                        this.lastPig = b1.gameObject
                        //events.emit('pig-killed',this.lastPig)
                        this.hitboxTouch = false
                        //console.log(this.hitboxTouch)
                        return
                    }
                    if(b1.label === 'hitbox-attack' && b2.label === 'pig-hitbox' && this.alive && !this.isParry)
                    {
                        this.lastPig = b2.gameObject
                        //events.emit('pig-killed',this.lastPig)
                        this.hitboxTouch = false
                        //console.log(this.hitboxTouch)
                        return
                    }
                    if(b2.label === 'hitbox-shoot' && b1.label === 'pig-hitbox' && this.alive)
                    {
                        b2.gameObject.destroy()
                        this.lastPig = b1.gameObject
                        events.emit('pig-killed',this.lastPig)
                        return
                    }
                    if(b1.label === 'hitbox-shoot' && b2.label === 'pig-hitbox' && this.alive)
                    {
                        b1.gameObject.destroy()
                        this.lastPig = b2.gameObject
                        events.emit('pig-killed',this.lastPig)
                        return
                    }

                    if((b1 === elijahController.sensors.down || b2 === elijahController.sensors.down) && (b1.label === 'ground' || b2.label === 'ground') && this.alive)
                    {
                        this.isGrounded = false
                        console.log('on sort du sol')
                        return
                    }
                    
                }
            }, this);


            this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
                if(this.alive)
                {
                    this.activeWeaponSelection+=deltaY

                    this.activeWeaponSelection=this.activeWeaponSelection%300

                    events.emit('weapon-changed', this.activeWeapon)

                    this.stateMachine.setState('change-weapon')
                }
            }, this);

        this.scene.input.on("pointerup", (pointer) => {
            if(this.activeWeapon === 'Hook')
            {
                this.fireHook(pointer)
            }
            else if(this.activeWeapon === 'Blade')
            {
                this.stateMachine.setState('attack')
            }
            else if(this.activeWeapon === 'Pistol')
            {
                if(this.bullets>0)
                {
                    this.shootPistol(pointer)
                }
            }
        })

        //this.changeWeapon()
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
        //console.log(this.activeWeapon)
        this.changeWeapon()
        //console.log(this.checkpoint)
        if(this.rope)
        {
            this.angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, this.rope.bodyB.position.x, this.rope.bodyB.position.y)
        }
        //console.log(this.hitbox)
        //this.hitbox.velocity.x = this.sprite.body.velocity.x
        //this.hitbox.velocity.y = this.sprite.body.velocity.y
        /*this.hitbox = this.scene.matter.add.rectangle(this.sprite.body.position.x+20, this.sprite.body.position.y-2, 2, 2, {
            isSensor:true,
            isStatic: false,
            ignoreGravity: true,
            label:'hitbox-attack'
        })*/
        //console.log(this.angle)
        if(this.hitboxTouch && this.isSlashing)
        {
            events.emit('pig-killed',this.lastPig)
        }

        if(this.activeWeapon === 'Pistol')
        {
            if(!this.pistolSprite)
            {
                this.pistolSprite = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'Elijah-pistol').setOrigin(0, 1)
            }
            this.pistolSprite.setVisible(true)
            //console.log(this.pistolSprite.rotation)
            if(!this.sprite.flipX)
            {
                this.pistolSprite.setOrigin(0, 1)
                this.pistolSprite.rotation = Phaser.Math.Angle.Between(this.pistolSprite.x, this.pistolSprite.y, this.scene.game.input.mousePointer.worldX, this.scene.game.input.mousePointer.worldY)
                if((this.pistolSprite.rotation < -1.57))
                {
                    this.pistolSprite.rotation = -1.57
                }
                else if(this.pistolSprite.rotation > 1.57)
                {
                    this.pistolSprite.rotation = 1.57
                }
                this.pistolSprite.flipX = false
                this.pistolSprite.x = this.sprite.body.position.x+3
                this.pistolSprite.y = this.sprite.body.position.y+2
            }
            else{
                this.pistolSprite.setOrigin(1, 1)
                this.pistolSprite.rotation = Phaser.Math.Angle.Between(this.pistolSprite.x, this.pistolSprite.y, this.scene.game.input.mousePointer.worldX, this.scene.game.input.mousePointer.worldY)+3.14
                if((this.pistolSprite.rotation > 1.57))
                {
                    this.pistolSprite.rotation = 1.57
                }
                else if(this.pistolSprite.rotation < -1.57)
                {
                    this.pistolSprite.rotation = -1.57
                }
                this.pistolSprite.flipX = true
                this.pistolSprite.x = this.sprite.body.position.x-3
                this.pistolSprite.y = this.sprite.body.position.y+2
            }
            
        }
        else{
            if(this.pistolSprite)
            {
                this.pistolSprite.setVisible(false)
            }
            
        }

        //console.log(this.lastGround)
        
    }


    private idleOnEnter()
    {
        if(this.activeWeapon === 'Hook')
        {
            this.sprite.play('idle')
        }
        else if(this.activeWeapon === 'Blade')
        {
            this.sprite.play('idleBlade')
        }
        else if(this.activeWeapon === 'Pistol')
        {
            this.sprite.play('idlePistol')
        }
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

        if(this.keyE.isDown)
        {
            //console.log('')
            this.stateMachine.setState('parry')
        }
    }

    private idleOnExit()
    {

    }

    private walkOnEnter()
    {
        if(this.activeWeapon === 'Hook')
        {
            this.sprite.play('walk')
        }
        else if(this.activeWeapon === 'Blade')
        {
            this.sprite.play('walkBlade')
        }
        else if(this.activeWeapon === 'Pistol')
        {
            this.sprite.play('walkPistol')
        }

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

        if(this.isGrounded === false)
        {
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
        if(this.activeWeapon === 'Hook')
        {
            this.sprite.play('jumpUP')
        }
        else if(this.activeWeapon === 'Blade')
        {
            this.sprite.play('jumpUPBlade')
        }
        else if(this.activeWeapon === 'Pistol')
        {
            this.sprite.play('jumpUPPistol')
        }
        
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
        if(this.sprite.body.velocity.y > 0 && this.isGrounded === false)
        {
            this.stateMachine.setState('falling')
        }
        else if(this.isGrounded)
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

    private jumpOnExit()
    {
        this.isGrounded = true
    }

    private grappleOnEnter()
    {
        this.isGrounded = false
        this.sprite.play('jumpUPGrapple')
        this.trunk = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'Elijah-trunk')
    }

    private grappleOnUpdate()
    {
        this.trunk.x = this.sprite.x
        this.trunk.y = this.sprite.y
        if(this.sprite.flipX)
        {
            this.trunk.setTexture('Elijah-trunk')
        }
        else{
            this.trunk.setTexture('Elijah-trunkflip')
        }

        this.trunk.rotation = (this.angle+1.5)%3.14


        if(this.keySpace.isDown)
        {
            this.releaseHook()
        }
        this.scene.matter.world.on("collisionstart", (e, b1, b2)=>{
            if((b1.label === 'HOOK') || (b2.label === 'HOOK') && !this.rope && this.hook && b1.label !== 'Checkpoint' && b2.label !== 'Checkpoint' && (b1.id === this.lastGround && b2.id === this.lastGround))
            {
                this.releaseHook()
            }
            else if((b1.label === 'HOOK') || (b2.label === 'HOOK') && !this.rope && this.hook && b1.label !== 'Checkpoint' && b2.label !== 'Checkpoint' && (b1.id!== this.lastGround && b2.id !== this.lastGround))
            {
                if(b1.label === 'HOOK')
                {
                    this.lastGround = b2.id
                }
                else if(b2.label === 'HOOK')
                {
                    this.lastGround = b1.id
                }
                this.scene.matter.body.setStatic(this.hook, true)
                

                let distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.hook.position.x, this.hook.position.y)
                //console.log(distance)
                if(distance > 16*2 && distance < 200)
                {
                    this.rope = this.scene.matter.add.constraint(this.sprite.body as MatterJS.BodyType, this.hook, distance, 0)
                }
                else{
                    this.canFireHook = true
                    this.releaseHook();
                }
                return
            }
        }, this)

        if(!this.graphics)
        {
            this.graphics = this.scene.add.graphics();
            this.graphics.setDepth(-1)
        }
        
        this.graphics.clear()

        if(this.rope)
        {
            this.scene.matter.world.renderConstraint(this.rope, this.graphics, 0xe6482e, 1, 1, 0, 0, 0)
        }
    }

    private grappleOnExit()
    {
        this.isGrounded = true
        this.graphics.clear()
        this.trunk.destroy()
    }

    private fallingOnEnter()
    {
        this.isGrounded = false
        if(this.activeWeapon === 'Hook')
        {
            this.sprite.play('jumpDown')
        }
        else if(this.activeWeapon === 'Blade')
        {
            this.sprite.play('jumpDownBlade')
        }
        else if(this.activeWeapon === 'Pistol')
        {
            this.sprite.play('jumpDownPistol')
        }
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
    }

    private attackOnEnter()
    {
        
        if(this.canBlade)
        {
            this.sprite.play('attackBlade')
            this.isSlashing = true
            this.canBlade = false
            this.scene.time.delayedCall(300, () => {
                this.canBlade = true
                this.stateMachine.setState('idle')
            })
        }  
        else{
            this.stateMachine.setState('idle')
        }
    }

    private attackOnUpdate()
    {
        //console.log(this.isSlashing)
        
        /*else{
            this.sprite.play('attackBlade')
            this.stateMachine.setState('idle')
        }*/
    }

    private attackOnExit()
    {
        this.isSlashing = false
    }

    private pigOnEnter()
    {
        if(this.activeWeapon === 'Hook')
        {
            this.sprite.play('damage')
        }
        else if(this.activeWeapon === 'Blade')
        {
            this.sprite.play('damageBlade')
        }
        else if(this.activeWeapon === 'Pistol')
        {
            this.sprite.play('damagePistol')
        }
        if(this.lastPig)
        {
            if(this.sprite.x < this.lastPig.x)
            {
                this.sprite.setVelocityX(-10)
                this.sprite.setVelocityY(-2)
            }
            else
            {
                this.sprite.setVelocityX(10)
                this.sprite.setVelocityY(-2)
            }
        }
        else
        {
            this.sprite.setVelocityY(-20)
        }

        const startColor = Phaser.Display.Color.ValueToColor(0xffffff)
        const endColor = Phaser.Display.Color.ValueToColor(0xff0000)

        this.scene.tweens.addCounter({
            from:0,
            to:100,
            duration:100,
            repeat:2,
            yoyo:true,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: tween => {
                const value = tween.getValue()
                const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
                    startColor, 
                    endColor,
                    100,
                    value
                )

                const color = Phaser.Display.Color.GetColor(
                    colorObject.r,
                    colorObject.g,
                    colorObject.b
                )

                this.sprite.setTint(color)
            }
        })
        this.setHealth(this.health - 10)
        if(this.alive && this.health > 0){
            this.scene.time.delayedCall(500, () => {
                this.stateMachine.setState('idle')
            })
        }
        else{
            this.stateMachine.setState('dead')
        }
    }

    private shootOnEnter()
    {
        this.bullets -= 1
        this.setBullets(this.bullets)
        //console.log(this.bullets)
        this.stateMachine.setState('idle')
    }

    private deadOnEnter()
    {
        if(this.activeWeapon === 'Hook')
        {
            this.sprite.play('die')
        }
        else if(this.activeWeapon === 'Blade')
        {
            this.sprite.play('dieBlade')
        }
        else if(this.activeWeapon === 'Pistol')
        {
            this.sprite.play('diePistol')
        }
        this.alive = false

        this.scene.time.delayedCall(1500, () => {
            //this.scene.scene.start('game-over')
            this.respawn()
        })

    }

    private deadOnUpdate()
    {

    }

    private deadOnExit()
    {
        this.hitboxTouch = false
        //console.log(this.hitboxTouch)
    }

    private parryOnEnter()
    {
        this.isParry = true
        this.sprite.setStatic(true)
        this.scene.time.delayedCall(1000, () => {
            this.stateMachine.setState('idle')
        })
    }

    private parryOnExit()
    {
        this.sprite.setStatic(false)
        this.isParry = false
        //console.log('WE HAVE PARRY')
    }

    private changeWeaponOnEnter()
    {
        //console.log('Weapon Changed !')
        this.stateMachine.setState('idle')
    }

    private inputManager()
    {
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.keyQ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        this.keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    }

    private fireHook(e)
    {
        if(e.leftButtonReleased())
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
                    ignoreGravity:true,
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

        //Hook Animations

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
        this.scene.anims.create({
            key: 'damage',
            frames: this.scene.anims.generateFrameNumbers('Elijah', { start:15, end:18 }),
            frameRate: 10,
            repeat: 0
        });
        this.scene.anims.create({
            key: 'die',
            frames: this.scene.anims.generateFrameNumbers('Elijah', { start:19, end:23 }),
            frameRate: 10,
            repeat: 0
        });

        //Grapple Animations

        this.scene.anims.create({
            key: 'idleGrapple',
            frames: this.scene.anims.generateFrameNumbers('ElijahGrapple', { frames: [0, 1, 2, 3, 4 ] }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'walkGrapple',
            frames: this.scene.anims.generateFrameNumbers('ElijahGrapple', { frames: [ 5, 6, 7, 8, 9, 10 ] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'jumpUPGrapple',
            frames: this.scene.anims.generateFrameNumbers('ElijahGrapple', { frames: [ 11 ] }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'jumpDownGrapple',
            frames: this.scene.anims.generateFrameNumbers('ElijahGrapple', { frames: [ 12 ] }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'jumpTouchGrapple',
            frames: this.scene.anims.generateFrameNumbers('ElijahGrapple', { frames: [ 13, 14 ] }),
            frameRate: 10,
            repeat: 0
        });

        //Blade Animations

        this.scene.anims.create({
            key: 'idleBlade',
            frames: this.scene.anims.generateFrameNumbers('ElijahBlade', { frames: [0, 1, 2, 3, 4 ] }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'walkBlade',
            frames: this.scene.anims.generateFrameNumbers('ElijahBlade', { frames: [ 5, 6, 7, 8, 9, 10 ] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'jumpUPBlade',
            frames: this.scene.anims.generateFrameNumbers('ElijahBlade', { frames: [ 11 ] }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'jumpDownBlade',
            frames: this.scene.anims.generateFrameNumbers('ElijahBlade', { frames: [ 12 ] }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'jumpTouchBlade',
            frames: this.scene.anims.generateFrameNumbers('ElijahBlade', { frames: [ 13, 14 ] }),
            frameRate: 10,
            repeat: 0
        });
        this.scene.anims.create({
            key: 'attackBlade',
            frames: this.scene.anims.generateFrameNumbers('ElijahBlade', { frames: [ 15, 16, 17, 18, 19 ] }),
            frameRate: 10,
            repeat: 0
        });
        this.scene.anims.create({
            key: 'damageBlade',
            frames: this.scene.anims.generateFrameNumbers('ElijahBlade', {start: 20, end: 23}),
            frameRate: 10,
            repeat: 0
        });
        this.scene.anims.create({
            key: 'dieBlade',
            frames: this.scene.anims.generateFrameNumbers('ElijahBlade', {start: 24, end: 28}),
            frameRate: 10,
            repeat: 0
        });

        //Pistol Animations

        this.scene.anims.create({
            key: 'idlePistol',
            frames: this.scene.anims.generateFrameNumbers('ElijahPistol', { frames: [0, 1, 2, 3, 4 ] }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'walkPistol',
            frames: this.scene.anims.generateFrameNumbers('ElijahPistol', { frames: [ 5, 6, 7, 8, 9, 10 ] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'jumpUPPistol',
            frames: this.scene.anims.generateFrameNumbers('ElijahPistol', { frames: [ 11 ] }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'jumpDownPistol',
            frames: this.scene.anims.generateFrameNumbers('ElijahPistol', { frames: [ 12 ] }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'jumpTouchPistol',
            frames: this.scene.anims.generateFrameNumbers('ElijahPistol', { frames: [ 13, 14 ] }),
            frameRate: 10,
            repeat: 0
        });
        this.scene.anims.create({
            key: 'damagePistol',
            frames: this.scene.anims.generateFrameNumbers('ElijahPistol', {start: 15, end: 18}),
            frameRate: 10,
            repeat: 0
        });
        this.scene.anims.create({
            key: 'diePistol',
            frames: this.scene.anims.generateFrameNumbers('ElijahPistol', {start: 19, end: 23}),
            frameRate: 10,
            repeat: 0
        });
    }

    private abs(value: number){
        if(value<0){
            return value*-1
        }
        return value
    }

    private changeWeapon()
    {
        events.emit('weapon-changed', this.activeWeapon)
        if(this.abs(this.activeWeaponSelection) === 0)
        {
            this.activeWeapon = 'Blade'
        }
        else if(this.abs(this.activeWeaponSelection) === 100)
        {
            this.activeWeapon = 'Pistol'
        }
        else if(this.abs(this.activeWeaponSelection) === 200)
        {
            this.activeWeapon = 'Hook'
        }
    }

    private shootPistol(e)
    {
        if(this.canShoot)
        {
            this.canShoot = false
            if(e.leftButtonReleased())
            {
                let angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, e.worldX, e.worldY)
    
                        this.bullet = this.scene.matter.add.sprite(this.sprite.x+(16)*Math.cos(angle), this.sprite.y+(16)*Math.sin(angle), 'bullet', 0, {
                            ignoreGravity:true,
                            label: 'hitbox-shoot'
                        })
                        this.bullet.label = 'hitbox-shoot'
                        this.bullet.rotation = angle
    
    
                        this.scene.matter.body.setVelocity(this.bullet.body,{
                            x: 10* Math.cos(angle),
                            y: 10* Math.sin(angle)
                        })
                this.stateMachine.setState('shoot')
            }
            this.scene.time.delayedCall(500, () => {
               this.canShoot = true
            })
        }
        else{
            this.stateMachine.setState('idle')
        }
        
    }

    private setHealth(value: number)
    {
        this.health = Phaser.Math.Clamp(value - 10, 0, 100)

        events.emit('health-changed', this.health)

        if(this.health <= 0)
        {
            this.stateMachine.setState('dead')
        }
    }

    private setBullets(value : number){
        this.bullets = value
        if(this.bullets < 0)
        {
            this.bullets = 0
        }
        events.emit('bullets-changed', this.bullets)
    }

    private respawn()
    {
        this.alive = true
        if(this.sprite.isStatic())
        {
            this.sprite.setStatic(false)
        }
        this.sprite.x = this.checkpoint.x
        this.sprite.y = this.checkpoint.y
        this.setHealth(110)
        this.stateMachine.setState('idle')
    }
}





/*private attackOnEnter()
    {
        
        if(this.canBlade)
        {
            this.sprite.play('attackBlade')
            this.isSlashing = true
            this.canBlade = false
            if(this.sprite.flipX)
            {
                this.hitbox = this.scene.matter.add.rectangle(this.sprite.body.position.x-20, this.sprite.body.position.y-2, 1, 1, {
                    isSensor:true,
                    isStatic: false,
                    ignoreGravity: true,
                    label:'hitbox-attack'
                })
                hitbox1 = this.scene.matter.add.rectangle(this.sprite.body.position.x-20, this.sprite.body.position.y-2, 1, 1, {
                    isSensor:true,
                    isStatic: false,
                    ignoreGravity: true,
                    label:'hitbox-attack'
                })
                hitbox2 = this.scene.matter.add.rectangle(this.sprite.body.position.x-18, this.sprite.body.position.y-2, 1, 1, {
                    isSensor:true,
                    isStatic: false,
                    ignoreGravity: true,
                    label:'hitbox-attack'
                })
                hitbox3 = this.scene.matter.add.rectangle(this.sprite.body.position.x-16, this.sprite.body.position.y-2, 1, 1, {
                    isSensor:true,
                    isStatic: false,
                    ignoreGravity: true,
                    label:'hitbox-attack'
                })
                hitbox4 = this.scene.matter.add.rectangle(this.sprite.body.position.x-14, this.sprite.body.position.y-2, 1, 1, {
                    isSensor:true,
                    isStatic: false,
                    ignoreGravity: true,
                    label:'hitbox-attack'
                })
            }
            else{
                this.hitbox = this.scene.matter.add.rectangle(this.sprite.body.position.x+20, this.sprite.body.position.y-2, 1, 1, {
                    isSensor:true,
                    isStatic: false,
                    ignoreGravity: true,
                    label:'hitbox-attack'
                })
                hitbox1 = this.scene.matter.add.rectangle(this.sprite.body.position.x+20, this.sprite.body.position.y-2, 1, 1, {
                    isSensor:true,
                    isStatic: false,
                    ignoreGravity: true,
                    label:'hitbox-attack'
                })
                hitbox2 = this.scene.matter.add.rectangle(this.sprite.body.position.x+18, this.sprite.body.position.y-2, 1, 1, {
                    isSensor:true,
                    isStatic: false,
                    ignoreGravity: true,
                    label:'hitbox-attack'
                })
                hitbox3 = this.scene.matter.add.rectangle(this.sprite.body.position.x+16, this.sprite.body.position.y-2, 1, 1, {
                    isSensor:true,
                    isStatic: false,
                    ignoreGravity: true,
                    label:'hitbox-attack'
                })
                hitbox4 = this.scene.matter.add.rectangle(this.sprite.body.position.x+14, this.sprite.body.position.y-2, 1, 1, {
                    isSensor:true,
                    isStatic: false,
                    ignoreGravity: true,
                    label:'hitbox-attack'
                })
            }
            this.sprite.setStatic(true)
            this.scene.time.delayedCall(100, () => {
                this.sprite.setStatic(false)
                this.scene.matter.world.remove(this.hitbox);
            })
            this.scene.time.delayedCall(300, () => {
                this.canBlade = true
                this.stateMachine.setState('idle')
            })
            this.scene.time.delayedCall(1000, () => {
                this.canBlade = true
            })
        }  
        else{
            this.stateMachine.setState('idle')
        } 
        this.scene.time.delayedCall(1000, () => {
            this.canBlade = true
        })
    }*/