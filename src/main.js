import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScene.js";
import PlayScene from "./scenes/PlayScene.js";
import MenuScene from "./scenes/MenuScene.js";
import BestscoreScene from "./scenes/BestscoreScene.js";
import PauseScene from "./scenes/PauseScene.js";

const WEIDHT = 800;
const HEIGHT = 600;
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

new Phaser.Game(config);

