import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScene.js";
import PlayScene from "./scenes/PlayScene.js";
import MenuScene from "./scenes/MenuScene.js";
import BestscoreScene from "./scenes/BestscoreScene.js";
import PauseScene from "./scenes/PauseScene.js";
import './style.css';

const WEIDHT = window.innerWidth;
const HEIGHT = window.innerHeight;
const BIRD_POSITION = { x: WEIDHT * 0.1, y: HEIGHT / 2 };

const SHARED_CONFIG = {
  width: WEIDHT,
  height: HEIGHT,
  startPosition: BIRD_POSITION
};

const config = {
  type: Phaser.AUTO,
  parent: "app",
  pixelArt: true,
  ...SHARED_CONFIG,
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 200 },
      // debug: true
    }
  },
  scene: [new PreloadScene(SHARED_CONFIG), new MenuScene(SHARED_CONFIG), new PlayScene(SHARED_CONFIG), new BestscoreScene(SHARED_CONFIG), new PauseScene(SHARED_CONFIG)]
}

const game = new Phaser.Game(config);

// Handle window resize
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});

