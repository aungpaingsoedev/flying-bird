import BaseScene from "./BaseScene";

class MenuScene extends BaseScene {
  constructor(config) {
    super("MenuScene", {
      ...config,
      canGoBack: false,
    });

    this.menu = [
      {
        scene: "PlayScene",
        text: "Play",
      },
      {
        scene: "BestscoreScene",
        text: "Score",
      },
      {
        scene: null,
        text: "Exit",
      },
    ];
  }

  create() {
    super.create();
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
      menuItem.scene && this.scene.start(menuItem.scene);

      if (menuItem.scene === "Exit") {
        this.game.destroy(true);
      }
    });
  }
}

export default MenuScene;
