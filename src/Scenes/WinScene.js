class winScene extends Phaser.Scene {
    constructor() {
        super('endScene');
        this.imageX = 400;
        this.imageY = 350;
    }

    preload(){
            this.load.image('theEnd', 'theEnd.png'); // Replace with your image path
            console.log("TheEndScene loaded");

    }

    create() {
        console.log("TheEndScene loaded");

        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'theEnd')
            .setOrigin(0.5)
            .setScale(3); //size of img

        this.input.keyboard.once('keydown-R', () => {
            this.scene.start("platformerScene");
        });

    }
    
}