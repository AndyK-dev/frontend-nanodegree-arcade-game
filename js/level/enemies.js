/**
 * This abstract class should not be instantiated.
 * Instead use its inheritors Player or BugEnemy
 */
class Enemy {
    /**
     * Constructor
     *
     * @param sprite
     * @param width
     * @param height
     * @param collisionRectScale parameter to make enemy's/player's collision rect smaller.
     *  Used to make enemies smaller and to make game play more comfortable.
     */
    constructor(sprite, width, height, collisionRectScale) {
        this.sprite = sprite;
        this.rect = new Rectangle(width, height, collisionRectScale);
        this.reset();
    }

    getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Reset enemy to default state
     */
    reset() {
        this.resetPosition();
    }

    /**
     * Reset enemy position, row and speed
     */
    resetPosition() {
        this.movement = this.getRandomInteger(200, 300);
        this.row = this.getRandomInteger(1, 3);
        let x = 0;
        let y = (171 / 2) * this.row + this.rect.height / 2;

        this.rect.update(x, y);
    }

    /**
     * Draw on the screen using canvas
     */
    render() {
        ctx.drawImage(res.get(this.sprite), this.rect.left, this.rect.top);
        // this.rect.drawCollisionBorder();
    }

    /**
     * Update enemy position.
     * Any movement should be multiplied by the dt.
     * This will ensure the game runs at the same speed for all computers
     * This method is called every game tick, so no object should be created inside this method
     *
     * @param dt a time delta between game ticks
     */
    update(dt) {
        let x = this.rect.left + this.movement * dt;
        if (x >= engine.canvas.width) {
            this.resetPosition();
        } else {
            this.rect.update(x, this.rect.top);
        }
    }
}

class BugEnemy extends Enemy {
    constructor(collisionRectScale) {
        super('img/enemy_bug.png', 98, 77, collisionRectScale);
    }
}

class SharkFinEnemy extends Enemy {
    constructor(collisionRectScale, row) {
        super('img/enemy_shark_fin.png', 85, 80, collisionRectScale);
        this.row = row;
        this.spriteNormal = 'img/enemy_shark_fin.png';
        this.spriteRevert = 'img/enemy_shark_fin_revert.png';
        this.sprite = this.spriteNormal;
        this.direction = 1;
    }

    /**
     * Reset enemy position, row and speed
     */
    resetPosition() {
        this.movement = this.getRandomInteger(200, 300);
        let x = 0;
        let y = (171 / 2) * this.row + this.rect.height / 2;

        this.rect.update(x, y);
    }

    update(dt) {
        if (this.rect.left <= 0) {
            this.sprite = this.spriteNormal;
            this.direction = 1;
            this.movement = this.getRandomInteger(200, 300);
        } else if (this.rect.right >= engine.canvas.width) {
            this.sprite = this.spriteRevert;
            this.direction = -1;
            this.movement = this.getRandomInteger(200, 300);
        }

        let x = this.rect.left + this.movement * dt * this.direction;
        this.rect.update(x, this.rect.top);
    }
}
