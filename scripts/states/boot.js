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
var boot = (function (_super) {
    __extends(boot, _super);
    function boot() {
        _super.call(this);
    }
    boot.prototype.preload = function () {
        this.load.image('preloadbar', 'assets/images/preloader-bar.png');
    };
    boot.prototype.create = function () {
        this.game.stage.backgroundColor = '#fff';
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.state.start('Preload');
    };
    return boot;
})(Phaser.State);
//# sourceMappingURL=boot.js.map