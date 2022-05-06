import Phaser from 'phaser'
import { sharedInstance as events } from './EventCenter'

export default class UI extends Phaser.Scene
{
    private coinLabel!: Phaser.GameObjects.Text
    private coinCollected = 0

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
        this.coinLabel = this.add.text(10, 10, 'Coins: 0', {
            fontSize: '32px',
        })

        events.on('coin-collected', this.handleCoinCollected, this)
    }

    private handleCoinCollected()
    {
        ++this.coinCollected
        this.coinLabel.text = `Coins: ${this.coinCollected}`
    }
}