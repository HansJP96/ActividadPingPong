function generalDraw(ctx, element){
    switch (element.kind) {
        case "rectangle":
            ctx.fillRect(element.x,element.y,element.width,element.height);
            break;
    
        default:
            break;
    }
}
  
class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }

    elements(){
        let elements = this.bars;
        //elements.push(this.ball);
        return elements;
    }
}

class BoardView{
    constructor(canvas, board){
        this.canvas = canvas;
        this.board = board;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.ctx = canvas.getContext("2d");
    }

    clean(){
        this.ctx.clearRect(0,0,this.board.width, this.board.height)
    }

    draw(){
       for (let i = this.board.elements().length -1 ; i >= 0; i--) {
           let el = this.board.elements()[i];
           generalDraw(this.ctx,el);
       }
    }

}

class Bar{
    constructor(x,y,width,height,board){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.board=board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed= 10;
    }
  
    down(){
        this.y += this.speed;
    }
  
    up(){
        this.y -= this.speed;
    }
  
    toString(){
        return `x: ${this.x} , y: ${this.y}`;
    }
  }


