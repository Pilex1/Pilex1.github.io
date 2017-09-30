class GuidePlatform extends Platform {
    constructor() {
        super([50, 50]);
        this.strokeColor = new Color(0x000000);
        this.fillColor = new Color(0xffffff, 0.5);
    }
}

class GuideRemovalPlatform extends Platform {
    constructor() {
        super([50, 50]);
        this.strokeColor = new Color(0xff3a68);
        this.fillColor = new Color(0xffffff, 0.2);
    }
}