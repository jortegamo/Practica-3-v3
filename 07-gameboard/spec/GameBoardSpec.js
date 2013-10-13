/*

  En el anterior prototipo (06-player), el objeto Game permite
  gestionar una colecci�n de tableros (boards). Los tres campos de
  estrellas, la pantalla de inicio, y el sprite de la nave del
  jugador, se a�aden como tableros independientes para que Game pueda
  ejecutar sus m�todos step() y draw() peri�dicamente desde su m�todo
  loop(). Sin embargo los objetos que muestran los tableros no pueden
  interaccionar entre s�. Aunque se a�adiesen nuevos tableros para los
  misiles y para los enemigos, resulta dif�cil con esta arquitectura
  pensar en c�mo podr�a por ejemplo detectarse la colisi�n de una nave
  enemiga con la nave del jugador, o c�mo podr�a detectarse si un
  misil disparado por la nave del usuario ha colisionado con una nave
  enemiga.


  Requisitos:

  Este es precisamente el requisito que se ha identificado para este
  prototipo: dise�ar e implementar un mecanismo que permita gestionar
  la interacci�n entre los elementos del juego. Para ello se dise�ar�
  la clase GameBoard. Piensa en esta clase como un tablero de un juego
  de mesa, sobre el que se disponen los elementos del juego (fichas,
  cartas, etc.). En Alien Invasion los elementos del juego ser�n las
  naves enemigas, la nave del jugador y los misiles. Para el objeto
  Game, GameBoard ser� un board m�s, por lo que deber� ofrecer los
  m�todos step() y draw(), siendo responsable de mostrar todos los
  objetos que contenga cuando Game llame a estos m�todos.

  Este prototipo no a�ade funcionalidad nueva a la que ofrec�a el
  prototipo 06.


  Especificaci�n: GameBoard debe

  - mantener una colecci�n a la que se pueden a�adir y de la que se
    pueden eliminar sprites como nave enemiga, misil, nave del
    jugador, explosi�n, etc.

  - interacci�n con Game: cuando Game llame a los m�todos step() y
    draw() de un GameBoard que haya sido a�adido como un board a Game,
    GameBoard debe ocuparse de que se ejecuten los m�todos step() y
    draw() de todos los objetos que contenga

  - debe ofrecer la posibilidad de detectar la colisi�n entre
    objetos. Un objeto sprite almacenado en GameBoard debe poder
    detectar si ha colisionado con otro objeto del mismo
    GameBoard. Los misiles disparados por la nave del jugador deber�n
    poder detectar gracias a esta funcionalidad ofrecida por GameBoard
    cu�ndo han colisionado con una nave enemiga; una nave enemiga debe
    poder detectar si ha colisionado con la nave del jugador; un misil
    disparado por la nave enemiga debe poder detectar si ha
    colisionado con la nave del jugador. Para ello es necesario que se
    pueda identificar de qu� tipo es cada objeto sprite almacenado en
    el tablero de juegos, pues cada objeto s�lo quiere comprobar si ha
    colisionado con objetos de cierto tipo, no con todos los objetos.

*/

describe ("Clase GameBoardSpec",function(){

	// primero inicializamos las variables necesarias para comenzar el juego. 
	var canvas, ctx;

    beforeEach(function(){ // antes de cada test se cargan las siguientes variables y se hacen comprobaciones
		loadFixtures('index.html');
	
		canvas = $('#game')[0];
		expect(canvas).toExist();
	
		ctx = canvas.getContext('2d'); // necesario para los m�todos draw
		expect(ctx).toBeDefined();
		
		expect (GameBoard).toBeDefined(); // me aseguro de que GameBoard ha sido definido
		
		var sprites = {
	    	ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
		};
	
		SpriteSheet.load (sprites,function(){}); // necesario para crear un objeto PlayerShip, 
												// puesto que al crearlo lo extraemos del map de SpriteSheet.
												// siempre se nos creara un PlayerShip con las prop de ship.
    });

	it("GameBoard.add", function(){
	
		var board = new GameBoard();
		Game = {width: 320, height: 480}; // necesito Game.w y Game.H para que se cree la nave.
		var miNave = new PlayerShip();
		board.add (miNave);
		// Al llamar al metodo add de board, se habr� a�adido el objeto al array objects.
		runs (function(){	 
			expect (board.objects.length).toBe(1);
		});
    });
    
    it("GameBoard.remove", function(){
	
		var board = new GameBoard();
		Game = {width: 320, height: 480}; // necesito Game.w y Game.H para que se cree la nave.
		var miNave = new PlayerShip();
		board.resetRemoved(); //Hacemos reset del buffer de objetos a eliminar. (en este caso para inicializar). 
		expect (board.removed.length).toBe (0);
		board.remove (miNave);
		// Al llamar al metodo remove de board, se habr� a�adido el objeto al array removed.
		runs (function(){	 
			expect (board.removed.length).toBe(1);	
		});
    });
    
    it ("GameBoard.finalizeRemove",function(){
    	var board = new GameBoard();
    	Game = {width: 320, height: 480}; // necesito Game.w y Game.H para que se cree la nave.
    	var miNave = new PlayerShip ();
    	board.add (miNave);
    	board.resetRemoved();
    	board.remove (miNave);
    	expect (board.removed.length).toBe(board.objects.length);
    	board.finalizeRemoved();
    	//Al llamar al metodo finalizeRemoved, se habr� borrado miNabe del buffer Objects.
    	runs(function(){
    		expect (board.objects.length).toBe(0);
    	});
    });
    
    it ("GameBoard.step",function(){
    	var board = new GameBoard();
    	var miNave = {
    		step: function(){},
    		draw: function(){}
    	};
    	board.add(miNave);
    	spyOn (miNave, "step");
    	spyOn (board,"finalizeRemoved")
    	var dt = 1;
    	board.step(dt);
    	runs (function(){ // si se cumplen todas estas llamadas, el metodo step de GameBoard funcionar�. 
    		expect (miNave.step).toHaveBeenCalled(); // comprueba que iterate funciona y que llama a step de miNave.
    		expect (board.removed.length).toBe (0); // se ha llamado a resetRemoved.
    		expect (board.finalizeRemoved).toHaveBeenCalled();
    	});
    });
    
    it ("GameBoard.draw",function(){
    	var board = new GameBoard();
    	var miNave = {
    		step: function (){},
    		draw: function (){}
    	};
    	board.add(miNave);
    	spyOn (miNave,"draw");
    	board.draw(ctx);
    	runs(function(){
    		expect (miNave.draw).toHaveBeenCalled(); // comprueba que iterate funciona y que llama a draw de miNave.
    		expect (miNave.draw).toHaveBeenCalledWith(ctx);
    	});
    });
    
    it ("GameBoard.detect",function(){
    	// en este test nos creamos una funci�n que es la que va a evaluar la detecci�n del objeto. 
    	var board = new GameBoard();
    	var miNave = {x: 1, y: 2};
    	board.add(miNave);
    	var f = function (){
    		return this.x === 1; // ese this ser� el objeto de objects sobre el que har� la llamada a la funci�n f detect.
    	}
    	var objDetected = board.detect (f);
    	runs(function(){
    		expect (objDetected).toBe(miNave);
    	});
    });
    
    it ("GameBoard.collide False Collide",function(){
    	// en este test se prueba la funcionalidad de GameBoard.collide por lo que tambien se prueba el 
    	// correcto funcionamiento de overlap y de detect.
    	var board = new GameBoard();
    	var miNave = {x: 1, y: 1, w: 2, h: 2}; // les damos valores a las coordenadas para que no exista overlap.
    	var naveEnemiga = {x: 3,y: 1, w: 1, h: 2};	
    	board.add (miNave);
    	board.add (naveEnemiga); // es necesario incluir los dos objetos en el mismo tablero de juego.
    	expect (board.overlap(miNave,naveEnemiga)).toBe (false); // probamos que overlap funciona correctamente
    	var col = board.collide (miNave);
    	runs (function(){
    		expect (col).toBe (false);
    	});
    });
    
    it ("GameBoard.collide True Collide",function(){
    	// en este test se prueba la funcionalidad de GameBoard.collide por lo que tambien se prueba el 
    	// correcto funcionamiento de overlap y de detect.
    	var board = new GameBoard();
    	var miNave = {x: 1, y: 1, w: 2, h: 2}; // les damos valores a las coordenadas para que no exista overlap.
    	var naveEnemiga = {x: 1,y: 1, w: 1, h: 2};	
    	board.add (miNave);
    	board.add (naveEnemiga); // es necesario incluir los dos objetos en el mismo tablero de juego.
    	expect (board.overlap(miNave,naveEnemiga)).toBe (true); // probamos que overlap funciona correctamente
    	var naveCol = board.collide (miNave);
    	runs (function(){
    		expect (naveCol).toBe (naveEnemiga);
    	});
    }); 
});
