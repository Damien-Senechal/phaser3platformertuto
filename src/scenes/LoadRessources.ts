export default class LoadRessources
{
    constructor(scene: Phaser.Scene)
    {
        scene.load.image('Elijah', 'ressources/sprite/elijah.png')
        scene.load.image('tiles', 'ressources/tileset/desert_tile3.png')
        scene.load.tilemapTiledJSON('tilemap', 'ressources/json/leveltestgrappin.json')
    }
}