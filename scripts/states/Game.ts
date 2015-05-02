/**
 * Created by myabko on 15-05-01.
 */

/*create the reference paths for our components. this allows typescript to do intellisense-like code completion. should
 * probably be added for each file/class that is referenced below*/
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
/// <reference path="../model/Heart.ts"/>
/// <reference path="../elements/Player.ts"/>
/// <reference path="../model/Heart.ts"/>
/// <reference path="../model/OxygenTank.ts"/>


class Game extends Phaser.State {

    PLAYER_COUNT: number = 1;
    LIGHT_RADIUS: number = 120;
    WATER_SPEED: number = 250;

    map:Phaser.Tilemap;
    mapLayer:Phaser.TilemapLayer;
    hazardLayer:Phaser.TilemapLayer;
    items:Phaser.Group;
    decorations:Phaser.Group;
    doors:Phaser.Group;
    cursors:Phaser.CursorKeys;
    players: Player[];
    cameraman: Phaser.Sprite;

    //Lighting model
    lights : Object[];

    shadowTexture : Phaser.BitmapData;
    lightSprite : Phaser.Image;

    constructor() {
        super();
        this.players = [];
        this.lights = [];
    }

    create() {

        this.map = this.game.add.tilemap('DiverLevel1');

        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        this.map.addTilesetImage('RockTile', 'RockTile');

        //create layer
        this.mapLayer = this.map.createLayer('Tiles');

        this.map.setCollisionByExclusion([1,2,3,8,9,18,19,46,47,56],true,"Tiles");
        //  This will set Tile ID 26 (the coin) to call the hitCoin function when collided with
        this.map.setTileIndexCallback([8,9,18,19],this.environmentOverlap, this);

        //  This will set the map location 2, 0 to call the function
        //map.setTileLocationCallback(2, 0, 1, 1, hitCoin, this);

        this.mapLayer.resizeWorld();
        //this.lights = this.game.add.group();

        this.createDecorations();
        this.createItems();

        //create player
        this.createPlayers();
        this.createCameraman();

        //Add light layer
        this.setupLights();

        //the camera will follow the player in the world
        this.game.camera.follow(this.cameraman);

        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    private createPlayers() {
        var result = this.findObjectsByType('playerStart', this.map, 'Objects');

        var pads = [this.game.input.gamepad.pad1, this.game.input.gamepad.pad2, this.game.input.gamepad.pad3, this.game.input.gamepad.pad4];
        for (var i = 0; i < this.PLAYER_COUNT; i++) {

            var player = new Player(result[i].x, result[i].y, this.game, pads[i]);
            player.itemsPointer = this.items;
            player.sprite.body.setSize(21, 20);
            this.lights.push(player.sprite);
            this.players.push(player);
        }

        for (var i = 0; i < this.PLAYER_COUNT; i++){
            var player = this.players[i];
            player.otherPlayers = [];
            for (var j = 0; j < this.PLAYER_COUNT; j++){
                if (j != i){
                    player.otherPlayers.push(this.players[j]);
                }
            }
        }
    }

    private createCameraman(){
        this.cameraman = this.game.add.sprite(this.game.width/2, this.game.height/2);
    }

    private setupLights() {
// Create the shadow texture
        this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
        // Draw shadow
        // Create an object that will use the bitmap as a texture
        this.lightSprite = this.game.add.image(0, 0, this.shadowTexture);

        // Set the blend mode to MULTIPLY. This will darken the colors of
        // everything below this sprite.
        this.lightSprite.blendMode = PIXI.blendModes.MULTIPLY;
    }

    update() {
        //collision
        this.game.physics.arcade.overlap(this.items, this.mapLayer);
        for (var i = 0; i < this.PLAYER_COUNT; i++){
            this.game.physics.arcade.collide(this.players[i].sprite, this.mapLayer, this.environmentCollision,null,this);
            this.game.physics.arcade.overlap(this.players[i].sprite, this.mapLayer, this.environmentOverlap,null,this);
            this.game.physics.arcade.overlap(this.players[i].sprite, this.items, this.collect, null, this);
            this.game.physics.arcade.overlap(this.players[i].sprite, this.doors, this.enterDoor, null, this);

            this.game.physics.arcade.overlap(this.players[i].bubbleEmmiter, this.mapLayer, this.environmentOverlap,null,this);
            this.game.physics.arcade.overlap(this.players[i].bubbleEmmiter, this.mapLayer);

            this.players[i].update();
        }

        this.updateCameraman();
        this.updateLights();
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
        //remove sprite
        collectable.destroy();

        player.player.changeGold(1);

        console.log('Cha-ching!' + player.player.gold);
    }

    private enterDoor(player, door) {
        console.log('entering door that will take you to ' + door.targetTilemap + ' on x:' + door.targetX + ' and y:' + door.targetY);
    }

    private environmentCollision(player, tile) {
        if (tile.index == 26){
            console.log("Ouch!");
        }else if (tile.index == 36 || tile.index == 37){
            console.log("Escaped!!!");
        }
    }

    private environmentOverlap(player, tile) {

       switch (tile.index){
           case 8: player.body.velocity.y = -this.WATER_SPEED; break;
           case 9: player.body.velocity.y =  this.WATER_SPEED; break;
           case 18:player.body.velocity.x = -this.WATER_SPEED; break;
           case 19:player.body.velocity.x =  this.WATER_SPEED; break;

           console.log("Wooooahhh!");
       }
    }

    updateLights(){
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
        this.lights.forEach(function(light) {
            // Randomly change the radius each frame
            var radius = this.LIGHT_RADIUS + this.game.rnd.integerInRange(1,10);
            var screenX = light.x - this.lightSprite.x;
            var screenY = light.y - this.lightSprite.y;
            // Draw circle of light with a soft edge
            var gradient =
                this.shadowTexture.context.createRadialGradient(
                    screenX, screenY,this.LIGHT_RADIUS * 0.25,
                    screenX, screenY, radius);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

            this.shadowTexture.context.beginPath();
            this.shadowTexture.context.fillStyle = gradient;
            this.shadowTexture.context.arc(screenX, screenY, radius, 0, Math.PI*2);
            this.shadowTexture.context.fill();
        }, this);
        this.lightSprite.x = this.camera.x;
        this.lightSprite.y = this.camera.y;

        // This just tells the engine it should update the texture cache
        this.shadowTexture.dirty = true;
    }

    updateCameraman(){
        //THis function finds an appoorimate center between the players and
        //moves the invisible spirite camerman to it's location. This should
        // provide a camera that roughly follows the group.

        var minY : number=-1;
        var maxY : number=-1;
        var minX : number=-1;
        var maxX : number=-1;

        this.players.forEach(function(player) {
            if (player.sprite.x <= minX || minX == -1) minX = player.sprite.x;
            if (player.sprite.y <= minY || minY == -1) minY = player.sprite.y;
            if (player.sprite.x >= maxX || maxX == -1) maxX = player.sprite.x;
            if (player.sprite.y >= maxY || maxY == -1) maxY = player.sprite.y;
        }, this);

        var camX = (minX + maxX) / 2;
        var camY = (minY + maxY) / 2;

        this.cameraman.x = camX;
        this.cameraman.y = camY;
    }
}