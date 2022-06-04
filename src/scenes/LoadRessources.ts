export default class LoadRessources
{
    constructor(scene: Phaser.Scene)
    {
        //scene.load.image('Elijah', 'ressources/sprite/elijah.png')
        scene.load.image('smoke', 'ressources/sprite/smoke.png')
        scene.load.image('tiles', 'ressources/tileset/tile_desert3.png')
        scene.load.image('tiles2', 'ressources/tileset/Town_Tileset.png')
        scene.load.tilemapTiledJSON('tilemap', 'ressources/json/part1.json')
        scene.load.tilemapTiledJSON('tilemap2', 'ressources/json/part3.json')
        scene.load.spritesheet('Elijah', 'ressources/sprite/Elijah_idle-Sheet.png', { frameWidth: 32, frameHeight: 32 });
        scene.load.image('Pig', 'ressources/sprite/pig.png')
        scene.load.image('Sensor', 'ressources/sprite/sensor.png')
        scene.load.image('Checkpoint', 'ressources/sprite/checkpoint.png')
        scene.load.image('tumbleweed', 'ressources/sprite/tumbleweed.png')

    }
}