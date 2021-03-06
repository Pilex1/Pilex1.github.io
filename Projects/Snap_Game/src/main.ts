var cards: HTMLImageElement[] = [];
var special: HTMLImageElement[] = [];
var game: Game;

var loadCount: number = 0;

// works on localhost, doesn't work on GitHub :(
// no directory indexing
function loadImages(dir: string, arr: HTMLImageElement[]): void {
    var fileextension = ".JPG";
    $.ajax({
        //This will retrieve the contents of the folder if the folder is configured as 'browsable'
        url: dir,
        success: function (data) {
            //List all .JPG file names in the page
            $(data).find("a").attr("href", function (i, val) {
                if (val.match(".+JPG")) {
                    loadImg(dir + val, arr);
                }
            });
        }
    });
}

function loadImg(file: string, arr: HTMLImageElement[]): void {
    var img = new Image();
    $(img).attr({ src: file });
    $(img).on("load", () => {
        arr.push(img);
        loadCount++;
        // $("main").append($(img));
        if (loadCount === 56) {
            // when all the images have finished loading we start the game
            startGame();
        }
    });
}

function startGame() {
    game = new Game();

    $("#div0 .turn").text("YOUR TURN.");

    var updateGraphics = () => {
        $("#divPile img").attr("src", game.getPileTopCard().src);

        $("#div0 .cardInfo").text("Player 1 - " + game.getCardCount(0) + " cards.");
        $("#div1 .cardInfo").text("Player 2 - " + game.getCardCount(1) + " cards.");
        $("#divPile .cardInfo").text("Dealt pile - " + game.getPileCount() + " cards.");

        $("#div0 .turn").text(game.playerTurn === 0 ? "YOUR TURN." : "");
        $("#div1 .turn").text(game.playerTurn === 1 ? "YOUR TURN." : "");

        var winner = game.getWinner();
        if (winner === 0) {
            $("#div0 .cardInfo").text("YOU WON!");
            $("#div1 .cardInfo").text("YOU LOST");
            $("#div0 img").attr("src", "src/special/MasterCardPile.JPG");

            $("#div0 .turn").text("");
            $("#div1 .turn").text("");
        } else if (winner === 1) {
            $("#div0 .cardInfo").text("YOU LOST!");
            $("#div1 .cardInfo").text("YOU WON");
            $("#div1 img").attr("src", "src/special/MasterCardPile.JPG");

            $("#div0 .turn").text("");
            $("#div1 .turn").text("");
        }
    }

    $("main").on("keydown", (e) => {
        if (e.key.toLowerCase() === "a") {
            game.deal(0);
            updateGraphics();
        }
        if (e.key.toLowerCase() === "l") {
            game.deal(1);
            updateGraphics();
        }

        if (e.key.toLowerCase() === "d") {
            game.snap(0);
            updateGraphics();
        }
        if (e.key.toLowerCase() === "j") {
            game.snap(1);
            updateGraphics();
        }
    });
}

function init(): void {
    for (var i = 2; i <= 14; i++) {
        loadImg("src/cards/Club" + i + ".JPG", cards);
        loadImg("src/cards/Diamond" + i + ".JPG", cards);
        loadImg("src/cards/Heart" + i + ".JPG", cards);
        loadImg("src/cards/Spade" + i + ".JPG", cards);
    }
    loadImg("src/special/BackOfCard.JPG", special);
    loadImg("src/special/MasterCardPile.JPG", special);
    loadImg("src/special/Player1Snap.JPG", special);
    loadImg("src/special/Player2Snap.JPG", special);
}