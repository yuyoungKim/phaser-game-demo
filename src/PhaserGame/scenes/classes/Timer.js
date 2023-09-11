import Phaser from "phaser";

export default class Timer extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, scale, fontSize, seconds) {
        super(scene, x, y);
        this.scale = scale;
        this.remainingTime = seconds;
        this.timerText = this.scene.add.text(this.x, this.y, new Date(seconds * 1000).toISOString().substring(14, 19), { fontSize: fontSize.toString() + "px", fontFamily: "Truculenta-Black", fill: '#B2F1FF', align: 'center' }).setOrigin(0.5, 0.5).setDepth(this.depth + 2);
    }

    updateTime(seconds) {
        this.remainingTime = seconds;
        this.timerText.setText(new Date(seconds * 1000).toISOString().substring(14, 19));
    }

    getTime() {
        return this.remainingTime;
    }
}

// Register a function to the gameobjectfactory, allowing you to use this.add.<objectname>
Phaser.GameObjects.GameObjectFactory.register("timer", function (x, y, scale, fontSize, seconds) {
    const timerInst = new Timer(this.scene, x, y, scale, fontSize, seconds);

    this.displayList.add(timerInst);
    this.updateList.add(timerInst);

    return timerInst;
})