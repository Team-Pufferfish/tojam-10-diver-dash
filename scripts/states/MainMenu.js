var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
var MainMenu = (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu() {
        _super.call(this);
    }
    MainMenu.prototype.create = function () {
        this.playerOrder = [];
        var aButtonGroup = this.game.add.group();
        var aButton = this.game.add.sprite(0, 0, 'xboxA');
        aButton.scale = { x: 0.5, y: 0.5 };
        var aButtonText = this.game.add.text(50, 5, 'To Join');
        aButtonText.fill = '#000';
        aButtonText.stroke = '#fff';
        aButtonText.strokeThickness = 3;
        aButtonGroup.x = 50;
        aButtonGroup.y = 50;
        aButtonGroup.add(aButton);
        aButtonGroup.add(aButtonText);
        var startButtonGroup = this.game.add.group();
        var startButton = this.game.add.sprite(0, 0, 'xboxStart');
        startButton.scale = { x: 0.5, y: 0.5 };
        var startButtonText = this.game.add.text(50, 5, 'To Start');
        startButtonText.fill = '#000';
        startButtonText.stroke = '#fff';
        startButtonText.strokeThickness = 3;
        startButtonGroup.x = 50;
        startButtonGroup.y = 100;
        startButtonGroup.add(startButton);
        startButtonGroup.add(startButtonText);
        var text = this.game.add.text(0, 0, 'Treasure Divers....Escape!?');
        text.fontSize = 50;
        text.x = (this.game.width / 2) - (text.width / 2);
        text.y = this.game.height / 2;
        this.game.input.gamepad.start();
    };
    MainMenu.prototype.startGame = function () {
        this.gameState = { playerOrder: this.playerOrder, playerDeaths: [], level: 1, teamScore: 0 };
        this.game.state.start('Game', true, false, this.gameState);
    };
    MainMenu.prototype.addPlayerToScreen = function () {
        if (this.playerOrder.length === 1) {
            var p1group = this.game.add.group();
            var p1art = this.game.add.sprite(0, 0, 'p1head');
            p1art.scale.add(3, 3);
            p1group.add((p1art));
            var p1text = this.game.add.text(0, 160, 'Player 1 has Joined!');
            p1text.fontSize = 24;
            p1text.fill = '#000';
            p1text.stroke = '#fff';
            p1text.strokeThickness = 3;
            p1group.add(p1text);
            p1group.x = 100;
            p1group.y = 600;
        }
        if (this.playerOrder.length === 2) {
            var p1group = this.game.add.group();
            var p1art = this.game.add.sprite(0, 0, 'p2head');
            p1art.scale.add(3, 3);
            p1group.add((p1art));
            var p1text = this.game.add.text(0, 160, 'Player 2 has Joined!');
            p1text.fontSize = 24;
            p1text.fill = '#000';
            p1text.stroke = '#fff';
            p1text.strokeThickness = 3;
            p1group.add(p1text);
            p1group.x = 400;
            p1group.y = 600;
        }
        if (this.playerOrder.length === 3) {
            var p1group = this.game.add.group();
            var p1art = this.game.add.sprite(0, 0, 'p3head');
            p1art.scale.add(3, 3);
            p1group.add((p1art));
            var p1text = this.game.add.text(0, 160, 'Player 3 has Joined!');
            p1text.fontSize = 24;
            p1text.fill = '#000';
            p1text.stroke = '#fff';
            p1text.strokeThickness = 3;
            p1group.add(p1text);
            p1group.x = 700;
            p1group.y = 600;
        }
        if (this.playerOrder.length === 4) {
            var p1group = this.game.add.group();
            var p1art = this.game.add.sprite(0, 0, 'p4head');
            p1art.scale.add(3, 3);
            p1group.add((p1art));
            var p1text = this.game.add.text(0, 160, 'Player 4 has Joined!');
            p1text.fontSize = 24;
            p1text.fill = '#000';
            p1text.stroke = '#fff';
            p1text.strokeThickness = 3;
            p1group.add(p1text);
            p1group.x = 1100;
            p1group.y = 600;
        }
    };
    MainMenu.prototype.update = function () {
        if (this.playerOrder && this.playerOrder.indexOf(this.game.input.gamepad.pad1) == -1 && this.game.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_A)) {
            console.log("pad1");
            this.playerOrder.push(this.game.input.gamepad.pad1);
            this.addPlayerToScreen();
        }
        if (this.playerOrder && this.playerOrder.indexOf(this.game.input.gamepad.pad2) == -1 && this.game.input.gamepad.pad2.isDown(Phaser.Gamepad.XBOX360_A)) {
            console.log("pad2");
            this.playerOrder.push(this.game.input.gamepad.pad2);
            this.addPlayerToScreen();
        }
        if (this.playerOrder && this.playerOrder.indexOf(this.game.input.gamepad.pad3) == -1 && this.game.input.gamepad.pad3.isDown(Phaser.Gamepad.XBOX360_A)) {
            console.log("pad3");
            this.playerOrder.push(this.game.input.gamepad.pad3);
            this.addPlayerToScreen();
        }
        if (this.playerOrder && this.playerOrder.indexOf(this.game.input.gamepad.pad4) == -1 && this.game.input.gamepad.pad4.isDown(Phaser.Gamepad.XBOX360_A)) {
            console.log("pad4");
            this.playerOrder.push(this.game.input.gamepad.pad4);
            this.addPlayerToScreen();
        }
        if (this.game.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_START) || this.game.input.gamepad.pad2.isDown(Phaser.Gamepad.XBOX360_START) || this.game.input.gamepad.pad3.isDown(Phaser.Gamepad.XBOX360_START) || this.game.input.gamepad.pad4.isDown(Phaser.Gamepad.XBOX360_START)) {
            this.startGame();
        }
    };
    return MainMenu;
})(Phaser.State);
//# sourceMappingURL=MainMenu.js.map