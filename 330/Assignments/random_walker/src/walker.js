class Walker {
    constructor(x, y, color = "white", width = 5) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
    }

    flipWeightedCoin(weight = 0.5) {
        return Math.random() < weight;
    }

    move() {
        if (this.flipWeightedCoin()) {
            this.x += this.flipWeightedCoin() ? -this.width : this.width;
        } else {
            this.y += this.flipWeightedCoin() ? -this.width : this.width;
        }
    }


}