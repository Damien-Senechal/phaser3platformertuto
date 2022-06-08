import Phaser from 'phaser'

export default class Menu extends Phaser.Scene
{
    constructor()
    {
        super('menu')
    }

    preload()
    {
        this.load.image('menu', 'ressources/sprite/menu.png')
        this.load.image('play', 'ressources/sprite/play.png')
        this.load.image('play2', 'ressources/sprite/play2.png')
        this.load.image('bg', 'ressources/sprite/bg.png')
        this.load.image('sand', 'ressources/sprite/sand.png')
        this.load.image('sand2', 'ressources/sprite/sand2.png')
        this.load.image('sand3', 'ressources/sprite/sand3.png')

        this.load.audio('menu', 'ressources/music/menu.mp3')
        this.load.audio('weapon', 'ressources/audio/weapon.wav')
    }

    create()
    {
        const {width, height} = this.scale

        let music = this.sound.add('menu', {
            loop:true,
            volume:.5
        })
        music.play()
        let sound = this.sound.add('weapon')

        /*this.add.text(width*0.5, height*0.3, 'Before You Realize', {
            fontSize: '52px',
            color: '#ff0000',
            fontStyle: 'Black Hawk'
        })
        .setOrigin(0.5)*/

        

        this.add.image(0, 0, 'bg').setOrigin(0, 0).setScale(2)
        let particle = this.add.particles('sand')
        particle.createEmitter({
            lifespan:10000,
            scale:2,
            x:-10, 
            y:{min:0, max:300},
            bounce: 0.9,
            frequency:500,
            rotate: { min: -10, max: 360},
            speedY: {min: -100, max: 300},
            speedX: {min: -50, max: 300},
            accelerationY: {min: -60, max: 80},
            angle: { min: 90, max: -90 },
        })
        let particle3 = this.add.particles('sand2')
        particle3.createEmitter({
            lifespan:10000,
            scale:2,
            x:-10, 
            y:{min:0, max:300},
            bounce: 0.9,
            frequency:500,
            rotate: { min: -10, max: 360},
            speedY: {min: -100, max: 300},
            speedX: {min: -50, max: 300},
            accelerationY: {min: -60, max: 80},
            angle: { min: 90, max: -90 },
        })
        let particle4 = this.add.particles('sand3')
        particle4.createEmitter({
            lifespan:10000,
            scale:2,
            x:-10, 
            y:{min:0, max:300},
            bounce: 0.9,
            frequency:500,
            rotate: { min: -10, max: 360},
            speedY: {min: -100, max: 300},
            speedX: {min: -50, max: 300},
            accelerationY: {min: -60, max: 80},
            angle: { min: 90, max: -90 },
        })
        /*let particle2 = this.add.particles('sand')
        particle2.createEmitter({
            lifespan:10000,
            scale:2,
            x:610, 
            y:{min:0, max:300},
            bounce: 0.9,
            frequency:500,
            rotate: { min: -10, max: 360},
            speedY: {min: -100, max: 300},
            speedX: {min: -300, max: 50},
            accelerationY: {min: 80, max: -60},
        })
        let particle5 = this.add.particles('sand2')
        particle5.createEmitter({
            lifespan:10000,
            scale:2,
            x:610, 
            y:{min:0, max:300},
            bounce: 0.9,
            frequency:500,
            rotate: { min: -10, max: 360},
            speedY: {min: -100, max: 300},
            speedX: {min: -300, max: 50},
            accelerationY: {min: 80, max: -60},
        })
        let particle6 = this.add.particles('sand3')
        particle6.createEmitter({
            lifespan:10000,
            scale:2,
            x:610, 
            y:{min:0, max:300},
            bounce: 0.9,
            frequency:500,
            rotate: { min: -10, max: 360},
            speedY: {min: -100, max: 300},
            speedX: {min: -300, max: 50},
            accelerationY: {min: 80, max: -60},
        })*/
        this.add.image(0, 0, 'menu').setOrigin(0, 0)

        
        let play = this.add.image(500, 125 , 'play').setOrigin(0, 0)
        .setInteractive()
        .on(Phaser.Input.Events.POINTER_OVER, () => {
            sound.play()
            play.setTexture('play2')
        })
        .on(Phaser.Input.Events.POINTER_OUT, () => {
            play.setTexture('play')
        })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            music.stop()
            this.scene.start('level')
        })
        
        

        /*this.add.text(button.x, button.y, 'JOUER', {
            color: '#000000'
        })
        .setOrigin(0.5)*/
    }
}