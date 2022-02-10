

window.addEventListener("load", main)


function main() {

    var board = new Board(700, 400);
    var bar = new Bar(20, 100, 40, 100, board);
    var bar_2 = new Bar(635, 100, 40, 100, board);


    var canvas = document.getElementById("canvas");
    var board_view = new BoardView(canvas, board);


    document.addEventListener("keydown", (ev) => {
        if (ev.key == "ArrowUp") {
            bar.up();
        } else if (ev.key == "ArrowDown") {
            bar.down();

        } else if (ev.key == "w") {
            bar.up();

        } else if (ev.key == "s") {
            bar.down();
        }
        console.log(""+bar)
    })


    board_view.draw();
    window.requestAnimationFrame(main);
}
