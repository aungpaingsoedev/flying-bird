import BaseScene from "./BaseScene";

class BestscoreScene extends BaseScene {
  constructor(config) {
    super("BestscoreScene", {
      ...config,
      canGoBack: true,
    });
  }

  create() {
    super.create();
    
    // Get best score from localStorage
    const bestScore = localStorage.getItem("bestScore") || 0;
    
    // Display best score text
    this.add
      .text(
        this.screenCenter[0],
        this.screenCenter[1],
        `Best Score: ${bestScore}`,
        {
          fontSize: `${this.fontSize * 2}px`,
          fill: "#CD00F",
        }
      )
      .setOrigin(0.5);
  }
}

export default BestscoreScene;
