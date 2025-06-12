class TitleScene extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    preload(){
        // Load background image for title
        this.load.image("Icebg", "assets/icebg.png");
    }

    create() {
        // Display background image
        this.add.image(0, 0, 'Icebg')
            .setOrigin(0, 0 )
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);  // stretch to full canvas
        
        // Display text to show what key to press to play again
        this.myText1 = this.add.text(this.cameras.main.width / 2, 300 , 'Ice Out!!', {
            fontSize: '50px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });

        this.myText1.setOrigin(0.5, 0.5);
        this.myText1 = this.add.text(this.cameras.main.width / 2, 400, 'Press R to play!!', {
            fontSize: '35px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        this.myText1.setOrigin(0.5, 0.5);

        // Key to start the game over
        this.input.keyboard.once('keydown-R', () => {
            this.scene.start("platformerScene");
        });

    }
    
}