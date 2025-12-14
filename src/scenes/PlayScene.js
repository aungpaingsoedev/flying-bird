import Phaser from "phaser";
import BaseScene from "./BaseScene";

const PIPES_TO_RENDER = 4;

class PlayScene extends BaseScene {
  constructor(config) {
    super("PlayScene", config);
    this.bird = null;
    this.pipes = null;
    this.pipeVerticalDistanceRage = [150, 250];
    this.pipeHorizontalDistanceRange = [400, 450];
    this.flapVelocity = 300;
    this.score = 0;
    this.scoreText = "";
    this.bestScore = "";

    this.currentDifficulty = "easy";
    this.difficultyLevels = {
      easy: {
        pipeVerticalDistanceRange: [200, 280],
        pipeHorizontalDistanceRange: [400, 500],
      },
      normal: {
        pipeVerticalDistanceRange: [150, 230],
        pipeHorizontalDistanceRange: [350, 450],
      },
      hard: {
        pipeVerticalDistanceRange: [120, 200],
        pipeHorizontalDistanceRange: [300, 400],
      },
    };
  }

  create() {
    this.currentDifficulty = "easy";
    this.createBG();
    this.createBird();
    this.createPipes();
    this.handleInputs();
    this.createScoreText();
    this.createDifficultyText();
    this.createPause();
    this.createColliders();
    this.listenForEvents();

    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", { start: 8, end: 15 }),
      frameRate: 24,
      repeat: -1,
    });

    this.bird.play("fly");
  }

  update() {
    if (this.scene.isPaused("PlayScene")) return;

    this.checkGameStatus();
    this.recyclePipes();
  }

  createBG() {
    const bg = this.add.image(0, 0, "sky").setOrigin(0, 0);
    // Scale background to fill the entire screen
    const scaleX = this.config.width / bg.width;
    const scaleY = this.config.height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale);
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setScale(3)
      .setFlipX(true)
      .setOrigin(0);
    this.bird.setBodySize(this.bird.width, this.bird.height);
    this.bird.body.gravity.y = 400;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);
      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-200);
  }

  createScoreText() {
    this.score = 0;
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: "32px",
      fill: "#000",
    });
    this.bestScore = this.add.text(
      16,
      50,
      `Best Score: ${localStorage.getItem("bestScore") || 0}`,
      { fontSize: "24px", fill: "#000" }
    );
  }

  createDifficultyText() {
    this.difficultyText = this.add.text(
      16,
      80,
      `Difficulty: ${this.currentDifficulty}`,
      {
        fontSize: "24px",
        fill: "#000",
      }
    );
  }

  createPause() {
    const pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setScale(3)
      .setOrigin(1);
    pauseButton.setInteractive();
    pauseButton.on("pointerdown", () => {
      this.scene.pause("PlayScene");
      this.scene.launch("PauseScene");
    });
  }

  listenForEvents() {
    this.events.on("resume", () => {
      this.physics.pause();
      this.initialTime = 3;

      if (this.countDownText) {
        this.countDownText.destroy();
      }

      this.countDownText = this.add
        .text(
          ...this.screenCenter,
          `Fly in ${this.initialTime}`,
          this.fontOptions
        )
        .setOrigin(0.5);

      if (this.timedEvent) {
        this.timedEvent.remove();
      }

      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        loop: true,
        callbackScope: this,
      });
    });
  }

  countDown() {
    this.initialTime--;
    if (this.countDownText) {
      this.countDownText.setText(`Fly in ${this.initialTime}`);
    }

    if (this.initialTime <= 0) {
      if (this.countDownText) {
        this.countDownText.destroy();
        this.countDownText = null;
      }
      this.physics.resume();
      if (this.timedEvent) {
        this.timedEvent.remove();
        this.timedEvent = null;
      }
    }
  }

  handleInputs() {
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("keydown-SPACE", this.flap, this);
  }

  checkGameStatus() {
    if (
      this.bird.getBounds().bottom >= this.config.height ||
      this.bird.y <= 0
    ) {
      this.gameOver();
    }
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  recyclePipes() {
    if (!this.pipes) return;

    const tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaseScore();
          this.setBestScore();
          this.increaseDifficulty();
        }
      }
    });
  }

  increaseDifficulty() {
    if (this.score % 10 === 0) {
      if (this.currentDifficulty === "easy") {
        this.currentDifficulty = "normal";
      } else if (this.currentDifficulty === "normal") {
        this.currentDifficulty = "hard";
      } else {
        this.currentDifficulty = "easy";
      }
    }
  }

  getRightMostPipe() {
    if (!this.pipes) return 0;

    let rightMostX = 0;

    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    });

    return rightMostX;
  }

  placePipe(uPipe, lPipe) {
    let difficulty = this.difficultyLevels[this.currentDifficulty];
    let rightMostX = this.getRightMostPipe();
    let pipeVerticalDistance = Phaser.Math.Between(
      ...difficulty.pipeVerticalDistanceRange
    );
    let pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDistance
    );
    let pipeHorizontalDistance = Phaser.Math.Between(
      ...difficulty.pipeHorizontalDistanceRange
    );

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }

  setBestScore() {
    const bestScoreText = localStorage.getItem("bestScore");
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (!bestScore || this.score > bestScore) {
      localStorage.setItem("bestScore", this.score);
    }
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xff0000);
    this.setBestScore();
    if (this.bird.anims) {
      this.bird.anims.pause();
    }
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  }

  flap() {
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  increaseScore() {
    this.score += 1;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}

export default PlayScene;
