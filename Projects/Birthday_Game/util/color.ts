class Color {
    value: number;
    alpha: number;
    constructor(value: number, alpha?: number) {
        this.value = value;
        this.alpha = alpha || 1;
    }
}