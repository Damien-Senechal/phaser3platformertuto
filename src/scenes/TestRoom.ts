import { Body, Vector } from 'matter'
import Phaser from 'phaser'
import ObstaclesController from './ObstaclesController'
import PlayerController from './PlayerController'
import SnowmanController from './SnowmanController'

export default class TestRoom extends Phaser.Scene
{
    private screenWidth
    private screenHeight
    private numberOfBoxes = 5
    private hero
    private hook
    private rope
    
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
        this.load.atlas('penguin', 'assets/penguin.png', 'assets/penguin.json')
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
        this.hero = this.matter.add.rectangle(this.screenWidth / 2, this.screenHeight / 2, 16, 16,{
            restitution: 0.5
        });
        this.hero.setStatic(true)
        this.hero.label = this.BALL;
        //this.matter.body.setStatic(box, true)

        this.hook = null

        //this.input.on("pointerdown", this.fireHook, this)

        this.rope = null

        let me = this
        /*this.matter.world.on("collisionstart", function(e, b1, b2){
            if((b1.label = me.BALL) || (b2.label = me.BALL))
            {
                me.releaseHook()
                return
            }

            if((b1.label == me.HOOK) || (b2.label = me.HOOK) && !me.rope)
            {
                // make the hook static
                me.hook.static = true
            }
        })*/
    }

    destroy()
    {
        
    }

    update(t: number, dt: number)
    {

        console.log(this.hero.isStatic)
    }
}