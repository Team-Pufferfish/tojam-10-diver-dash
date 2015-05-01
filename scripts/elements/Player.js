/**
 * Created by myabko on 15-05-01.
 */
/*create the reference paths for our components. this allows typescript to do intellisense-like code completion. should
 * probably be added for each file/class that is referenced below*/
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
/// <reference path="../model/Heart.ts"/>
/// <reference path="../model/OxygenTank.ts"/>
var Player = (function () {
    function Player(x, y, game, colour, group) {
        this.MAX_BREATH = 150;
        this.game = game;
        this.sprite = this.game.add.sprite(x, y, 'player');
        this.game.physics.arcade.enable(this.sprite);
        this.oxygenTank = new OxygenTank(100);
        this.heart = new Heart(80, this.breath, this.game.time);
    }
    Player.prototype.setColour = function (colour) {
        this.colour = colour; //eventually we should set the sprite colour here in a subroutine
    };
    Player.prototype.setInitialOxygenLevel = function (initialLevel) {
        this.oxygenTank = new OxygenTank(initialLevel);
    };
    Player.prototype.update = function () {
        this.heart.update();
        this.oxygenTank.update();
    };
    Player.prototype.breath = function (bpm) {
        this.oxygenTank.use(this.MAX_BREATH - bpm);
    };
    return Player;
})();
//# sourceMappingURL=Player.js.map