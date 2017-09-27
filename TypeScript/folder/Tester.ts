class Tester {

    private x: number;

    constructor() {
        this.x = 0;
    }

    public render(): void {
        graphics.beginFill(0xffffff);
        graphics.drawRect(this.x, 0, 100, 100);
        this.x += 1;
    }

}