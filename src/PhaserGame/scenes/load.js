import Phaser from 'phaser';
import Score from './classes/Score.js';
import timer from './classes/Timer.js'
export class Load extends Phaser.Scene {
    constructor() {
        super({
            key: 'Load'
        });
        this.cards = [];
        this.crates = []; // move crates to class level scope
        this.crateCounters = []; // an array to keep track of the counters
        this.crateTexts = []; // New array to store text objects
        this.timedEvent = null;
        this.score = 0;
    }
    
    loadFont(name, url) {
        var newFont = new FontFace(name, `url(${url})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            console.error(error);
            return error;
        });
    }
    

    preload() {
        this.loadFont('Truculenta', '/fonts/Truculenta-Regular.ttf');
        this.loadFont('TruculentaBold', '/fonts/Truculenta-Black.ttf');
        this.load.image("bg", './image/bg.png');

        

        // Cards
        this.load.image("1_or_11", './image/1_or_11.png');
        this.load.image("double", './image/double.png');
        this.load.image("redraw", './image/redraw.png');
        this.load.image("resurrect", './image/resurrect.png');
        this.load.image("steal", './image/steal.png');
        this.load.image("tie_breaker", './image/tie_breaker.png');
        
        
        //Elements
        this.load.image("crate", '/image/crate.png');

        
    }

    create() {
        // fade in the scene
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.cameras.main.setBackgroundColor('#081733');
        
        let bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);

        let scaleX = this.cameras.main.width / bg.width;
        let scaleY = this.cameras.main.height / bg.height;
        let scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);
        const {width, height} = this.scale
        
        // Insert Title and Text
        this.add.text(1050, 135, 'Time:', {
            font: '120px TruculentaBold',
            fill: '#2CF8AE'
        });

        this.add.text(2350, 135, 'Score:', {
            font: '120px TruculentaBold',
            fill: '#2CF8AE'
        });

        this.add.text(700, 300, 'SORT THE CARDS INTO THE BOXES BEFORE TIME RUNS OUT', {
            font: '120px TruculentaBold',
            fill: '#ffffff'
        });

        // Insert crates
        this.crateSprites  = [];
        for (let i = 0; i < 6; i++) {
            const x = width * (0.1 + (i % 6 * 0.15));
            const y = height * (i < 6 ? 0.8 : 0.65);
            const crate = this.add.sprite(x, y, 'crate').setScale(0.75)
            this.crateSprites.push(crate);
        }



        // Insert counters
        this.crateTexts = [];
        this.crateCounters = this.crateSprites.map(() => 0);  // Initializes all counters to 0
        this.crateSprites.forEach((crate, index) => {
            const x = width * (0.1 + (index % 6 * 0.15));
            const y = height * 0.735;
            const text = this.add.text(x, y, '0', { 
                font: '100px TruculentaBold', 
                fill: '#ffffff', 
            }).setOrigin(0.5);
            this.crateTexts.push(text);
        });

        // Insert cards
        this.cards = [];
        let cardNames = ["1_or_11","double","redraw","resurrect","steal","tie_breaker"];
        for (let i = 0; i < 6; i++) {
            const x = width * (0.1 + (i % 6 * 0.15));
            const y = height * (i < 6 ? 0.84 : 0.65);
            this.add.image(x, y, cardNames[i]).setScale(0.3)
        }
        
        //Insert Scoreboard
        let score = 0;
        this.scoreDisplay = this.add.score(2700, 200, 1, 100, score);

        //Insert Timer
        this.timerDisplay = this.add.timer(1390, 200, 1, 120, 60);


        // Generate random cards from left to right
        // Set up a repeating timer to spawn a card every 2 seconds

        const initialDelay = 750;
        this.spawnEvent = this.time.addEvent({
            delay: initialDelay,
            callback: this.spawnCard,
            callbackScope: this,
            loop: true
        });
        

       
        // fade out after a while
        // this.time.addEvent({
        //         delay: 3900,
        //         callback: () => { this.cameras.main.fadeOut(500, 0, 0, 0) },
        // });
    }
    update() {
        this.cards.forEach((cards) => {
            cards.x += 9; // Change this value to adjust speed

            if (cards.x > 3840 + 700/2) {
                cards.destroy();
                this.cards = this.cards.filter(item => item !== cards);
            }
        });

        if (this.timerDisplay && this.timerDisplay.getTime() <= 0 && this.spawnEvent) {
            this.timerDisplay.destroy();
            this.timerDisplay = null;
            this.spawnEvent.remove();
            this.spawnEvent = null;
        }



        if (this.input.dragElement) {
            this.input.dragElement.x = this.input.activePointer.x;
            this.input.dragElement.y = this.input.activePointer.y;
        }
    }

    spawnCard() {


        if (this.timerDisplay && this.timerDisplay.getTime() <= 0) {
            return; // exit early if timer reached zero
        }
        let cardNames = ["1_or_11","double","redraw","resurrect","steal","tie_breaker"];
        let randomCardIndex = Phaser.Math.Between(0, cardNames.length - 1);
        let randomCardName = cardNames[randomCardIndex];
        const card = this.add.sprite(0, 850, randomCardName).setScale(0.55).setInteractive();
        card.setData('typeIndex', randomCardIndex);  // Store the index/type of the card

            // After spawning a card, adjust the delay
        const maxDelay = 900; // max delay when timer is full
        const minDelay = 300;  // min delay when timer is near zero
        const totalTime = 60; // assuming your timer starts from 100 seconds

        let newDelay = minDelay + (this.timerDisplay.getTime() / totalTime) * (maxDelay - minDelay);
        this.spawnEvent.delay = newDelay;

        // When the card is pressed
        card.on('pointerdown', function (pointer) {
            this.setData('isBeingDragged', true);
            // this.setTint(0xff0000); 
        });

        // When the card is released
        card.on('pointerup', function () {
            this.setData('isBeingDragged', false);
            this.clearTint();

            let collidedWithCrate = false;

            this.scene.crateSprites.forEach((crate, index) => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), crate.getBounds())) {
                    if (this.texture.key === cardNames[index]) { // Only increment counter for matching crate
                        this.scene.crateCounters[index]++;
                        this.scene.crateTexts[index].setText(this.scene.crateCounters[index].toString());
                        collidedWithCrate = true;

                        let currentScore = parseInt(this.scene.scoreDisplay.scoreText.text);  // Assuming your score is an integer. Adjust as necessary.
                        currentScore += 10;  // Increase score by 10 for every correct drop. Adjust the value as per your game's logic.
                        this.scene.scoreDisplay.updateScore(currentScore);
                    }
                }
            });

            if (!collidedWithCrate) {
                this.x = this.getData('startPosX');
                this.y = this.getData('startPosY');
            } else {
                this.destroy();  // Remove the card if it's dropped on a crate.
            }
        });

        // When the card is being dragged
        card.on('pointermove', function (pointer) {
            if (this.getData('isBeingDragged')) {
                this.x = pointer.x;
                this.y = pointer.y;
            }
        });

            this.cards.push(card);
    }

}