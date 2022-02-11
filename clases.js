/**
 * Funcion para crear los elementos dentro del canvas
 * @param {HTMLCanvasElement} ctx Elemento canvas principal del HTML
 * @param {Array.<object>} element Arreglo que contiene bbjetos de clase como Bar, Ball, Board
 */
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
/**
 * Funcion para comprobar si existe colicion de un elemento a con otro elemento b.
 * @param {object} a Elemento a: Puede ser una clase Board, Bar, Ball
 * @param {object} b Elemento a: Puede ser una clase Board, Bar, Ball
 * @returns 
 */
function hit(a, b) {
    //Revisa si a colisiona con b
    var hit = false;
    //Colisiones horizontales 
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

    //condicion que verifica si la pelota choca contra un borde superior o inferior
    if (a.playing) {

        if (b.y - b.height / 2 <= 0 || b.y >= a.height - b.height / 2) {
            hit = true
        }
    }

    return hit;
}

/**
 * Clase que permite crear un tablero en el canvas del HTML
 */
class Board {
    constructor(width, height) {
        this.x = 0;
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }

    /**
     * Metodo que retorna un arreglo de objetos a dibujar en el canvas
     * @returns {Array.<object>}
     */
    elements() {
        var elements = this.bars.map((barElement) => barElement);
        elements.push(this.ball);
        return elements;
    }
}

/**
 * Clase que permite la integracion y dibujo de los distintos elementos del canvas
 * y controla el flujo de actualizacion de elementos
 */
class BoardView {
    constructor(canvas, board) {
        this.canvas = canvas;
        this.board = board;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.ctx = canvas.getContext("2d");
    }

    /**
     * Metodo que limpia el tablero para no crear objetos duplicados
     */
    clean() {
        this.ctx.clearRect(0, 0, this.board.width, this.board.height)
    }

    /**
     * Metodo que reccore un arreglo de objetos para dibujar en el canvas
     */
    draw() {

        for (let i = this.board.elements().length - 1; i >= 0; i--) {
            let el = this.board.elements()[i];
            generalDraw(this.ctx, el);
        }
    }

    /**
     * Metodo que permite establecer el flujo de actualizacion de los elementos del canvas
     */
    play() {
        this.clean();
        this.draw();
        this.check_collisions();
        if (this.board.playing) {
            this.board.ball.move();
        }

    }

    /**
     * Metodo que verifica las colisiones entre elementos del canvas
     */
    check_collisions() {
        if (hit(this.board, this.board.ball)) {
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

/**
 * Clase que crea las barras para jugar
 */
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
    /**
     * Metodo que permite mover las barras mediante la tecla "flecha abajo" o "s" 
     * hacia abajo dentro del canvas
     */
    down() {
        if (!this.collisionsBoardDown()) {
            this.y += this.speed;
        }
    }
    /**
     * Metodo que permite mover las barras mediante la tecla "flecha arriba" o "w" 
     * hacia arriba dentro del canvas 
     */
    up() {
        if (!this.collisionsBoardUp()) {
            this.y -= this.speed;
        }
    }

    /**
     * Metodo que verifica si las barras chocan con el borde superior del tablero/canvas
     * @returns {boolean}
     */
    collisionsBoardUp() {
        if (this.y <= 0) {
            return true
        } else return false
    }

    /**
     * Metodo que verifica si las barras chocan con el borde inferior del tablero/canvas
     * @returns {boolean}
     */
    collisionsBoardDown() {
        if (this.y + this.height >= this.board.height) {
            return true
        } else return false
    }

    /**
     * Metodo que retorna un string de los coordendas de la barra
     * @returns {String}
     */
    toString() {
        return `x: ${this.x} , y: ${this.y}`;
    }
}

/**
 * Clase que crea la pelota para interactuar en el juego
 */
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
    /**
     * Getter que retorna el ancho de la pelota
     */
    get width() {
        return this.radius * 2;
    }

    /**
     * Getter que retorna el alto de la pelota
     */
    get height() {
        return this.radius * 2;
    }

    /**
     * Metodo que permite el movimiento de la pelota en el tablero
     */
    move() {
        this.x += (this.speed_x * this.direction);
        this.y += this.speed_y;
    }

    /**
     * Metodo que permite calcular el angulo y direccion de la pelota cuando colisiona con un objeto
     * @param {object} objectClass 
     */
    collisions(objectClass) {
        //Reacciona a la colisiones de la pelota con una barra que recibe como parametro
        switch (objectClass.constructor.name) {
            //Reacciona a la colisiones con una barra que recibe como parametro
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


}


