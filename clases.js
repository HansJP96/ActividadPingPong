function generalDraw(ctx, element) {
    switch (element.kind) {
        case "rectangle":
            ctx.fillStyle = element.color;
            ctx.fillRect(element.x, element.y, element.width, element.height);
            ctx.strokeStyle = "gray";
            ctx.lineWidth = 2;
            ctx.strokeRect(element.x, element.y, element.width, element.height);
            break;
        case "circle":
            ctx.beginPath();
            ctx.fillStyle = element.color;
            ctx.arc(element.x, element.y, element.radius, 0, 7);
            ctx.fill();
            ctx.closePath();
            break;
        default:
            break;
    }
}

function hit(a, b) {
    //Revisa si a colisiona con b
    var hit = false;
    //Colisiones horizontales (primer a.x + a.width mejora colision)
    if (b.x + b.width / 2 >= a.x && b.x - b.width / 2 <= a.x + a.width) {
        //Colisiones verticales
        if (b.y + b.height >= a.y && b.y <= a.y + a.height) {
            hit = true
        }
    }

    //Colision de a con b
    if (b.x - b.width <= a.x && b.x + b.width >= a.x + a.width) {
        if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
            hit = true
        }
    }
    //Colision de b con a
    if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
        if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
            hit = true
        }
    }

    if (a.playing) {

        if (b.y - b.height / 2 <= 0 || b.y >= a.height - b.height / 2) {
            hit = true
        }
    }

    return hit;
}

class Board {
    constructor(width, height, color) {
        this.x = 0;
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }

    elements() {
        var elements = this.bars.map((barElement) => barElement);
        elements.push(this.ball);
        return elements;
    }
}

class BoardView {
    constructor(canvas, board) {
        this.canvas = canvas;
        this.board = board;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.ctx = canvas.getContext("2d");
    }

    clean() {
        this.ctx.clearRect(0, 0, this.board.width, this.board.height)
    }

    draw() {

        for (let i = this.board.elements().length - 1; i >= 0; i--) {
            let el = this.board.elements()[i];
            generalDraw(this.ctx, el);
        }
    }

    play() {
        this.clean();
        this.draw();
        this.check_collisions();
        if (this.board.playing) {
            this.board.ball.move();
        }

    }

    check_collisions() {
        if (hit(this.board, this.board.ball)) {
            console.log("asd")
            this.board.ball.collisions(this.board);
        }
        for (let i = this.board.bars.length - 1; i >= 0; i--) {
            let bar = this.board.bars[i];
            if (hit(bar, this.board.ball)) {
                this.board.ball.collisions(bar);
            }

        }
    }


}

class Bar {
    constructor(x, y, width, height, color, board) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 8;
    }

    down() {
        if (!this.collisionsBoardDown()) {
            this.y += this.speed;
        }
    }

    up() {
        if (!this.collisionsBoardUp()) {
            this.y -= this.speed;
        }
    }

    collisionsBoardUp() {
        if (this.y <= 0) {
            return true
        } else return false
    }

    collisionsBoardDown() {
        if (this.y + this.height >= this.board.height) {
            return true
        } else return false
    }

    toString() {
        return `x: ${this.x} , y: ${this.y}`;
    }
}

class Ball {
    constructor(x, y, radius, color, board) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 3;

        this.board.ball = this;
        this.kind = "circle";
    }
    get width() {
        return this.radius * 2;
    }

    get height() {
        return this.radius * 2;
    }

    move() {
        this.x += (this.speed_x * this.direction);
        this.y += this.speed_y;
    }

    collisions(objectClass) {
        console.log(this.bounce_angle)
        //Reacciona a la colisiones de la pelota con una barra que recibe como parametro
        switch (objectClass.constructor.name) {
            //Reacciona a la colisione con una barra que recibe como parametro
            case "Bar":

                let relative_intersect_y = (objectClass.y + (objectClass.height / 2)) - this.y;

                let normalized_intersect_y = relative_intersect_y / (objectClass.height / 2);
                this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

                this.speed_y = this.speed * -Math.sin(this.bounce_angle);
                this.speed_x = this.speed * Math.cos(this.bounce_angle);

                if (this.x > (this.board.width / 2)) this.direction = -1;
                else this.direction = 1;

                break;
            case "Board":
                //Reacciona a la colision con el tablero que recibe como parametro
     
                    this.speed_y = this.speed * Math.sin(this.bounce_angle);
   
                break;
        }

    }

    collisionsbbb() {
        this.speed_y = this.speed * Math.sin(this.bounce_angle);
    }

}


