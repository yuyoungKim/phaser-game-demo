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
        this.matchCount = 0;
        this.mismatchCount = 0;
        this.spawnRate = 140; // Initial spawn rate:
        this.cardSpawnCounter = 0; // Counter to keep track of elapsed time for card spawning
        this.isGameOver = false;
    }

    saveGameData(score, date) {
        // Check if both score and date are defined
        if (score !== undefined && date !== undefined) {
            const gameData = {
                score: score,
                date: date
            };
    
            let existingData = JSON.parse(localStorage.getItem('Leaderboard')) || [];
    
            existingData.push(gameData);
            existingData.sort((a, b) => b.score - a.score);
    
            existingData = existingData.slice(0, 5);

            localStorage.setItem('Leaderboard', JSON.stringify(existingData));
        } else {
            // Handle the case where score or date is undefined
            console.error('score and date must be defined to save game data.');
        }
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
    
    createRoundedRectangle(scene, x, y, width, height, radius, color, borderWidth, borderColor) {
        const graphics = scene.add.graphics();
    
        graphics.fillStyle(color);
        
        // Border style for the rectangle
        graphics.lineStyle(borderWidth, borderColor);

        graphics.strokeRoundedRect(x, y, width, height, radius);
        graphics.fillRoundedRect(x, y, width, height, radius);

    
        return graphics;
    }
    
    createAnimation (spritesheet, frames, frameRate, repeat = -1)
    {
        this.anims.create({
            key: spritesheet + '_ani',
            frames: this.anims.generateFrameNumbers(spritesheet, { start: 0, end: frames }),
            frameRate: frameRate,
            repeat: repeat
        });
    }
    

    preload() {
        this.loadFont('Truculenta', '/fonts/Truculenta-Regular.ttf');
        this.loadFont('TruculentaBold', '/fonts/Truculenta-Black.ttf');
        this.load.image("bg", './image/bg.png');

        this.load.image("retryButton", './image/blue_button_300.png')
        this.load.image("exitButton", './image/red_button_300.png')
        this.load.image("skull", './image/512x512.png')

        // Cards
        this.load.image("1_or_11", './image/1_or_11.png');
        this.load.image("double", './image/double.png');
        this.load.image("redraw", './image/redraw.png');
        this.load.image("resurrect", './image/resurrect.png');
        this.load.image("steal", './image/steal.png');
        this.load.image("tie_breaker", './image/tie_breaker.png');
        
        
        //Elements
        this.load.image("crate", '/image/crate.png');

        //Sounds
        this.load.audio('backgroundSound', './sounds/game-music-loop-3.mp3');
        this.load.audio('clickSound', './sounds/click.mp3');
        this.load.audio('wrongSound', './sounds/wrong.mp3');
        this.load.audio('correctSound', './sounds/shooting-sound.mp3');
        this.load.audio('gameoverSound', './sounds/gameover.mp3');

        // VFX
        this.load.spritesheet('redFlame_spritesheet','./image/redNormal.png.png', { frameWidth: 100, frameHeight: 100, endframe: 65 });
        this.load.spritesheet('purpleFlame_spritesheet', './image/purpleSmall.png.png', { frameWidth: 100, frameHeight: 100, endframe: 40, padding: 10 });
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
        
        //Insert Score
        let score = 0;
        this.scoreDisplay = this.add.score(2700, 200, 1, 100, score);

        //Insert Timer
        this.timerDisplay = this.add.timer(1390, 200, 1, 120, 60);  

        // Background Sound
        this.sound.play('backgroundSound', { loop: true });

        //VFX
        this.createAnimation('redFlame_spritesheet', 65, 30, -1);
        const burst_sprite = this.add.sprite(400, 200, 'redFlame_spritesheet')
        burst_sprite.setScale(5);
        burst_sprite.play('redFlame_spritesheet_ani');

        const burst_sprite1 = this.add.sprite(3400, 200, 'redFlame_spritesheet')
        burst_sprite1.setScale(5);
        burst_sprite1.play('redFlame_spritesheet_ani');

        this.createAnimation('purpleFlame_spritesheet', 40, 30, -1);
        this.createAnimation('blueFlame_spritesheet', 65, 30, -1);
    }
    
    update(time, delta) {
        delta = Math.min(delta, 20);  // capping to avoid large jumps

        if (this.isGameOver) {  // Check is game over
            return;
        }

        this.cards.forEach((cards) => {
            // console.log(delta);
            cards.x += (delta); 

            if (cards.x > 3840 + 700/2) {
                cards.destroy();
                this.cards = this.cards.filter(item => item !== cards);
            }
        });
        const spawnIncrementRate = 0.08;
        this.cardSpawnCounter += spawnIncrementRate * (delta)
        
        if (this.cardSpawnCounter > this.spawnRate) {
            this.cardSpawnCounter = 0;
            this.spawnCard();

            this.spawnRate -= 2 ; // Adjust spawn Rate
        }

        if (this.timerDisplay && this.timerDisplay.getTime() <= 0) {
            this.timerDisplay.destroy();
            this.timerDisplay = null;
            this.isGameOver = true;
            this.gameOver();
            this.sound.removeByKey('backgroundSound'); 
        }

        if (this.input.dragElement) {
            this.input.dragElement.x = this.input.activePointer.x;
            this.input.dragElement.y = this.input.activePointer.y;
        }
    }

    spawnCard() {
        let click = this.sound.add('clickSound');
        let wrong = this.sound.add('wrongSound');
        let correct = this.sound.add('correctSound');

        if (this.timerDisplay && this.timerDisplay.getTime() <= 0) {
            return; // exit early if timer reached zero
        }
        let cardNames = ["1_or_11","double","redraw","resurrect","steal","tie_breaker"];
        let randomCardIndex = Phaser.Math.Between(0, cardNames.length - 1);
        let randomCardName = cardNames[randomCardIndex];
        const card = this.add.sprite(0, 850, randomCardName).setScale(0.55).setInteractive();
        card.setData('typeIndex', randomCardIndex);  // Store the index/type of the card

        // When the card is pressed
        card.on('pointerdown', function (pointer) {
            this.setData('isBeingDragged', true);
            click.play();

            // this.setTint(0xff0000); 
        });

        // When the card is released
        card.on('pointerup', function () {
            this.setData('isBeingDragged', false);
            this.clearTint();

            let collidedWithCrate = false;
            let currentScore = parseInt(this.scene.scoreDisplay.scoreText.text);  // Assuming your score is an integer. Adjust as necessary.

            this.scene.crateSprites.forEach((crate, index) => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), crate.getBounds())) {
                    if (this.texture.key === cardNames[index]) { // Only increment counter for matching crate
                        this.scene.crateCounters[index]++;
                        this.scene.matchCount++;
                        this.scene.crateTexts[index].setText(this.scene.crateCounters[index].toString());
                        correct.play();

                        collidedWithCrate = true;
                        
                        
                        currentScore += 1;  // Increase score by 10 for every correct drop. Adjust the value as per your game's logic.
                        this.scene.scoreDisplay.updateScore(currentScore);
                    }
                    else if (currentScore > 0) {
                        currentScore -= 1
                        this.scene.mismatchCount++;
                        wrong.play();
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


    gameOver() {
        let gameover = this.sound.add('gameoverSound');
        gameover.play();

        // Create a semi-transparent black rectangle as the background of the popup
        const rect = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000);
        rect.alpha = 0.75;
        rect.setInteractive();  // prevent cards and other objects from being clicked
        rect.depth = 10;
        
        // Add a round-rectangle
        const roundRect = this.createRoundedRectangle(this, this.scale.width / 2 - 600, this.scale.height / 2 - 550, 1200, 1000, 27, 0x222747, 15, 0x33b9e3);
        roundRect.depth = 11;

        // Add Game Over Text
        const gameOverText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 220, 'GAME OVER!', {
            font: '150px TruculentaBold',
            fill: '#33b9e3'
        });
        gameOverText.setOrigin(0.5); // to center the text on the button
        gameOverText.depth = 15;

        // Add Final Score Text
        const finalScoreText = this.add.text(this.scale.width / 2 - 70, this.scale.height / 2 - 100, 'Final Score:', {
            font: '80px TruculentaBold',
            fill: '#2CF8AE'
        });
        finalScoreText.setOrigin(0.5); // to center the text on the button
        finalScoreText.depth = 15;

        // Add Final Score Number Text
        const finalScoreValue = this.scoreDisplay.scoreText.text;  // Retrieve the current score

        const finalScoreNumText = this.add.text(this.scale.width / 2 + 180, this.scale.height / 2 - 105, finalScoreValue, {
            font: '80px TruculentaBold',
            fill: '#2CF8AE'
        });
        finalScoreNumText.setOrigin(0.5); // to center the text on the button
        finalScoreNumText.depth = 15;
        
        // Add Match Score
        const matchesText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 10, `Matches: ${this.matchCount}`, {
            font: '60px TruculentaBold',
            fill: '#ffffff'
        });
        matchesText.setOrigin(0.5);
        matchesText.depth = 16;

        // Add Mismatch Score
        const mismatchesText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 70, `Mismatches: ${this.mismatchCount}`, {
            font: '60px TruculentaBold',
            fill: '#ffffff'  // Consider a red-ish color for mismatches
        });
        mismatchesText.setOrigin(0.5);
        mismatchesText.depth = 17;

        // Add a logo
        const skullLogo = this.add.image(this.scale.width / 2, this.scale.height / 2 - 500, 'skull').setScale(0.75);
        skullLogo.depth = 13;

        // Add a retry button
        const retryButton = this.add.image(this.scale.width / 2 - 300, this.scale.height / 2 + 200, 'retryButton').setScale(1.2).setInteractive();
        retryButton.on('pointerup', () => {
            this.scene.restart();
            this.isGameOver = false;
        });
        retryButton.depth = 14;

        // Add text for the retry button
        const retryButtonText = this.add.text(this.scale.width / 2 - 300, this.scale.height / 2 + 200, 'PLAY AGAIN', {
            font: '55px TruculentaBold',
            fill: '#000000'
        });
        retryButtonText.setOrigin(0.5); // to center the text on the button
        retryButtonText.depth = 15;

        // Add an exit button
        const exitButton = this.add.image(this.scale.width / 2 + 300, this.scale.height / 2 + 200, 'exitButton').setScale(1.2).setInteractive();
        exitButton.on('pointerup', () => {
            // Debugging
            //localStorage.clear();
            window.location.href = '/'; // Move to Home
        });
        exitButton.depth = 16;

        // Add text for the exit button
        const exitButtonText = this.add.text(this.scale.width / 2 + 300, this.scale.height / 2 + 200, 'EXIT', {
            font: '55px TruculentaBold',
            fill: '#ffffff'
        });

        exitButtonText.setOrigin(0.5); // to center the text on the button
        exitButtonText.depth = 17;

        const purpleFlame_sprite = this.add.sprite(this.scale.width / 2 - 700, this.scale.height / 2 + 200, 'purpleFlame_spritesheet')
        purpleFlame_sprite.setScale(10);
        purpleFlame_sprite.play('purpleFlame_spritesheet_ani');
        purpleFlame_sprite.depth = 18;

        const purpleFlame_sprite1 = this.add.sprite(this.scale.width / 2 + 700, this.scale.height / 2 + 200, 'purpleFlame_spritesheet')
        purpleFlame_sprite1.setScale(10);
        purpleFlame_sprite1.play('purpleFlame_spritesheet_ani');
        purpleFlame_sprite1.depth = 18;
        // Store date and save date
        const currentDate = new Date().toISOString().slice(0, 10);  // gets date in YYYY-MM-DD format
        if (finalScoreValue !== '0') {
            this.saveGameData(finalScoreValue, currentDate);
        }
    }
}