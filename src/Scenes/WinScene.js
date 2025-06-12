class WinScene extends Phaser.Scene {
    constructor() {
        super('endScene');
        this.imageX = 400;
        this.imageY = 350;
    }

    preload(){
            // Loading image
            this.load.image('theEnd', 'assets/theEnd.png'); 

    }

    create() {
        // Stops all currently playing sounds
        this.sound.stopAll();

        // Display image
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'theEnd')
            .setOrigin(0.5)
            .setScale(2); //size of img
        
        // Display text to show what key to press to play again
        this.myText1 = this.add.text(this.cameras.main.width / 2, 550, 'Press R to go back to title screen!', {
            fontSize: '50px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        this.myText1.setOrigin(0.5, 0.5);

        // Key to start the game over
        this.input.keyboard.once('keydown-R', () => {
            this.scene.start("titleScene");
        });

    }
    
}