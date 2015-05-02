/**
 * Created by myabko on 15-05-01.
 */
/*create the reference paths for our components. this allows typescript to do intellisense-like code completion. should
 * probably be added for each file/class that is referenced below*/
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
/// <reference path="../../bower_components/phaser/typescript/phaser.comments.d.ts"/>
/// <reference path="../model/Heart.ts"/>
/// <reference path="../model/OxygenTank.ts"/>
var Player = (function () {
    function Player(x, y, game, gamepad, colour, group) {
        this.MAX_BREATH = 200;
        this.MIN_BREATH = 50;
        this.MAX_SPEED = 100;
        this.ROTATION_SPEED = 140;
        this.ACCELERATION = 100;
        this.DRAG = 45;
        this.TANK_SIZE = 8000;
        this.INITIAL_HEART_RATE = 75;
        this.SHOW_DEBUG = true;
        this.game = game;
        this.gamepad = gamepad;
        this.setupSprite(x, y);
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
    Player.prototype.setupSprite = function (x, y) {
        this.sprite = this.game.add.sprite(x, y, 'player');
        this.sprite.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(this.sprite);
    };
    Player.prototype.setupModel = function () {
        var _this = this;
        this.oxygenTank = new OxygenTank(this.TANK_SIZE);
        var onBreath = function (bpm) {
            var totalBreath = _this.MAX_BREATH - bpm;
            if (totalBreath < _this.MIN_BREATH) {
                totalBreath = _this.MIN_BREATH;
            }
            _this.oxygenTank.use(totalBreath);
        };
        this.heart = new Heart(this.INITIAL_HEART_RATE, onBreath, this.game.time);
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
        this.heart.changeHeartRateTo(this.sprite.body.speed / 4);
    };
    Player.prototype.updateControls = function () {
        if (this.cursors.up.isDown || this.gamepad.isDown(Phaser.Gamepad.XBOX360_A)) {
            this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation - 1.5, this.MAX_SPEED, this.sprite.body.acceleration);
        }
        else {
            this.sprite.body.acceleration.set(0);
        }
        if (this.cursors.left.isDown || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
            if (this.sprite.body.speed <= 100) {
                this.sprite.body.angularVelocity = -this.ROTATION_SPEED;
            }
            else {
                this.sprite.body.angularVelocity = -this.sprite.body.speed * 2;
            }
        }
        else if (this.cursors.right.isDown || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
            if (this.sprite.body.speed <= 100) {
                this.sprite.body.angularVelocity = this.ROTATION_SPEED;
            }
            else {
                this.sprite.body.angularVelocity = this.sprite.body.speed * 2;
            }
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