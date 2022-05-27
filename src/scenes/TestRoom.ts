import { Body, Vector } from 'matter'
import Phaser from 'phaser'
import ObstaclesController from './ObstaclesController'
import PlayerController from './PlayerController'
import SnowmanController from './SnowmanController'
import { GameObjects } from 'phaser'

export default class TestRoom extends Phaser.Scene
{
    private screenWidth
    private screenHeight
    private numberOfBoxes = 5
    private hero
    private hook
    private rope
    private heroSize = 16
    private hookSpeed=10
    private constraintSpeed = 2
    private ropeTolerance = 6
    private cursors
    
    private WALL = 'WALL'
    private BALL = 'BALL'
    private HOOK = 'HOOK'

    constructor()
    {
        super('TestRoom')
    }

    init()
    {

    }

    preload()
    {

    }

    create()
    {
        //init global variables
        this.screenHeight = this.game.config.height
        this.screenWidth = this.game.config.width

        //update world physics 30 times per second
        this.matter.world.update30Hz();

        //set the bound of the world
        this.matter.world.setBounds(10, 10,  this.screenWidth - 20, this.screenHeight - 20);

        //place boxes for test
        for(let i=0; i<this.numberOfBoxes; i++)
        {
            let posX = Phaser.Math.Between(0, this.screenWidth);
            let posY = Phaser.Math.Between(0, this.screenHeight);
            let width = Phaser.Math.Between(50, 100);
            let height = Phaser.Math.Between(50, 100);
            let poly = this.matter.add.rectangle(posX, posY, width, height, {
                isStatic: true
            });
            poly.label = this.WALL
        }
        // adding a bouncing ball labeled as BALL
        this.hero = this.matter.add.rectangle(this.screenWidth / 2, this.screenHeight / 2, this.heroSize, this.heroSize,{
            restitution: 0.5
        });
        this.hero.label = this.BALL;

        console.log(this.hero)

        //this.hero.setStatic(true)
        //this.matter.body.setStatic(box, true)

        this.hook = null
        let me = this

        this.input.on("pointerdown", this.fireHook, this)

        this.rope = null

        // collision listener
        this.matter.world.on("collisionstart", function(e, b1, b2){
 
            // when the hook collides with something, let's make it static and create the joint
            if((b1.label == me.HOOK || b2.label == me.HOOK) && !me.rope){
 
                // make the hook static
                me.matter.body.setStatic(me.hook, true)
 
                // calculate the distance between the ball and the hook
                let distance = Phaser.Math.Distance.Between(me.hero.position.x, me.hero.position.y, me.hook.position.x, me.hook.position.y);
 
                // is the distance fairly greater than hero size?
                if(distance > me.heroSize * 2){
 
                    // add the constraint
                    me.rope = me.matter.add.constraint(me.hero, me.hook, distance, 0.1);
                }
            }
        }, this)

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    //method to fire the hook
    fireHook(e)
    {
        //do we have a constraint
        if(this.hook)
        {
            //destroy the current constraint
            this.releaseHook()
        }
        else{
            //calculate the angle between the pointer and the ball
            let angle = Phaser.Math.Angle.Between(this.hero.position.x, this.hero.position.y, e.position.x, e.position.y)
        
            this.hook = this.matter.add.rectangle(this.hero.position.x + (this.heroSize * 2) * Math.cos(angle), this.hero.position.y + (this.heroSize * 2) * Math.sin(angle), 10, 10)
            this.hook.label = this.HOOK

            //give the proper velocity
            this.matter.body.setVelocity(this.hook,{
                x: this.hookSpeed * Math.cos(angle),
                y: this.hookSpeed * Math.sin(angle)
            })
            //this.hook = this.add.sprite(this.hero.position.x, this.hero.position.y, '')
        }
        
    }

    //method to remove the hook
    releaseHook()
    {
        //is there a constraint? remove it
        if(this.rope)
        {
            this.matter.world.removeConstraint(this.rope)
            this.rope = null
        }

        if(this.hook)
        {
            this.matter.world.remove(this.hook)
            this.hook = null
        }
    }

    destroy()
    {
        
    }

    update(t: number, dt: number)
    {
        // is there a constraint? Shrink it
        if(this.rope){
            this.rope.length -= this.constraintSpeed;
            let hookPosition = this.hook.position;
            let heroPosition = this.hero.position;
            let distance = Phaser.Math.Distance.Between(hookPosition.x, hookPosition.y, heroPosition.x, heroPosition.y);
            if(distance - this.rope.length > this.ropeTolerance){
                this.rope.length = distance;
            }
            this.rope.length = Math.max(this.rope.length, this.heroSize * 2);
        }
        console.log(this.hero.isStatic)
    }
}