// Creacion de los elementos pertenecientes al canvas
var board = new Board(800, 400);
var bar = new Bar(20, 150, 20, 100,"green", board);
var bar_2 = new Bar(760, 150, 20, 100,"red", board);
var ball = new Ball(400,200,10,"orange",board);

var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas, board);

// Listener para activar eventos con el teclado
document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowUp") {
        bar_2.up();

    } else if (event.key == "ArrowDown") {
        bar_2.down();

    } else if (event.key == "w") {
        bar.up();

    } else if (event.key == "s") {
        bar.down();

    } else if (event.key === " " ){
        board.playing = !board.playing;
    }
    event.preventDefault();
})


window.requestAnimationFrame(controller);

/**
 * Funcion para refrescar los frames del juego y permitir un flujo ininterrumpido de la pelota
 * por toda el area del juego
 */
function controller() {
    board_view.play();
    window.requestAnimationFrame(controller);
}
