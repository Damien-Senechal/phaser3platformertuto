export default class LoadRessources
{
    constructor(scene: Phaser.Scene)
    {
        scene.load.image('Elijah', 'ressources/sprite/elijah.png')
        scene.load.image('smoke', 'ressources/sprite/smoke.png')
        scene.load.image('tiles', 'ressources/tileset/tile_desert3.png')
        scene.load.tilemapTiledJSON('tilemap', 'ressources/json/leveltestgrappin.json')
    }
}