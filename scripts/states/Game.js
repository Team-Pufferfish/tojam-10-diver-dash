/**
 * Created by myabko on 15-05-01.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
/// <reference path="../model/Heart.ts"/>
/// <reference path="../elements/Player.ts"/>
/// <reference path="../model/Heart.ts"/>
/// <reference path="../model/OxygenTank.ts"/>
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        _super.call(this);
        this.PLAYER_COUNT = 4;
        this.LIGHT_RADIUS = 120;
        this.WATER_SPEED = 250;
        this.GAME_OVER = false;
        this.level = 0;
        this.playerOrder = [];
        this.lightStyles = [];
    }
    Game.prototype.init = function (gameState) {
        this.gameState = gameState;
        this.level = gameState.level;
        this.PLAYER_COUNT = gameState.playerOrder.length;
        for (var i = 0; i < gameState.playerOrder.length; i++) {
            this.playerOrder.push(gameState.playerOrder[i]);
        }
    };
    Game.prototype.create = function () {
        this.players = [];
        this.lights = [];
        this.GAME_OVER = false;
        this.map = this.game.add.tilemap('DiverLevel' + this.level);
        this.levelStartTime = this.game.time.time;
        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        this.map.addTilesetImage('RockTile', 'RockTile');
        //create layer
        this.mapLayer = this.map.createLayer('Tiles');
        //Hit everything we don't consider walkable
        this.map.setCollisionByExclusion([1, 2, 3, 8, 9, 18, 19, 46, 47, 56], true, "Tiles");
        //Callback for specific tiles hit
        this.map.setTileIndexCallback([8, 9, 18, 19], this.environmentOverlap, this);
        this.mapLayer.resizeWorld();
        this.createDecorations();
        this.createItems();
        //create player
        this.createPlayers();
        this.createCameraman();
        //Add light layer
        this.setupLights();
        //the camera will follow the player in the world
        this.game.camera.follow(this.cameraman);
        this.players.forEach(function (player) {
            player.setupOverlays();
        });
        this.addScreenControls();
        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();
        //Flash Level
        var introText = this.game.add.text(this.game.width / 2, this.game.height / 2, "Level " + this.gameState.level, { font: '72px Arial', fill: '#ffffff' });
        introText.fixedToCamera = true;
        introText.anchor.setTo(0.5, 0.5);
        this.game.add.tween(introText).to({ alpha: 0 }, 3000, Phaser.Easing.Quartic.In, true);
    };
    Game.prototype.addScreenControls = function () {
        var controls = this.game.add.group();
        var swim = this.game.add.group();
        var throwGold = this.game.add.group();
        var move = this.game.add.group();
        controls.add(swim);
        controls.add(throwGold);
        controls.add(move);
        controls.x = 10;
        controls.y = 80;
        controls.alpha = 0.7;
        var swimButton = this.game.add.sprite(0, 0, 'xboxA');
        swimButton.scale = { x: 0.5, y: 0.5 };
        var swimButtonText = this.game.add.text(50, 5, 'To swim');
        swimButtonText.fill = '#000';
        swimButtonText.stroke = '#fff';
        swimButtonText.strokeThickness = 3;
        swimButton.fixedToCamera = true;
        swimButtonText.fixedToCamera = true;
        swim.x = 0;
        swim.y = 0;
        swim.add(swimButton);
        swim.add(swimButtonText);
        var throwGoldButton = this.game.add.sprite(0, 0, 'xboxB');
        throwGoldButton.scale = { x: 0.5, y: 0.5 };
        var throwGoldButtonText = this.game.add.text(50, 5, 'To throw gold');
        throwGoldButtonText.fill = '#000';
        throwGoldButtonText.stroke = '#fff';
        throwGoldButtonText.strokeThickness = 3;
        throwGoldButton.fixedToCamera = true;
        throwGoldButtonText.fixedToCamera = true;
        throwGold.x = 0;
        throwGold.y = 60;
        throwGold.add(throwGoldButton);
        throwGold.add(throwGoldButtonText);
        var moveButton = this.game.add.sprite(0, 0, 'xboxStick');
        moveButton.scale = { x: 0.3, y: 0.3 };
        var moveButtonText = this.game.add.text(50, 5, 'To move');
        moveButtonText.fill = '#000';
        moveButtonText.stroke = '#fff';
        moveButtonText.strokeThickness = 3;
        moveButton.fixedToCamera = true;
        moveButtonText.fixedToCamera = true;
        move.x = 0;
        move.y = 120;
        move.add(moveButton);
        move.add(moveButtonText);
    };
    Game.prototype.createPlayers = function () {
        var result = this.findObjectsByType('playerStart', this.map, 'Objects');
        for (var i = 0; i < this.PLAYER_COUNT; i++) {
            var player = new Player(result[i].x, result[i].y, this.game, this, this.playerOrder[i], "Player " + (i + 1));
            player.itemsPointer = this.items;
            player.lightStyle = 0;
            this.lights.push(player.sprite);
            this.players.push(player);
        }
        for (var i = 0; i < this.PLAYER_COUNT; i++) {
            this.players[i].otherPlayers = this.findOtherPlayers(i);
        }
    };
    Game.prototype.findOtherPlayers = function (playerID) {
        var players = [];
        for (var j = 0; j < this.PLAYER_COUNT; j++) {
            if (j != playerID) {
                players.push(this.players[j]);
            }
        }
        return players;
    };
    Game.prototype.createCameraman = function () {
        this.cameraman = this.game.add.sprite(this.game.width / 2, this.game.height / 2);
    };
    Game.prototype.setupLights = function () {
        // Create the shadow texture
        this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
        // Draw shadow
        // Create an object that will use the bitmap as a texture
        this.lightSprite = this.game.add.image(0, 0, this.shadowTexture);
        // Set the blend mode to MULTIPLY. This will darken the colors of
        // everything below this sprite.
        this.lightSprite.blendMode = PIXI.blendModes.MULTIPLY;
        var playerLight;
        playerLight = { radius: this.LIGHT_RADIUS, color: "#FFFFFF" };
        this.lightStyles.push(playerLight);
        var goldLight;
        goldLight = { radius: 15, color: "#FFE135" }; //banana
        this.lightStyles.push(goldLight);
    };
    Game.prototype.update = function () {
        //collision
        this.game.physics.arcade.overlap(this.items, this.mapLayer);
        for (var i = 0; i < this.PLAYER_COUNT; i++) {
            this.checkPlayerObjectCollisions(i);
            this.players[i].update();
        }
        this.updateCameraman();
        this.updateLights();
        var deadCount = 0;
        var winCount = 0;
        this.players.forEach(function (player) {
            player.updateCallout();
            if (player.mortality.isDead)
                deadCount++;
        });
        //gameoverconditions
        if (deadCount + winCount >= this.PLAYER_COUNT && !this.GAME_OVER) {
            this.GAME_OVER = true;
            this.players.forEach(function (player) {
                this.gameState.playerDeaths.push(player.mortality);
            }, this);
            this.game.time.events.add(2000, this.gameOver, this);
        }
    };
    Game.prototype.checkPlayerObjectCollisions = function (i) {
        if (!this.players[i].mortality.isDead) {
            this.game.physics.arcade.collide(this.players[i].sprite, this.mapLayer, this.environmentCollision, null, this);
            this.game.physics.arcade.overlap(this.players[i].sprite, this.mapLayer, this.environmentOverlap, null, this);
            this.game.physics.arcade.overlap(this.players[i].sprite, this.items, this.collect, null, this);
            this.game.physics.arcade.overlap(this.players[i].bubbleEmmiter, this.mapLayer, this.environmentOverlap, null, this);
            this.game.physics.arcade.overlap(this.players[i].bubbleEmmiter, this.mapLayer);
        }
    };
    Game.prototype.gameOver = function () {
        this.game.state.start('Scores', true, false, this.gameState);
    };
    Game.prototype.createItems = function () {
        //create items
        this.items = this.game.add.group();
        this.items.enableBody = true;
        var result = this.findObjectsByType('item', this.map, 'Objects');
        result.forEach(function (element) {
            this.createFromTiledObject(element, this.items);
        }, this);
        this.items.forEach(function (item) {
            item.anchor.setTo(0.5, 0.5);
            item.body.setSize(10, 10);
            item.lightStyle = 1;
            this.lights.push(item);
        }, this);
    };
    Game.prototype.createDecorations = function () {
        //create items
        this.decorations = this.game.add.group();
        this.decorations.enableBody = true;
        var result = this.findObjectsByType('decoration', this.map, 'Objects');
        result.forEach(function (element) {
            this.createFromTiledObject(element, this.decorations);
        }, this);
        this.decorations.forEach(function (decor) {
            if (decor.lit != null) {
                decor.anchor.setTo(0.5, 0.5);
                decor.lightStyle = decor.lit;
                this.lights.push(decor);
            }
        }, this);
    };
    //find objects in a Tiled layer that containt a property called "type" equal to a certain value
    Game.prototype.findObjectsByType = function (type, map, layer) {
        var result = [];
        this.map.objects[layer].forEach(function (element) {
            if (element.properties.type === type) {
                //Phaser uses top left, Tiled bottom left so we have to adjust
                //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
                //so they might not be placed in the exact position as in Tiled
                element.y -= map.tileHeight / 2;
                element.x += map.tileHeight / 2;
                result.push(element);
            }
        });
        return result;
    };
    Game.prototype.createFromTiledObject = function (element, group) {
        var sprite = group.create(element.x, element.y, element.properties.sprite);
        //copy all properties to the sprite
        Object.keys(element.properties).forEach(function (key) {
            sprite[key] = element.properties[key];
        });
    };
    Game.prototype.collect = function (player, collectable) {
        //remove sprite
        collectable.destroy();
        player.player.changeGold(1);
        player.player.callout("itemPickup");
    };
    Game.prototype.environmentCollision = function (player, tile) {
        if (tile.index == 26) {
            player.player.callout("pain");
            player.player.makeDead("Deadly Spikes!", false);
        }
        else if (tile.index == 36 || tile.index == 37) {
            player.player.callout("escape");
            player.player.makeDead("Escaped!", true);
        }
    };
    Game.prototype.environmentOverlap = function (player, tile) {
        var nervousness = { callout: "shocked", calloutIntensity: 2 /* speech */, startTime: this.game.time.now, multiplier: 1.3, timeout: 1000, name: 'flow' };
        switch (tile.index) {
            case 8:
                player.body.velocity.y = -this.WATER_SPEED;
                if (player.player)
                    player.player.addNervousness(nervousness);
                break;
            case 9:
                player.body.velocity.y = this.WATER_SPEED;
                if (player.player)
                    player.player.addNervousness(nervousness);
                break;
            case 18:
                player.body.velocity.x = -this.WATER_SPEED;
                if (player.player)
                    player.player.addNervousness(nervousness);
                break;
            case 19:
                player.body.velocity.x = this.WATER_SPEED;
                if (player.player)
                    player.player.addNervousness(nervousness);
                break;
        }
    };
    Game.prototype.updateLights = function () {
        // This function updates the shadow texture (this.shadowTexture).
        // First, it fills the entire texture with a dark shadow color.
        // Then it draws a white circle centered on the pointer position.
        // Because the texture is drawn to the screen using the MULTIPLY
        // blend mode, the dark areas of the texture make all of the colors
        // underneath it darker, while the white area is unaffected.
        //move lightspirte
        // Draw shadow
        this.shadowTexture.context.fillStyle = 'rgb(0, 0, 0)';
        this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);
        var lightStyleDefault = 0;
        // Iterate through each of the lights and draw the glow
        this.lights.forEach(function (light) {
            if (light.player && light.player.mortality.isDead)
                return;
            if (!light.alive)
                return;
            // Randomly change the radius each frame
            if (light.lightStyle)
                var lightSourceType = this.lightStyles[light.lightStyle];
            else
                var lightSourceType = this.lightStyles[lightStyleDefault];
            var radius = lightSourceType.radius + this.game.rnd.integerInRange(1, 0.08 * lightSourceType.radius);
            var screenX = light.x - this.lightSprite.x;
            var screenY = light.y - this.lightSprite.y;
            // Draw circle of light with a soft edge
            var gradient = this.shadowTexture.context.createRadialGradient(screenX, screenY, lightSourceType.radius * 0.25, screenX, screenY, radius);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
            this.shadowTexture.context.beginPath();
            this.shadowTexture.context.fillStyle = gradient;
            this.shadowTexture.context.arc(screenX, screenY, radius, 0, Math.PI * 2);
            this.shadowTexture.context.fill();
        }, this);
        this.lightSprite.x = this.camera.x;
        this.lightSprite.y = this.camera.y;
        // This just tells the engine it should update the texture cache
        this.shadowTexture.dirty = true;
    };
    Game.prototype.updateCameraman = function () {
        //THis function finds an appoorimate center between the players and
        //moves the invisible spirite camerman to it's location. This should
        // provide a camera that roughly follows the group.
        var minY = -1;
        var maxY = -1;
        var minX = -1;
        var maxX = -1;
        this.players.forEach(function (player) {
            if (!player.mortality.isDead) {
                if (player.sprite.x <= minX || minX == -1)
                    minX = player.sprite.x;
                if (player.sprite.y <= minY || minY == -1)
                    minY = player.sprite.y;
                if (player.sprite.x >= maxX || maxX == -1)
                    maxX = player.sprite.x;
                if (player.sprite.y >= maxY || maxY == -1)
                    maxY = player.sprite.y;
            }
        }, this);
        var camX = (minX + maxX) / 2;
        var camY = (minY + maxY) / 2;
        this.cameraman.x = camX;
        this.cameraman.y = camY;
    };
    return Game;
})(Phaser.State);
//# sourceMappingURL=Game.js.map