import Phaser from 'phaser'
import { sharedInstance as events } from './EventCenter'

export default class UI extends Phaser.Scene
{
    private graphics!: Phaser.GameObjects.Graphics

    private elijahPortrait
    private weaponText
    private weaponIcon

    private health = 100
    private stamina = 100
    private bullet = 5

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
        this.load.image('blade-icon', 'ressources/sprite/blade_icon.png')
        this.load.image('pistol-icon', 'ressources/sprite/pistol_icon.png')
        this.load.image('hook-icon', 'ressources/sprite/hook_icon.png')
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
        this.setInterface(this.health, this.stamina, this.bullet)
        this.elijahPortrait = this.add.sprite(26, 25, 'Elijah-Portrait').play('idle-portrait')

        events.on('weapon-changed', this.changeWeapon, this)
        events.on('health-changed', this.handleHealthChanged, this)

        /*this.weaponText = this.add.text(540, 10, 'allo', {
            color: '#000000'
        })*/
        this.weaponIcon = this.add.image(600, 20, 'blade-icon')
    }

    update() 
    {
        
    }



    private setInterface(health: number, stamina: number, bullets: number)
    {
        const width = 100
        const percent = Phaser.Math.Clamp(health, 0, 100) / 100
        const percent2 = Phaser.Math.Clamp(stamina, 0, 100) / 100



        this.graphics.clear()

        this.graphics.fillStyle(0x472d3c)
        this.graphics.fillRoundedRect(9, 9, 34, 34, 8)
        
        this.graphics.fillStyle(0x5e3643)
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
            this.graphics.fillRoundedRect(50, 21, width*percent2, 7, 5)
        }

        for (let i = 0; i < bullets; i++) {
            this.add.sprite(54+i*10, 36, 'bullet-icon').setScale(2)
        }

        
    }

    private changeWeapon(value)
    {   
        //this.weaponText.text = `${value}`
        this.weaponIcon.destroy()
        if(value === 'Blade')
        {
            this.weaponIcon = this.add.sprite(580, 20, 'blade-icon').setScale(2)
        }
        else if(value === 'Pistol')
        {
            this.weaponIcon = this.add.sprite(580, 20, 'pistol-icon').setScale(2)
        }
        else if(value === 'Hook')
        {
            this.weaponIcon = this.add.sprite(580, 20, 'hook-icon').setScale(2)
        }
    }

    private handleHealthChanged(value: number)
    {
        this.health = value
        this.setInterface(this.health, this.stamina, this.bullet)
    }
}