/**
 * Created by myabko on 15-05-01.
 */
/*create the reference paths for our components. this allows typescript to do intellisense-like code completion. should
 * probably be added for each file/class that is referenced below*/
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
/// <reference path="../model/Heart.ts"/>
/// <reference path="../model/OxygenTank.ts"/>
var Player = (function () {
    function Player(x, y, game, gamepad, colour, group) {
        this.MAX_BREATH = 200;
        this.MIN_BREATH = 50;
        this.MAX_SPEED = 200;
        this.ROTATION_SPEED = 350;
        this.ACCELERATION = 100;
        this.DRAG = 150;
        this.SHOW_DEBUG = false;
        this.changed = false;
        this.game = game;
        this.sprite = this.game.add.sprite(x, y, 'player');
        this.sprite.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(this.sprite);
        this.gamepad = gamepad;
        this.setupModel();
        this.setupDebug();
        this.setupControls();
    }
    Player.prototype.setupDebug = function () {
        if (this.SHOW_DEBUG) {
            this.initialTime = this.game.time.time;
            this.oxyText = this.game.add.text(0, 0, 'oxy:', {});
            this.oxyText.fill = '#000';
            this.oxyText.stroke = '#fff';
            this.oxyText.strokeThickness = 2;
            this.oxyText.fontSize = 20;
        }
    };
    Player.prototype.setupModel = function () {
        var _this = this;
        this.oxygenTank = new OxygenTank(60000);
        var onBreath = function (bpm) {
            var totalBreath = _this.MAX_BREATH - bpm;
            if (totalBreath < _this.MIN_BREATH) {
                totalBreath = _this.MIN_BREATH;
            }
            _this.oxygenTank.use(totalBreath);
        };
        this.heart = new Heart(80, onBreath, this.game.time);
    };
    Player.prototype.setColour = function (colour) {
        this.colour = colour; //eventually we should set the sprite colour here in a subroutine
    };
    Player.prototype.setInitialOxygenLevel = function (initialLevel) {
        this.oxygenTank = new OxygenTank(initialLevel);
    };
    Player.prototype.update = function () {
        this.heart.update();
        this.oxygenTank.update();
        this.updateControls();
        if (this.SHOW_DEBUG) {
            this.oxyText.x = this.sprite.x;
            this.oxyText.y = this.sprite.y;
            this.oxyText.text = 'oxy:' + this.oxygenTank.level;
        }
        if (this.game.time.elapsedSecondsSince(this.initialTime) >= 10 && this.changed === false) {
            this.heart.changeHeartRateTo(240);
            this.changed = true;
        }
    };
    Player.prototype.updateControls = function () {
        if (this.cursors.up.isDown || this.gamepad.isDown(Phaser.Gamepad.XBOX360_A)) {
            this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation - 1.5, this.MAX_SPEED, this.sprite.body.acceleration);
        }
        else {
            this.sprite.body.acceleration.set(0);
        }
        if (this.cursors.left.isDown || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
            this.sprite.body.angularVelocity = -this.ROTATION_SPEED;
        }
        else if (this.cursors.right.isDown || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
            this.sprite.body.angularVelocity = this.ROTATION_SPEED;
        }
        else {
            this.sprite.body.angularVelocity = 0;
        }
    };
    Player.prototype.setupControls = function () {
        // Define motion constants
        // Set maximum velocity
        this.sprite.body.maxVelocity.setTo(this.MAX_SPEED); // x, y
        this.sprite.body.drag.setTo(this.DRAG);
        // Capture certain keys to prevent their default actions in the browser.
        // This is only necessary because this is an HTML5 game. Games on other
        // platforms may not need code like this.
        //  Game input
        this.cursors = this.game.input.keyboard.createCursorKeys();
    };
    return Player;
})();
//# sourceMappingURL=Player.js.map