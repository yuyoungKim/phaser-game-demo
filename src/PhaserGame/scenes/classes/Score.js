import Phaser from "phaser";

export default class Score extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, scale, rotation, score) {
        super(scene, x, y, "ScoreGreen");
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.constRotation = rotation;
        // this.updateTurn(isTurn);
        this.updateScore(score);
    }

    // updateTurn(isTurn, isStanding) {  //changes the colour of the container
    //     if (isTurn && !isStanding) { //GREEN
    //         this.setTexture("ScoreGreen");
    //         this.setRotation(this.constRotation)
    //     }
    //     else if (!isTurn && !isStanding) { //RED
    //         this.setTexture("ScoreRed");
    //         this.setRotation(this.constRotation === 0 ? Math.PI : 0)
    //     }
    //     else if (isStanding) { //PURPLE
    //         this.setTexture("ScorePurple");
    //         this.setRotation(this.constRotation === 0 ? Math.PI : 0)
    //     }
    // }

    updateScore(score) { //changes the score text
        console.log("Update Score", score)
        if (this.constRotation === 0) {
            if (this.scoreText === undefined){
                this.scoreText = this.scene.add.text(this.x, this.y + (20*this.scale), score.toString(), { fontSize: 104*this.scale + "px", fontFamily: "Truculenta-Regular", fill: '#000000', align: 'center' }).setOrigin(0.5, 0.5).setDepth(this.depth + 2);
            }
            else {
                this.scoreText.setText(score)
            }

        }
        else { //180 degree rotation
            if (this.scoreText === undefined) {
                this.scoreText = this.scene.add.text(this.x, this.y - (20*this.scale), score.toString(), { fontSize: 104*this.scale + "px", fontFamily: "Truculenta-Regular", fill: '#000000', align: 'center' }).setOrigin(0.5, 0.5).setDepth(this.depth + 2);
            }
            else {
               this.scoreText.setText(score)
            }        
        }
    }
}

// Register a function to the gameobjectfactory, allowing you to use this.add.<objectname>
Phaser.GameObjects.GameObjectFactory.register("score", function (x, y, scale, rotation, score) {
    const scoreInst = new Score(this.scene, x, y, scale, rotation, score );

    this.displayList.add(scoreInst);
    this.updateList.add(scoreInst);

    return scoreInst;
})
