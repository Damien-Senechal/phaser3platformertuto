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

        this.add.image(0, 0, 'menu').setOrigin(0, 0)

        /*const button = this.add.rectangle(width*0.5, height*0.55, 150, 75, 0xffffff)
        .setInteractive()
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            this.scene.start('level')
        })*/

        /*this.add.text(button.x, button.y, 'JOUER', {
            color: '#000000'
        })
        .setOrigin(0.5)*/
    }
}