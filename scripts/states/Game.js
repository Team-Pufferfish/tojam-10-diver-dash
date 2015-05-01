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
/// <reference path="../model/Heart.ts"/>
/// <reference path="../elements/Player.ts"/>
/// <reference path="../model/Heart.ts"/>
/// <reference path="../model/OxygenTank.ts"/>
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
        this.map.setCollisionByExclusion([1, 2, 3, 46, 47, 56]);
        //resizes the game world to match the layer dimensions
        this.mapLayer.resizeWorld();
        this.createItems();
        this.createDoors();
        //create player
        var result = this.findObjectsByType('playerStart', this.map, 'Objects');
        // this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
        this.player = new Player(result[0].x, result[0].y, this.game);
        //this.player.body.setSize(10, 14, 2, 1);
        //the camera will follow the player in the world
        this.game.camera.follow(this.player.sprite);
        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();
    };
    Game.prototype.update = function () {
        //collision
        this.game.physics.arcade.collide(this.player, this.mapLayer);
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
        this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);
        //player movement
        this.player.sprite.body.velocity.y = 0;
        this.player.sprite.body.velocity.x = 0;
        if (this.cursors.up.isDown) {
            this.player.sprite.body.velocity.y -= 50;
        }
        else if (this.cursors.down.isDown) {
            this.player.sprite.body.velocity.y += 50;
        }
        if (this.cursors.left.isDown) {
            this.player.sprite.body.velocity.x -= 50;
        }
        else if (this.cursors.right.isDown) {
            this.player.sprite.body.velocity.x += 50;
        }
    };
    Game.prototype.createItems = function () {
        //create items
        this.items = this.game.add.group();
        this.items.enableBody = true;
        var item;
        var result = this.findObjectsByType('item', this.map, 'Objects');
        result.forEach(function (element) {
            this.createFromTiledObject(element, this.items);
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
    return Game;
})(Phaser.State);
//# sourceMappingURL=Game.js.map