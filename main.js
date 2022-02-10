

window.addEventListener("load", main)


function main() {

    var board = new Board(700, 400);


    var canvas = document.getElementById("canvas");
    var board_view = new BoardView(canvas, board);
    


    board_view.draw();
}
