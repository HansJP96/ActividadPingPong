function generalDraw(ctx, element) {
    switch (element.kind) {
        case "rectangle":
            ctx.fillRect(element.x, element.y, element.width, element.height);
            break;
        case "circle":
            ctx.beginPath();
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
    if (b.x + b.width >= a.x + a.width && b.x <= a.x + a.width) {
        //Colisiones verticales
        if (b.y + b.height >= a.y && b.y <= a.y + a.height) {
            hit = true
        }
    }

    //Colision de a con b
    if (b.x <= a.x  && b.x + b.width >= a.x + a.width) {
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
    return hit;
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
        for (let i = this.board.bars.length - 1; i >= 0; i--) {
            let bar = this.board.bars[i];
            if (hit(bar, this.board.ball)) {
                this.board.ball.collisions(bar);
            }
        }
    }


}

class Bar {
    constructor(x, y, width, height, board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 8;
    }

    down() {
        this.y += this.speed;
    }

    up() {
        this.y -= this.speed;
    }

    toString() {
        return `x: ${this.x} , y: ${this.y}`;
    }
}

class Ball {
    constructor(x, y, radius, board) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 2;
        this.board = board;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 2;

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

    collisions(bar) {
        //Reacciona a la colision con una barra que recibe como parametro
        let relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;

        let normalized_intersect_y = relative_intersect_y / (bar.height / 2);;
        this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

        this.speed_y = this.speed * -Math.sin(this.bounce_angle);
        this.speed_x = this.speed * Math.cos(this.bounce_angle);

        if (this.x > (this.board.width / 2)) this.direction = -1;
        else this.direction = 1;

    }
}


