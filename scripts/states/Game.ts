/**
 * Created by myabko on 15-05-01.
 */

/*create the reference paths for our components. this allows typescript to do intellisense-like code completion. should
 * probably be added for each file/class that is referenced below*/
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>

class Game extends Phaser.State {

    map:Phaser.Tilemap;
    mapLayer:Phaser.TilemapLayer;
    hazardLayer:Phaser.TilemapLayer;
    items:Phaser.Group;
    decorations:Phaser.Group;
    doors:Phaser.Group;
    cursors:Phaser.CursorKeys;
    player:Phaser.Sprite;

    constructor() {
        super();
    }

    create() {

        this.map = this.game.add.tilemap('DiverLevel1');

        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        this.map.addTilesetImage('RockTile', 'RockTile');

        //create layer
        this.mapLayer = this.map.createLayer('Tiles');

        this.map.setCollisionByExclusion([1,2,3,46,47,56]);

        //resizes the game world to match the layer dimensions
        this.mapLayer.resizeWorld();

        this.createItems();
        this.createDecorations();
        this.createDoors();

        //create player
        var result = this.findObjectsByType('playerStart', this.map, 'Objects');
        this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
        this.game.physics.arcade.enable(this.player);
        //this.player.body.setSize(10, 14, 2, 1);

        //the camera will follow the player in the world
        this.game.camera.follow(this.player);

        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    update() {
        //collision
        this.game.physics.arcade.collide(this.player, this.mapLayer);
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
        this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);

        //player movement
        this.player.body.velocity.y = 0;
        this.player.body.velocity.x = 0;

        if (this.cursors.up.isDown) {
            this.player.body.velocity.y -= 50;
        }
        else if (this.cursors.down.isDown) {
            this.player.body.velocity.y += 50;
        }
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x -= 50;
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x += 50;
        }
    }

    createItems() {
        //create items
        this.items = this.game.add.group();
        this.items.enableBody = true;
        var result = this.findObjectsByType('item', this.map, 'Objects');
        result.forEach(function (element) {
            this.createFromTiledObject(element, this.items);
        }, this);
    }

    createDecorations() {
        //create items
        this.decorations = this.game.add.group();
        this.decorations.enableBody = true;
        var result = this.findObjectsByType('decoration', this.map, 'Objects');
        result.forEach(function (element) {
            this.createFromTiledObject(element, this.decorations);
        }, this);
    }

    createDoors() {
        //create doors
        this.doors = this.game.add.group();
        this.doors.enableBody = true;
        var result = this.findObjectsByType('door', this.map, 'Objects');

        result.forEach(function (element) {
            this.createFromTiledObject(element, this.doors);
        }, this);
    }


    //find objects in a Tiled layer that containt a property called "type" equal to a certain value
    private findObjectsByType(type, map, layer) {
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
    }

    createFromTiledObject(element, group) {

        var sprite = group.create(element.x, element.y, element.properties.sprite);

        //copy all properties to the sprite
        Object.keys(element.properties).forEach(function (key) {
            sprite[key] = element.properties[key];
        });
    }

    private collect(player, collectable) {
        console.log('yummy!');

        //remove sprite
        collectable.destroy();
    }

    private enterDoor(player, door) {
        console.log('entering door that will take you to ' + door.targetTilemap + ' on x:' + door.targetX + ' and y:' + door.targetY);
    }
}