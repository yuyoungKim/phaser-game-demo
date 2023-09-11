import Phaser from 'phaser';
import Score from './classes/Score.js';
export class Load extends Phaser.Scene {
    constructor() {
        super({
            key: 'Load'
        });
        this.cards = [];
        this.timer = 60;
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

        // Insert crates
        const crates = [];
        for (let i = 0; i < 6; i++) {
            const x = width * (0.1 + (i % 6 * 0.15));
            const y = height * (i < 6 ? 0.8 : 0.65);
            const crate = this.add.sprite(x, y, 'crate').setScale(0.75)
            crates.push(crate);
        }

        // Insert cards
        let cards = ["1_or_11","double","redraw","resurrect","steal","tie_breaker"];
        for (let i = 0; i < 6; i++) {
            const x = width * (0.1 + (i % 6 * 0.15));
            const y = height * (i < 6 ? 0.84 : 0.65);
            const card = this.add.sprite(x, y, cards[i]).setScale(0.3)
            crates.push(card);
        }
        
        //Insert Scoreboard
        const score = 100;
        this.add.score(500, 100, 1, 0, score);


        // Generate random cards from left to right
            // Set up a repeating timer to spawn a card every 2 seconds
        this.time.addEvent({
            delay: 750,
            callback: this.spawnCard,
            callbackScope: this,
            loop: true
        });

        // 60 seconds countdown timer
        this.time.addEvent({
            delay: 1000,
            callback: this.countdown,
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

        if (this.timer <= 0 && this.spawnEvent) {
            this.spawnEvent.remove();
            this.spawnEvent = null;
        }

        if (this.input.dragElement) {
            this.input.dragElement.x = this.input.activePointer.x;
            this.input.dragElement.y = this.input.activePointer.y;
        }
    }

    spawnCard() {
        let cardNames = ["1_or_11","double","redraw","resurrect","steal","tie_breaker"];
        let randomCard = Phaser.Math.RND.pick(cardNames);
        const card = this.add.sprite(0, 850, randomCard).setScale(0.55).setInteractive();

        // When the card is pressed
        card.on('pointerdown', function (pointer) {
            this.setData('isBeingDragged', true);
            this.setTint(0xff0000); 
        });

        // When the card is released
        card.on('pointerup', function () {
            this.setData('isBeingDragged', false);
            this.clearTint();
            this.x = this.getData('startPosX');  // Reset the x position to its original
            this.y = this.getData('startPosY');  // Reset the y position to its original
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
    
    countdown() {
        this.timer--;

        if (this.timer <= 0 && this.countdownEvent) {
            this.countdownEvent.remove();
            this.countdownEvent = null;
        }
    }
    
    
}