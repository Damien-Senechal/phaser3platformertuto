export default class LoadRessources
{
    constructor(scene: Phaser.Scene)
    {
        //scene.load.image('Elijah', 'ressources/sprite/elijah.png')
        scene.load.image('smoke', 'ressources/sprite/smoke.png')
        scene.load.image('tiles', 'ressources/tileset/tile_desert3.png')
        scene.load.image('tiles2', 'ressources/tileset/Town_Tileset.png')
        scene.load.image('tiles3', 'ressources/sprite/bg-tileset.png')
        scene.load.tilemapTiledJSON('tilemap', 'ressources/json/part1.json')
        scene.load.tilemapTiledJSON('tilemap2', 'ressources/json/part3.json')
        scene.load.tilemapTiledJSON('tilemap3', 'ressources/json/part2.json')
        scene.load.spritesheet('Elijah', 'ressources/sprite/Elijah_idle-Sheet.png', { frameWidth: 32, frameHeight: 38 });
        scene.load.spritesheet('Pig', 'ressources/sprite/pig_idle-Sheet.png', { frameWidth: 32, frameHeight: 32 });
        scene.load.spritesheet('ElijahGrapple', 'ressources/sprite/Elijah_hook-Sheet.png', { frameWidth: 32, frameHeight: 32 });
        scene.load.spritesheet('ElijahBlade', 'ressources/sprite/Elijah_blade-Sheet.png', { frameWidth: 32, frameHeight: 39 });
        scene.load.spritesheet('ElijahPistol', 'ressources/sprite/Elijah_pistol-Sheet.png', { frameWidth: 32, frameHeight: 38 });
        //scene.load.image('Pig', 'ressources/sprite/pig.png')
        scene.load.image('Sensor', 'ressources/sprite/sensor.png')
        scene.load.image('Checkpoint', 'ressources/sprite/checkpoint.png')
        scene.load.image('tumbleweed', 'ressources/sprite/tumbleweed.png')
        scene.load.image('Elijah-trunk', 'ressources/sprite/Elijah_trunk.png')
        scene.load.image('Elijah-trunkflip', 'ressources/sprite/Elijah_trunk_flip.png')
        scene.load.image('Elijah-pistol', 'ressources/sprite/Elijah_pistol.png')
        scene.load.image('bullet', 'ressources/sprite/bullet.png')
        scene.load.image('shell', 'ressources/sprite/shell.png')
        scene.load.image('ammo', 'ressources/sprite/ammo.png')
        scene.load.image('medkit', 'ressources/sprite/medkit.png')
        scene.load.image('spark', 'ressources/sprite/spark.png')
        //scene.load.spritesheet('blood', 'ressources/sprite/blood.png', { frameWidth: 6, frameHeight: 2 });
        scene.load.image('blood', 'ressources/sprite/blood.png')
        scene.load.image('paralax1', 'ressources/sprite/paralax1.png')
        scene.load.image('paralax2', 'ressources/sprite/paralax2.png')
        scene.load.image('paralax3', 'ressources/sprite/paralax3.png')
        scene.load.image('paralax4', 'ressources/sprite/paralax4.png')
        scene.load.image('paralax5', 'ressources/sprite/paralax5.png')
        


        scene.load.audio('jump', 'ressources/audio/Jump.wav')
        scene.load.audio('pistol', 'ressources/audio/Pistol.wav')
        scene.load.audio('tongue_enter', 'ressources/audio/tongue_enter.wav')
        scene.load.audio('tongue_touch', 'ressources/audio/tongue_touch.wav')
        scene.load.audio('tongue_exit', 'ressources/audio/tongue_exit.wav')
        scene.load.audio('ElijahDie', 'ressources/audio/ElijahDie.wav')
        scene.load.audio('Run', 'ressources/audio/Run.wav')
        scene.load.audio('Pickup', 'ressources/audio/Pickup.wav')
        scene.load.audio('PigIdle', 'ressources/audio/pig.wav')
        scene.load.audio('PigDie', 'ressources/audio/PigDie.wav')
        scene.load.audio('grunt', 'ressources/audio/grunt.wav')
        scene.load.audio('sword', 'ressources/audio/sword.mp3')
        scene.load.audio('weapon', 'ressources/audio/weapon.wav')

        scene.load.audio('music1', 'ressources/music/music1.mp3')
        scene.load.audio('music2', 'ressources/music/music2.mp3')
        scene.load.audio('music3', 'ressources/music/music3.wav')

    }
}