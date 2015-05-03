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
        this.load.tilemap('DiverLevel1', 'assets/tilemaps/DiverLevel1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('DiverLevel2', 'assets/tilemaps/DiverLevel2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('DiverLevel0', 'assets/tilemaps/DiverLevel0.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('RockTile', 'assets/images/RockTile.png');
        this.load.spritesheet('player','assets/images/FatDiverShaded.png',24,37);
        this.load.image('seaweed','assets/images/seaweed.png');
        this.load.image('gold','assets/images/gold.png');
        this.load.image('clam','assets/images/clam.png');
        this.load.image('bubble','assets/images/bubble.png');
        this.load.image('callout-speech','assets/images/speechBubble.png');
        this.load.image('tank','assets/images/tank.png');
        this.load.image('heart','assets/images/heart.png');
        this.load.image('ui','assets/images/ui.png');

    }

    create() {
        this.game.state.start('MainMenu',true,false,0);
    }
}