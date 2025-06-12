class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload(){
        this.load.setPath("./assets/");

        // 1.load characters 
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // 2.load tilemap info
        this.load.image("tilemap_tiles", "tilesheet-packed.png");
        this.load.image("tilemap_mine_tiles","sheet.png");
        this.load.image("tilemap_ice_tiles","sheet_ice.png");

        // 3. Load audio
        this.load.audio("walk1", "footstep_snow_000.ogg");
        this.load.audio("walk2", "footstep_snow_001.ogg");
        this.load.audio("walk3", "footstep_snow_002.ogg");
        this.load.audio("walk4", "footstep_snow_003.ogg");
        this.load.audio("walk5", "footstep_snow_004.ogg");
        this.load.audio("jumpSound", "sfx_jump.ogg");
        this.load.audio("hurtSound", "sfx_hurt.ogg")

        // 4.Load tilemap information
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON

        // 5.Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "tilesheet-packed.png", {
            frameWidth: 70,
            frameHeight: 70
        });
        this.load.spritesheet("tilemap_mine_sheet", "sheet.png",{
            frameWidth: 70,
            frameHeight: 70
        });
        this.load.spritesheet("tilemap_ice_sheet", "sheet_ice.png",{
            frameWidth: 70,
            frameHeight: 70
        });

        // 6. Loading background
        this.load.image('icyBg', 'icebg.png');

        
        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        //this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }
    create() {

        // Affing walking animations
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

         // ...and pass to the next Scene
         this.scene.start("platformerScene");
    }
    update(){
        //wont reach here
    }
}