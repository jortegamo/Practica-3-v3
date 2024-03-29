var sprites = {
    ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
    missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 }
};

var startGame = function() {
    Game.setBoard(0,new Starfield(20,0.4,100,true))
    Game.setBoard(1,new Starfield(50,0.6,100))
    Game.setBoard(2,new Starfield(100,1.0,50));
    Game.setBoard(3,new TitleScreen("Alien Invasion", 
                                    "Press fire to start playing",
                                    playGame));
}


var playGame = function() {
    var board = new GameBoard();
    board.add(new PlayerShip());
    Game.setBoard(3,board);
}


// Si se construye con clear==true no se pintan estrellas con fondo
// transparente, sino fondo en negro
var Starfield = function(speed,opacity,numStars,clear) {

    // Creamos un objeto canvas, no visible en la p�gina Web
    var stars = $('<canvas/>')
	.attr('width', Game.width)
	.attr('height', Game.height)[0];
    // Sin jQuery lo hacemos asi:
    //    var stars = document.createElement("canvas");
    //    stars.width = Game.width; 
    //    stars.height = Game.height;


    var starCtx = stars.getContext("2d");

    var offset = 0;

    // Si la opci�n clear est� activada, el fondo del canvas se pinta
    // de negro. Utilizado en el nivel mas profundo de estrellas
    if(clear) {
	starCtx.fillStyle = "#000";
	starCtx.fillRect(0,0,stars.width,stars.height);
    }

    // Dibujamos las estrellas blancas sobre el canvas no visible,
    // como rect�ngulos de 2 pixeles en posiciones aleatorias
    starCtx.fillStyle = "#FFF";
    starCtx.globalAlpha = opacity; // nivel de transparencia de las estrellas
    for(var i=0;i<numStars;i++) {
	starCtx.fillRect(Math.floor(Math.random()*stars.width),
			 Math.floor(Math.random()*stars.height),
			 2,
			 2);
    }

    // Se llama a este m�todo en cada frame de la animaci�n para dibujar
    // el campo de estrellas en la pantalla
    this.draw = function(ctx) {
	var intOffset = Math.floor(offset);
	var remaining = stars.height - intOffset;

	// Dibujar sobre el contexto ctx la parte de arriba del canvas con
	// las estrellas
	if(intOffset > 0) {
	    ctx.drawImage(stars,
			  0, remaining,
			  stars.width, intOffset,
			  0, 0,
			  stars.width, intOffset);
	}

	// Dibujar sobre el contexto ctx la parte inferior del canvas con
	// las estrellas
	if(remaining > 0) {
	    ctx.drawImage(stars,
			  0, 0,
			  stars.width, remaining,
			  0, intOffset,
			  stars.width, remaining);
	}
    }

    // En cada paso de la animaci�n, movemos el campo de estrellas
    // modificando el offset seg�n la cantidad de tiempo transcurrida
    this.step = function(dt) {
	offset += dt * speed; // velocidad = espacio / tiempo
	offset = offset % stars.height;
    }
}


// La clase PlayerShip tambien ofrece la interfaz step(), draw() para
// poder ser dibujada desde el bucle principal del juego
var PlayerShip = function() { 
    this.w =  SpriteSheet.map['ship'].w;
    this.h =  SpriteSheet.map['ship'].h;
    this.x = Game.width/2 - this.w / 2;
    this.y = Game.height - 10 - this.h;
    this.vx = 0;
    
	var up = false;
    this.reloadTime = 0.25;  // Un cuarto de segundo para poder volver a disparar
    this.reload = this.reloadTime;

    this.maxVel = 200;

    this.step = function(dt) {

	if(Game.keys['left']) { this.vx = -this.maxVel; }
	else if(Game.keys['right']) { this.vx = this.maxVel; }
	else { this.vx = 0; }

	this.x += this.vx * dt;

	if(this.x < 0) { this.x = 0; }
	else if(this.x > Game.width - this.w) { 
	    this.x = Game.width - this.w 
	}
	if (!Game.keys['fire']){
		up = true;
		this.reload-=dt;
	}
	if(up && Game.keys['fire'] && this.reload < 0) {
	    // Esta pulsada la tecla de disparo y ya ha pasado el tiempo reload
	    this.reload = this.reloadTime;

	    // Se a�aden al gameboard 2 misiles 
	    this.board.add(new PlayerMissile(this.x,this.y+this.h/2));
	    this.board.add(new PlayerMissile(this.x+this.w,this.y+this.h/2));
	}
    }

    this.draw = function(ctx) {
	SpriteSheet.draw(ctx,'ship',this.x,this.y,0);
    }
}

// Constructor los misiles.
// Los metodos de esta clase los a�adimos a su prototipo. De esta
// forma solo existe una copia de cada uno para todos los misiles, y
// no una copia para cada objeto misil
var PlayerMissile = function(x,y) {
    this.w = SpriteSheet.map['missile'].w;
    this.h = SpriteSheet.map['missile'].h;
    this.x = x - this.w/2; 

    this.y = y - this.h; 
    this.vy = -700;
};

PlayerMissile.prototype.step = function(dt)  {
    this.y += this.vy * dt;
    if(this.y < -this.h) { this.board.remove(this); }
};

PlayerMissile.prototype.draw = function(ctx)  {
    SpriteSheet.draw(ctx,'missile',this.x,this.y);
};


$(function() {
    Game.initialize("game",sprites,startGame);
});
