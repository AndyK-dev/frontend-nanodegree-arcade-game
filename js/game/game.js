class Game {
    constructor() {
        document.addEventListener('keyup', event => this.handleInput(event.keyCode));

        // define constants
        this.STATE_NORMAL = 'STATE_NORMAL';
        this.STATE_LOOSING_LIFE = 'STATE_LOOSING_LIFE';

        let player = new Player();

        this.allLevels = [
            new Level_1(player),
            new Level_2(player),
            new Level_3(player),
            new Level_4(player),
            new Level_5(player),
            new Level_6(player)
        ];
        this.currentLevel = this.allLevels[0];

        this.gameStateObjects = new Map([
            ['score', new ScoreText()],
            ['lvl', new LvlText()],
            ['heart', new HeartImage()],
            ['lives', new LivesText()],
            ['pauseMsg', new PauseBottomMessage()]
        ]);

        this.gameLost = false;
        this.gameWon = false;
        this.paused = false;

        this.initLevel();
    }

    resetGame() {
        this.allLevels.forEach(level => level.reset());
        this.currentLevel = this.allLevels[0];
        this.currentLevel.initLevel();

        this.gameStateObjects.forEach(obj => obj.reset());

        this.gameLost = false;
        this.gameWon = false;
        this.paused = false;
    }

    initLevel() {
        let lvl = this.gameStateObjects.get('lvl').lvl;
        this.currentLevel = this.allLevels[lvl - 1];
        this.currentLevel.initLevel();
    }

    /**
     * Update game objects positions
     *
     * @param dt
     */
    update(dt) {
        this.currentLevel.update(dt);
        this.gameStateObjects.forEach(obj => obj.update(dt));
    }

    isRunning() {
        return !this.paused && !this.gameLost && !this.gameWon;
    }

    /**
     * First draw all game objects.
     * And if the game is won or lost, then show showWinDialog/showLooseDialog dialog
     */
    render() {
        this.currentLevel.render();
        this.gameStateObjects.forEach(obj => obj.render());

        if (this.gameWon) {
            this.showWinDialog();
        } else if (this.gameLost) {
            this.showLooseDialog();
        }
    }

    showWinDialog() {
        this.setPause(true);
        engine.showDialog('You Did It!', 'Press \'Enter\' to Play Again');
    }

    showLooseDialog() {
        this.setPause(true);
        engine.showDialog('Game Over!', 'Press \'Enter\' to Play Again');
    }

    winLevel() {
        this.gameStateObjects.get('score').addScore(500);
        this.gameStateObjects.get('lvl').increaseLvl();
        this.initLevel();
    }

    addBonus(bonus) {
        this.gameStateObjects.get('score').addScore(bonus.bonusScore);
        this.gameStateObjects.get('lives').addLives(bonus.bonusLives);
    }

    /**
     * Loose life.
     * Change image.
     * Set pause for 0.2 sec.
     * After timeout resetGame to default state
     */
    setGameState(state) {
        let lives = this.gameStateObjects.get('lives');

        switch (state) {
            case this.STATE_NORMAL:
                lives.setStrokeColor(lives.colorWhite);
                if (lives.lives <= 0) {
                    this.gameLost = true;
                }
                break;
            case this.STATE_LOOSING_LIFE:
                lives.setStrokeColor(lives.colorYellow);
                lives.looseLife();
                break;
        }
    }

    /**
     * Set paused on/off
     */
    setPause(pause) {
        this.paused = pause;
        this.paused ? engine.stop() : engine.start();
    }

    /**
     * Handle keyboard input.
     *
     * @param keyCode
     */
    handleInput(keyCode) {
        let allowedKeys = {
            80: 'pause',
            13: 'enter'
        };

        switch (allowedKeys[keyCode]) {
            case 'pause':
                if (!this.gameLost && !this.gameWon) {
                    this.setPause(!this.paused);
                    engine.showDialog('Pause', 'Press \'p\' to resume');
                }
                break;
            case 'enter':
                if (this.gameLost || this.gameWon) {
                    this.resetGame();
                    engine.start();
                }
                break;
            default:
                if (this.isRunning()) {
                    this.currentLevel.handleInput(keyCode);
                }
        }
    }
}

// todo refactor initialization and reset functions

// choose player

// all happy
// flying hearts

// jsdocs

// babel
