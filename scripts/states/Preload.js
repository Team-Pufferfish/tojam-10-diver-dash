/**
 * Created by myabko on 15-05-01.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/*create the reference paths for our components. this allows typescript to do intellisense-like code completion. should
 * probably be added for each file/class that is referenced below*/
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
var Preload = (function (_super) {
    __extends(Preload, _super);
    function Preload() {
        _super.call(this);
    }
    Preload.prototype.preload = function () {
        this.createLoadingBar();
        this.loadGameAssets();
    };
    Preload.prototype.createLoadingBar = function () {
        //show loading screen
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.preloadBar);
    };
    Preload.prototype.loadGameAssets = function () {
        //load game assets
        this.load.tilemap('DiverLevel1', 'assets/tilemaps/DiverLevel1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('RockTile', 'assets/images/RockTile.png');
        this.load.image('player', 'assets/images/FatDiver1.png');
        this.load.image('seaweed', 'assets/images/seaweed.png');
        this.load.image('gold', 'assets/images/gold.png');
    };
    Preload.prototype.create = function () {
        this.game.state.start('Game');
    };
    return Preload;
})(Phaser.State);
//# sourceMappingURL=Preload.js.map