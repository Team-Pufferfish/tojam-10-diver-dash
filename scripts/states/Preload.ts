/**
 * Created by myabko on 15-05-01.
 */

/*create the reference paths for our components. this allows typescript to do intellisense-like code completion. should
 * probably be added for each file/class that is referenced below*/
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>

class Preload extends Phaser.State {

    preloadBar:Phaser.Sprite;

    constructor() {
        super();
    }

    preload() {
        this.createLoadingBar();
        this.loadGameAssets();
    }

    private createLoadingBar() {
        //show loading screen
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.preloadBar);
    }

    private loadGameAssets() {
        //load game assets
        this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('gameTiles', 'assets/images/tiles.png');
        this.load.image('greencup', 'assets/images/greencup.png');
        this.load.image('bluecup', 'assets/images/bluecup.png');
        this.load.image('player', 'assets/images/player.png');
        this.load.image('browndoor', 'assets/images/browndoor.png');
    }

    create() {
        this.game.state.start('Game');
    }
}