
var board = new Board(700, 400);
var bar = new Bar(20, 150, 40, 100, board);
var bar_2 = new Bar(640, 150, 40, 100, board);
var ball = new Ball(350,200,10,board);

var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas, board);


document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowUp") {
        bar.up();
    } else if (event.key == "ArrowDown") {
        bar.down();

    } else if (event.key == "w") {
        bar_2.up();

    } else if (event.key == "s") {
        bar_2.down();
    } else if (event.key === " " ){
        board.playing = !board.playing;
    }
    event.preventDefault();
})

window.requestAnimationFrame(controller);

function controller() {
    board_view.play();
    window.requestAnimationFrame(controller);
}
