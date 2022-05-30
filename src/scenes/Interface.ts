import Phaser from 'phaser'
import { sharedInstance as events } from './EventCenter'

export default class UI extends Phaser.Scene
{
    private graphics!: Phaser.GameObjects.Graphics

    private lastHealth
    private elijahPortrait

    constructor()
    {
        super({
            key:'interface'
        })
    }

    init()
    {
        
    }

    preload()
    {
        this.load.spritesheet('Elijah-Portrait', 'ressources/sprite/Elijah_portrait_idle-Sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('bullet-icon', 'ressources/sprite/bullet_icon.png')
    }

    create()
    {   
        this.anims.create({
            key: 'idle-portrait',
            frames: this.anims.generateFrameNumbers('Elijah-Portrait', {start:0, end:16}),
            frameRate: 10,
            repeat: -1
        });

        this.graphics = this.add.graphics()
        this.setInterface(100, 100, 10)
        this.add.sprite(26, 25, 'Elijah-Portrait').play('idle-portrait')
    }



    private setInterface(health: number, stamina: number, bullets: number)
    {
        const width = 100
        const percent = Phaser.Math.Clamp(health, 0, 100) / 100
        const percent2 = Phaser.Math.Clamp(stamina, 0, 100) / 100



        this.graphics.clear()

        this.graphics.fillStyle(0x472d3c)
        this.graphics.fillRoundedRect(9, 9, 34, 34, 8)

        this.graphics.fillStyle(0xf4cca1)
        this.graphics.fillRoundedRect(11, 11, 30, 30, 8)

        this.graphics.fillStyle(0x472d3c)
        this.graphics.fillRoundedRect(48, 9, width+4, 9, 5)
        if(percent > 0)
        {
            this.graphics.fillStyle(0xb6d53c)
            this.graphics.fillRoundedRect(50, 10, width*percent, 7, 5)
        }

        this.graphics.fillStyle(0x472d3c)
        this.graphics.fillRoundedRect(48, 20, width+4, 9, 5)
        if(percent2 > 0)
        {
            this.graphics.fillStyle(0xf4b41b)
            this.graphics.fillRoundedRect(50, 21, width*percent, 7, 5)
        }

        for (let i = 0; i < bullets; i++) {
            this.add.image(54+i*10, 36, 'bullet-icon').setScale(2)
        }


    }
}