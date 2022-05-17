import Phaser from 'phaser'
import { sharedInstance as events } from './EventCenter'

export default class UI extends Phaser.Scene
{
    private coinLabel!: Phaser.GameObjects.Text
    private coinCollected = 0
    private graphics!: Phaser.GameObjects.Graphics

    private lastHealth = 100

    constructor()
    {
        super({
            key: 'ui'
        })
    }

    init()
    {
        this.coinCollected = 0
    }

    create()
    {
        this.graphics = this.add.graphics()
        this.setHealthBar(100)

        this.coinLabel = this.add.text(10, 35, 'Coins: 0', {
            fontSize: '32px',
        })

        events.on('coin-collected', this.handleCoinCollected, this)
        events.on('health-changed', this.handleHealthChanged, this)

        this.events.once(Phaser.Scenes.Events.DESTROY, () => {
            events.off('coin-collected', this.handleCoinCollected, this)
        })
    }

    private setHealthBar(value: number)
    {
        const width = 200
        const percent = Phaser.Math.Clamp(value, 0, 100) / 100

        this.graphics.clear
        this.graphics.fillStyle(0x808080)
        this.graphics.fillRoundedRect(10, 10, width, 20, 5)
        if(percent > 0)
        {
            this.graphics.fillStyle(0x00ff00)
            this.graphics.fillRoundedRect(10, 10, width*percent, 20, 5)
        }
    }

    private handleHealthChanged(value: number)
    {
        /*this.tweens.addCounter({
            from: this.lastHealth,
            to: value,
            duration: 200,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: tween => {
                const value = tween.getValue()
                this.setHealthBar(value)
            }
        })*/
        this.setHealthBar(value)
        this.lastHealth = value
    }

    private handleCoinCollected()
    {
        ++this.coinCollected
        this.coinLabel.text = `Coins: ${this.coinCollected}`
    }
}