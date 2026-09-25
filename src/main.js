import Phaser from "phaser";

class PlanetScene extends Phaser.Scene {
    constructor() {
        super("PlanetScene");
    }

    preload() {
        this.load.image("planetA", "/assets/planets/planet-A.png");
        this.load.image("planetB", "/assets/planets/planet-B.png");
        this.load.image("rocketA", "/assets/rockets/rocket-A.png");
    }

    create() {

        // ⭐ Background stars (static)
        this.bgStars = this.add.graphics();
        this.stars = [];

        for (let i = 0; i < 200; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const size = Phaser.Math.FloatBetween(0.5, 2);
            const alpha = Phaser.Math.FloatBetween(0.3, 1);

            this.stars.push({ x, y, size, alpha });

            this.bgStars.fillStyle(0xffffff, alpha);
            this.bgStars.fillCircle(x, y, size);
            this.bgStars.fillStyle(0xffffff, alpha * 0.3);
            this.bgStars.fillCircle(x, y, size * 3);
            this.bgStars.fillStyle(0xffffff, alpha * 0.1);
            this.bgStars.fillCircle(x, y, size * 6);
        }

        // ✨ Twinkle layer
        this.twinkle = this.add.graphics();
        this.starTimer = 0;

        // 🪐 Planets
        this.planets = [];

        const p1 = this.add.sprite(300, 300, "planetA").setScale(0.2);
        const p2 = this.add.sprite(600, 300, "planetB").setScale(0.1);

        this.planets.push(p1, p2);

        // 🚀 Rocket
        this.rocket = this.add.sprite(100, 300, "rocketA").setScale(0.1);

        // ⌨️ Input
        this.keys = this.input.keyboard.addKeys("A,S,D,F");
    }

    update() {

        // ⭐ Twinkle animation
        this.starTimer += 0.02;
        this.twinkle.clear();

        for (let i = 0; i < this.stars.length; i++) {
            const s = this.stars[i];

            const alpha = s.alpha * (0.5 + 0.5 * Math.sin(this.starTimer + i));

            this.twinkle.fillStyle(0xffffff, alpha);
            this.twinkle.fillCircle(s.x, s.y, s.size);
        }

        // 🚀 Rocket movement
        if (this.keys.S.isDown) {
            this.rocket.x += 3;
        }

        // 🪐 Planet A tint on key A
        if (this.keys.A.isDown) {
            this.planets[0].setTint(0xff0000);
        }

        // 🪐 Planet A reaction when rocket is close
        const p = this.planets[0];

        if (!p.isReacting &&
            Phaser.Math.Distance.Between(
                this.rocket.x, this.rocket.y,
                p.x, p.y
            ) < 80) {

            p.isReacting = true;
            this.rocket.x -= 10; // pushback

            this.tweens.add({
                targets: p,
                scale: p.scale * 1.3,
                duration: 200,
                yoyo: true,
                onComplete: () => {
                    p.isReacting = false;
                }
            });
        }
    }
}

new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#000000",
    scene: PlanetScene
});
