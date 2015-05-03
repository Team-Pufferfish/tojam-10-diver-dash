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
        //this.load.tilemap('DiverLevel0', 'assets/tilemaps/DiverLevel0.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('DiverLevel3', 'assets/tilemaps/DiverLevel3.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('DiverLevel4', 'assets/tilemaps/DiverLevel4.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('RockTile', 'assets/images/RockTile.png');
        this.load.spritesheet('Player 1','assets/images/FatDiverShaded.png',24,37);
        this.load.spritesheet('Player 2','assets/images/FatDiverShadedp2.png',24,37);
        this.load.spritesheet('Player 3','assets/images/FatDiverShadedp3.png',24,37);
        this.load.spritesheet('Player 4','assets/images/FatDiverShadedp4.png',24,37);
        this.load.image('seaweed','assets/images/seaweed.png');
        this.load.image('gold','assets/images/gold.png');
        this.load.image('clam','assets/images/clam.png');
        this.load.image('bubble','assets/images/bubble.png');
        this.load.image('callout-speech','assets/images/speechBubble.png');
        this.load.image('tank','assets/images/tank.png');
        this.load.image('heart','assets/images/heart.png');
        this.load.image('ui','assets/images/ui.png');
        this.load.image('p2ui','assets/images/p2ui.png');
        this.load.image('p3ui','assets/images/p3ui.png');
        this.load.image('p4ui','assets/images/p4ui.png');
        this.load.image('xboxA','assets/images/xboxControllerButtonA.png');
        this.load.image('xboxB','assets/images/xboxControllerButtonB.png');
        this.load.image('xboxStick','assets/images/xboxControllerLeftThumbstick.png');
        this.load.image('xboxStart','assets/images/xboxControllerStart.png');
        this.load.image('p1head','assets/images/p1head.png');
        this.load.image('p2head','assets/images/p2head.png');
        this.load.image('p3head','assets/images/p3head.png');
        this.load.image('p4head','assets/images/p4head.png');
        this.load.image('deadUI','assets/images/deadUI.png');

    }

    create() {
        this.game.state.start('MainMenu',true,false,0);
    }
}