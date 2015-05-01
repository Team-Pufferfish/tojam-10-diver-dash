/**
 * Created by myabko on 15-05-01.
 */
/*create the reference paths for our components. this allows typescript to do intellisense-like code completion. should
* probably be added for each file/class that is referenced below*/
/// <reference path="../bower_components/phaser/typescript/phaser.d.ts"/>
/// <reference path="../scripts/states/boot.ts"/>
var game = (function () {
    function game() {
        this.game = new Phaser.Game(160, 160, Phaser.AUTO, '');
        this.game.state.add('Boot', boot);
    }
    return game;
})();
//# sourceMappingURL=main.js.map