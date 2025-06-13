
// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 1000,
    height: 700,
    scene: [Load, Platformer, PlatformerLevelTwo, WinScene, TitleScene],

    plugins: {
        scene: [
            {
                key: 'AnimatedTiles',    // this is how you'll access it in the scene
                plugin: AnimatedTiles,   // must match what's loaded in <script>
                mapping: 'animatedTiles' // this.animatedTiles will be available
            }
        ]
    }
}

var cursors;
//change this scale for player character scale 
const SCALE = 5;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);