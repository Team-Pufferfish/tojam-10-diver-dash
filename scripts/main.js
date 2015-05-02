/**
 * Created by myabko on 15-05-01.
 */
/*create the reference paths for our components. this allows typescript to do intellisense-like code completion. should
* probably be added for each file/class that is referenced below*/
/// <reference path="../bower_components/phaser/typescript/phaser.d.ts"/>
/// <reference path="states/Boot.ts"/>
/// <reference path="states/Preload.ts"/>
/// <reference path="states/Game.ts"/>
/// <reference path="states/Menu.ts"/>
/// <reference path="states/Scores.ts"/>
var main = (function () {
    function main() {
        this.game = new Phaser.Game(1600, 900, Phaser.AUTO, '', null, false, false);
        this.addStates();
    }
    main.prototype.addStates = function () {
        this.game.state.add('Boot', Boot);
        this.game.state.add('Preload', Preload);
        this.game.state.add('Game', Game);
    };
    main.prototype.start = function () {
        this.game.state.start('Boot');
    };
    return main;
})();
var MainGame = new main();
MainGame.start();
//# sourceMappingURL=main.js.map