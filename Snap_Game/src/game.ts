class Game {

    players: HTMLImageElement[][] = [];

    dealtPile: HTMLImageElement[] = [];

    playerTurn: number = 0;

    constructor() {
        var imagesCopy = this.shuffle(cards.slice());
        this.players.push([]);
        this.players.push([]);
        // split into two
        for (var i = 0; i < imagesCopy.length / 2; i++) {
            this.players[0].push(imagesCopy[i]);
        }
        for (var i = imagesCopy.length / 2; i < imagesCopy.length; i++) {
            this.players[1].push(imagesCopy[i]);
        }
    }

    public getPileTopCard(): HTMLImageElement {
        if (this.dealtPile.length === 0) return special[1];
        return this.dealtPile[this.dealtPile.length - 1];
    }

    public getTopCard(player: number): HTMLImageElement {
        if (this.players[player].length === 0) return special[1];
        return this.players[player][this.players[player].length - 1];
    }

    public getPileCount(): number {
        return this.dealtPile.length;
    }

    public getCardCount(player: number): number {
        return this.players[player].length;
    }

    public deal(player: number) {
        if (this.getWinner() !== -1) return;
        if (player === this.playerTurn) {
            this.dealtPile.push(this.players[this.playerTurn].pop());
            this.playerTurn++;
            this.playerTurn %= this.players.length;
        }
    }

    // returns the ID of a card
    // e.g. http://localhost/Snap_Game/src/cards/Club2.JPG => Club2
    private getId(image: HTMLImageElement): [string, number] {
        var match = /\/([A-z]+)(\d+)\.JPG/.exec(image.src);
        return [match[1], Number(match[2])];
    }

    // only matches the number, not the suit
    private correctSnap(): boolean {
        if (this.dealtPile.length <= 1) return false;
        var card1 = this.dealtPile[this.dealtPile.length - 1];
        var card2 = this.dealtPile[this.dealtPile.length - 2];
        return this.getId(card1)[1] === this.getId(card2)[1];
    }

    // returns -1 if no winner
    // otherwise returns the index of the winner
    public getWinner(): number {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].length === 0) {
                return i;
            }
        }
        return -1;
    }

    public snap(player: number) {
        if (this.correctSnap()) {
            // player wins current match
            // give the dealt pile to the other player
            for (var i = 0; i < this.dealtPile.length; i++) {
                var card = this.dealtPile[i];
                for (var j = 0; j < this.players.length; j++) {
                    if (j !== player) {
                        this.players[j].push(card);
                    }
                }
            }
        } else {
            // player loses current match
            // player takes the dealt pile
            for (var i = 0; i < this.dealtPile.length; i++) {
                var card = this.dealtPile[i];
                this.players[player].push(card);
            }
        }
        this.dealtPile = [];
    }

    // fisher-yates shuffle
    private shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

}