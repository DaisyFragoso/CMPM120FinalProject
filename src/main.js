
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
    scene: [Load, Platformer, WinScene, TitleScene]
}

var cursors;
//change this scale for player character scale 
const SCALE = 5;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);