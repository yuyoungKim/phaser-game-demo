import Phaser from "phaser";

export default class Timer extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, scale, fontSize, seconds) {
        super(scene, x, y);
        this.scale = scale;
        this.remainingTime = seconds;
        this.start();
        this.timerText = this.scene.add.text(this.x, this.y, new Date(seconds * 1000).toISOString().substring(14, 19), { fontSize: fontSize.toString() + "px", fontFamily: "Truculenta-Black", fill: '#B2F1FF', align: 'center' }).setOrigin(0.5, 0.5).setDepth(this.depth + 2);
    }

    start() {
        if (this.timerEvent) this.timerEvent.remove(false);

        this.timerEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.remainingTime--;
                this.updateTime(this.remainingTime);

                if (this.remainingTime <= 0) {
                    this.timerEvent.remove(false);
                    // Optional: callback or event for when the timer hits zero
                    // this.emit('complete');
                }
            },
            loop: true
        });
    }

    updateTime(seconds) {
        this.remainingTime = seconds;
        this.timerText.setText(new Date(seconds * 1000).toISOString().substring(14, 19));
    }

    getTime() {
        return this.remainingTime;
    }

    destroy() {
        if (this.timerEvent) {
            this.timerEvent.remove(false);
        }
        super.destroy();
    }
}

// Register a function to the gameobjectfactory, allowing you to use this.add.<objectname>
Phaser.GameObjects.GameObjectFactory.register("timer", function (x, y, scale, fontSize, seconds) {
    const timerInst = new Timer(this.scene, x, y, scale, fontSize, seconds);

    this.displayList.add(timerInst);

    return timerInst;
})