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
    }

    create()
    {
        const {width, height} = this.scale

        /*this.add.text(width*0.5, height*0.3, 'Before You Realize', {
            fontSize: '52px',
            color: '#ff0000',
            fontStyle: 'Black Hawk'
        })
        .setOrigin(0.5)*/

        this.add.image(0, 0, 'bg').setOrigin(0, 0).setScale(2)
        this.add.image(0, 0, 'menu').setOrigin(0, 0)
        let play = this.add.image(500, 125 , 'play').setOrigin(0, 0)
        .setInteractive()
        .on(Phaser.Input.Events.POINTER_OVER, () => {
            play.setTexture('play2')
        })
        .on(Phaser.Input.Events.POINTER_OUT, () => {
            play.setTexture('play')
        })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            this.scene.start('level')
        })
        

        /*this.add.text(button.x, button.y, 'JOUER', {
            color: '#000000'
        })
        .setOrigin(0.5)*/
    }
}