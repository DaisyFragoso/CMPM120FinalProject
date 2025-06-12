class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init(){

         this.ACCELERATION = 600;
         this.DRAG = 500;    // DRAG < ACCELERATION = icy slide
         this.physics.world.gravity.y = 1500;
         this.JUMP_VELOCITY = -700;
        // this.PARTICLE_VELOCITY = 50;

         this.SCALE = 1.0;

         this.isRestarting = false;

        //heart system
        this.maxHealth = 3;
        this.health = this.maxHealth;
        this.hearts = []; // to track heart sprites
        this.lastDamagedAt = 0;
        this.damageCooldown = 1000;


    }

    create(){


         //create new tilemap game object: 16,  16 pixel , 120 tiles wide, 40 tiles tall
        this.map = this.add.tilemap("platformer-level-1", 70, 70, 120, 40);

        // Adding background
        const bg = this.add.image(0, 0, 'icyBg').setOrigin(0, 0);
        bg.setDisplaySize(this.map.widthInPixels, this.map.heightInPixels); // match to tilemap
        bg.setScrollFactor(1); // background moves with world

        //Add a tileset to the map
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.mineTileset = this.map.addTilesetImage("kenny_sheet_mine_tilemap_packed","tilemap_mine_tiles");
        this.iceTileset = this.map.addTilesetImage("kenny_sheet_ice_tilemap_packed","tilemap_ice_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", [this.tileset,this.mineTileset,this.iceTileset], 0, 0);
        this.objectsLayer = this.map.createLayer("Objects-n-Features", [this.tileset,this.mineTileset,this.iceTileset], 0, 0);
        this.groundLayer.setScale(1.0);
        this.objectsLayer.setScale(1.0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });


        // Adding walking audio
        this.isWalkingSoundPlaying = false;
        this.currentSoundIndex = 0;
        this.walkingSound = null;
        this.walkingSoundComplete = null;

       this.walkSounds = [
            this.sound.add('walk1', { volume: 0.4 }),
            this.sound.add('walk2', { volume: 0.4 }),
            this.sound.add('walk3', { volume: 0.4 }),
            this.sound.add('walk4', { volume: 0.4 }),
            this.sound.add('walk5', { volume: 0.4 })
        ];

        this.playNextSound = () => {
            if (!this.isWalkingSoundPlaying) return;

            
            if (this.walkingSound && this.walkingSoundCompleteHandler) {
                this.walkingSound.off('complete', this.walkingSoundCompleteHandler);
            }

            this.walkingSound = this.walkSounds[this.currentSoundIndex];
            this.walkingSound.play({ rate: 1.5 });

            this.walkingSoundCompleteHandler = () => {
                if (this.isWalkingSoundPlaying) {
                    this.currentSoundIndex = (this.currentSoundIndex + 1) % this.walkSounds.length;
                    this.playNextSound();
                }
            };

            this.walkingSound.once('complete', this.walkingSoundCompleteHandler);
        };

        // Ensure player spawns in right area
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // Finding torches in the "Torches" Layer
        this.coins = this.map.createFromObjects("Torches", {
            name: "Torch",
            key: "tilemap_sheet",
            frame: 1
        });

        // Creating animation for torches
        this.anims.create({
            key: 'torchAnim', // Animation key
            frames: [
                    { key: 'tilemap_sheet', frame: 152 },
                    { key: 'tilemap_sheet', frame: 153 },
                ],
            frameRate: 6,  // Higher is faster
            repeat: -1      // Loop the animation indefinitely
        });

        // Playing animation for Torches
        this.anims.play('torchAnim', this.coins);

        // Finding Exit Sign in the "Exit" Layer
        this.exitSign = this.map.createFromObjects("Exit", {
            name: "Exit Sign",
            key: "tilemap_sheet",
            frame: 114
        });

        //turn on arcade physics 
        this.spikeTiles = this.groundLayer.filterTiles(tile => {
            return tile.properties.spikes == true;
        });
        this.physics.world.enable(this.exitSign, Phaser.Physics.Arcade.STATIC_BODY);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(250, 1700, "platformer_characters", "tile_0000.png").setScale(5)
        my.sprite.player.setCollideWorldBounds(true);

        // Cap x and y velocities
        my.sprite.player.setMaxVelocity(600, 900);  // cap X and Y velocities

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        //health system
        this.anims.create({ 
            key:'lose_first_half', 
            frames: this.anims.generateFrameNumbers('heart', {start: 0, end: 2}),
            frameRate: 10 
        });

        this.anims.create({ 
            key:'lose_second_half', 
            frames: this.anims.generateFrameNumbers('heart', {start: 2, end: 4}),
            frameRate: 10 
        });

        const numberOfHearts = this.maxHealth;
        const heartSpacing = 120;
        const heartScale = 15;
        const padding = 300; 
        const xpadding = 260;

        const cam = this.cameras.main;
        const rightEdge = cam.width - (cam.width) - xpadding;
        const topEdge = cam.height - cam.height - padding;

        for (let i = 0; i < numberOfHearts; i++) {
        const x = rightEdge - i * heartSpacing;
        const y = topEdge;
        const heart = this.add.sprite(x+150 , topEdge, 'heart', 0)
            .setScale(heartScale)
            .setOrigin(1, 0)           
            .setScrollFactor(0);       // so it stays fixed on screen
        this.hearts.push(heart);
        }

          // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

          // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // camera code here
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(0.5);

        // Death Zone setup
        const deathRectangle = this.map.getObjectLayer('DeathZone').objects[0];
        // Create a Phaser rectangle from it
        this.deathZone = new Phaser.Geom.Rectangle(
            deathRectangle.x, 
            deathRectangle.y, 
            deathRectangle.width, 
            deathRectangle.height
        );

        // Ends level
        this.physics.add.overlap(my.sprite.player, this.exitSign, (player, exitSign) => {
            if (this.isWalkingSoundPlaying) {
                this.isWalkingSoundPlaying = false;

                // Stop all walking sounds
                this.walkSounds.forEach(sound => sound.stop());

            }
            this.scene.start("endScene");
        });

    }

    // Helper function if player is touching spikes
    isTouchingSpike() {
        let player = my.sprite.player;
        let tile = this.groundLayer.getTileAtWorldXY(player.x, player.y, true);
        return tile && tile.properties.spikes === true;
    }
   
    gameOver(){
        this.isRestarting = true;
        this.time.delayedCall(500, () => { 
           // this.sound.play("hurtSound", {volume: 1});
            this.scene.restart();
        });
    }

    takeDamage(amount) {
        const now = this.time.now;
        if (this.isRestarting || now - this.lastDamagedAt < this.damageCooldown) {
            return;
        }

        this.lastDamagedAt = now;
        this.health -= amount;

        if (this.health <= 0) {
            this.sound.play("hurtSound", {volume: 1});
            this.health = 0;
            this.updateHearts();
            this.gameOver();
        } else {
            this.updateHearts();
        }
    }

    updateHearts() {
        this.sound.play("hurtSound", {volume: 1});
        for (let i = 0; i < this.hearts.length; i++) {
            if (i < this.health) {
                this.hearts[i].setFrame(0); // full
            } else {
                this.hearts[i].setFrame(4); // empty
            }
        }
    }


    update() {
        // Player Movement 
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);


        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            
        }

        // Play walking audio if walking on ground
        if ((cursors.left.isDown || cursors.right.isDown) && my.sprite.player.body.blocked.down) {
            // Only play walking sounds if not already playing
            if (!this.isWalkingSoundPlaying) {
                this.isWalkingSoundPlaying = true;
                this.currentSoundIndex = 0;
                this.playNextSound();
            }
        } else {
            if (this.isWalkingSoundPlaying) {
                this.isWalkingSoundPlaying = false;
                this.walkSounds.forEach(sound => sound.stop());
            }
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.sound.play("jumpSound", {volume: 1})
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }

        // Id player gets hurt from spikes or falling
        if (this.isTouchingSpike() && !this.isRestarting) {
         //   this.sound.play("hurtSound", {volume: 1});
            this.takeDamage(1);
        }
        if (Phaser.Geom.Rectangle.ContainsPoint(this.deathZone, my.sprite.player)) {
          //  this.sound.play("hurtSound", {volume: 1});
           // this.scene.restart(); // or respawn logic
            this.takeDamage(3);
          //  this.takeDamage(1);
          //  this.takeDamage(1);
        }
    }
}