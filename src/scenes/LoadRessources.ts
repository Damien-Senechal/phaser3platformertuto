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
        scene.load.spritesheet('Elijah', 'ressources/sprite/Elijah_idle-Sheet.png', { frameWidth: 32, frameHeight: 38 });
        scene.load.spritesheet('ElijahGrapple', 'ressources/sprite/Elijah_hook-Sheet.png', { frameWidth: 32, frameHeight: 32 });
        scene.load.spritesheet('ElijahBlade', 'ressources/sprite/Elijah_blade-Sheet.png', { frameWidth: 32, frameHeight: 39 });
        scene.load.spritesheet('ElijahPistol', 'ressources/sprite/Elijah_pistol-Sheet.png', { frameWidth: 32, frameHeight: 38 });
        scene.load.image('Pig', 'ressources/sprite/pig.png')
        scene.load.image('Sensor', 'ressources/sprite/sensor.png')
        scene.load.image('Checkpoint', 'ressources/sprite/checkpoint.png')
        scene.load.image('tumbleweed', 'ressources/sprite/tumbleweed.png')
        scene.load.image('Elijah-trunk', 'ressources/sprite/Elijah_trunk.png')
        scene.load.image('Elijah-trunkflip', 'ressources/sprite/Elijah_trunk_flip.png')
        scene.load.image('Elijah-pistol', 'ressources/sprite/Elijah_pistol.png')
        scene.load.image('bullet', 'ressources/sprite/bullet.png')

    }
}