/*

  Requisitos: 

  La nave del usuario disparar� 2 misiles si est� pulsada la tecla de
  espacio y ha pasado el tiempo de recarga del arma.

  El arma tendr� un tiempo de recarga de 0,25s, no pudi�ndose enviar
  dos nuevos misiles antes de que pasen 0,25s desde que se enviaron
  los anteriores



  Especificaci�n:

  - Hay que a�adir a la variable sprites la especificaci�n del sprite
    missile

  - Cada vez que el usuario presione la tecla de espacio se a�adir�n
    misiles al tablero de juego en la posici�n en la que est� la nave
    del usuario. En el c�digo de la clase PlayerSip es donde tienen
    que a�adirse los misiles

  - La clase PlayerMissile es la que implementa los misiles. Es
    importante que la creaci�n de los misiles sea poco costosa pues va
    a haber muchos disparos, para lo cual se declarar�n los m�todos de
    la clase en el prototipo

<<<<<<< HEAD
*/

describe ("Clase PlayerMissile", function(){
	var canvas, ctx;

    beforeEach(function(){ // antes de cada test se cargan las siguientes variables y se hacen comprobaciones
		loadFixtures('index.html');
	
		canvas = $('#game')[0];
		expect(canvas).toExist();
	
		ctx = canvas.getContext('2d'); // necesario para los m�todos draw
		expect(ctx).toBeDefined();
		
		expect (PlayerMissile).toBeDefined(); // me aseguro de que PlayerMissile ha sido definido
    });
    
	it ("PlayerMissile.draw",function(){
		SpriteSheet = { // creamos un objeto dummy SpriteSheet y que en su map tiene almacenado un sprite missile.
  			map : {missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 }},
  			draw: function() {}
		};
		var miMissile = new PlayerMissile (5,5); // creamos un nuevo objeto missile.
		spyOn (SpriteSheet, "draw");
		miMissile.draw(ctx);
		runs(function(){
			expect (SpriteSheet.draw).toHaveBeenCalled(); // deber� llamar a SpriteSheet.draw
			expect (SpriteSheet.draw.calls[0].args[0]).toBe (ctx); // comprobamos que el orden de argumentos es el correcto.
			expect (SpriteSheet.draw.calls[0].args[1]).toBe ('missile');
			expect (SpriteSheet.draw.calls[0].args[2]).toBe (miMissile.x);
			expect (SpriteSheet.draw.calls[0].args[3]).toBe (miMissile.y);
		});
	});
	
	it ("PlayerMissile.step", function(){
		var miboard = new GameBoard();
		var miMissile = new PlayerMissile (5,5);
		miboard.add (miMissile); // a�adimos miMissile a board para que miMissile pueda referenciar a board.
		spyOn(miboard, "remove");
		var dt = 1;
		miMissile.step(dt);
		runs(function(){
			expect (miboard.remove).toHaveBeenCalled(); // se deber�a haber llamado a remove
			expect (miboard.remove.calls[0].args[0]).toBe (miMissile); // me aseguro del correcto paso de par�metros.
			expect (miboard.remove.length).toBe(0); // aunque se halla intentado a�adir a removed no se puede puesto que no existe.
		});
		
	});

});
=======
*/
>>>>>>> 37358de302bbee6a2dbf938da5d792d0b1877acc
