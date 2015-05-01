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
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        _super.call(this);
    }
    Game.prototype.create = function () {
        this.map = this.game.add.tilemap('DiverLevel1');
        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        this.map.addTilesetImage('RockTile', 'RockTile');
        //create layer
        this.mapLayer = this.map.createLayer('Tiles');
        this.map.setCollisionByExclusion([1, 2, 3, 46, 47, 56], true, "Tiles");
        this.mapLayer.resizeWorld();
        this.createItems();
        this.createDecorations();
        this.createDoors();
        //create player
        var result = this.findObjectsByType('playerStart', this.map, 'Objects');
        this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
        this.game.physics.arcade.enable(this.player);
        this.player.body.setSize(21, 28);
        this.player.anchor.setTo(0.5, 0.5);
        this.player.angle = 0;
        ;
        //the camera will follow the player in the world
        this.game.camera.follow(this.player);
        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();
        //Set up lights
        this.LIGHT_RADIUS = 120;
        // Create the shadow texture
        this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
        // Draw shadow
        // Create an object that will use the bitmap as a texture
        this.lightSprite = this.game.add.image(0, 0, this.shadowTexture);
        // Set the blend mode to MULTIPLY. This will darken the colors of
        // everything below this sprite.
        this.lightSprite.blendMode = PIXI.blendModes.MULTIPLY;
        this.lights = this.game.add.group();
        this.lights.add(this.player);
    };
    Game.prototype.update = function () {
        //collision
        this.game.physics.arcade.collide(this.player, this.mapLayer, this.environmentCollision, null, this);
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
        this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);
        //player movement
        this.player.body.velocity.y = 0;
        this.player.body.velocity.x = 0;
        if (this.cursors.up.isDown) {
            this.player.body.velocity.y -= 150;
        }
        else if (this.cursors.down.isDown) {
            this.player.body.velocity.y += 150;
        }
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x -= 150;
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x += 150;
        }
        this.updateLights();
    };
    Game.prototype.createItems = function () {
        //create items
        this.items = this.game.add.group();
        this.items.enableBody = true;
        var result = this.findObjectsByType('item', this.map, 'Objects');
        result.forEach(function (element) {
            this.createFromTiledObject(element, this.items);
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
    };
    Game.prototype.createDoors = function () {
        //create doors
        this.doors = this.game.add.group();
        this.doors.enableBody = true;
        var result = this.findObjectsByType('door', this.map, 'Objects');
        result.forEach(function (element) {
            this.createFromTiledObject(element, this.doors);
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
                element.y -= map.tileHeight;
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
        console.log('yummy!');
        //remove sprite
        collectable.destroy();
    };
    Game.prototype.enterDoor = function (player, door) {
        console.log('entering door that will take you to ' + door.targetTilemap + ' on x:' + door.targetX + ' and y:' + door.targetY);
    };
    Game.prototype.environmentCollision = function (player, tile) {
        if (tile.index == 26) {
            console.log("Ouch!");
        }
        else if (tile.index == 36 || tile.index == 37) {
            console.log("Escaped!!!");
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
        // Iterate through each of the lights and draw the glow
        this.lights.forEach(function (light) {
            // Randomly change the radius each frame
            var radius = this.LIGHT_RADIUS + this.game.rnd.integerInRange(1, 10);
            var screenX = light.x - this.lightSprite.x;
            var screenY = light.y - this.lightSprite.y;
            // Draw circle of light with a soft edge
            var gradient = this.shadowTexture.context.createRadialGradient(screenX, screenY, this.LIGHT_RADIUS * 0.25, screenX, screenY, radius);
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
    return Game;
})(Phaser.State);
//# sourceMappingURL=Game.js.map