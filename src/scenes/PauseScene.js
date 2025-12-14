import BaseScene from "./BaseScene";

class PauseScene extends BaseScene {
  constructor(config) {
    super("PauseScene", {
      ...config,
      canGoBack: false,
    });

    this.menu = [
      {
        scene: "PlayScene",
        text: "Continue",
      },
      {
        scene: "MenuScene",
        text: "Exit",
      },
    ];
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0);
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem) {
    const textGO = menuItem.textGO;
    textGO.setInteractive();

    textGO.on("pointerover", () => {
      textGO.setStyle({ fill: "#FF0000" });
    });

    textGO.on("pointerout", () => {
      textGO.setStyle({ fill: "#CD00F" });
    });

    textGO.on("pointerup", () => {
      if (menuItem.scene && menuItem.text === "Continue") {
        this.scene.stop('PauseScene');
        this.scene.resume('PlayScene');
      } else {
        this.scene.stop("PlayScene");
        this.scene.stop("PauseScene");
        this.scene.start(menuItem.scene);
      }
    });
  }
}

export default PauseScene;
