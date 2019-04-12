const config = {
	type: Phaser.AUTO,
	width: 800,
  height: 600,
  physics: {
  	default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
}

const game = new Phaser.Game(config);
let platforms
let player
let score = 0;
let scoreText; //Text Game Object




function preload(){
	this.load.image('sky', 'src/assets/sky.png');
  this.load.image('ground', 'src/assets/platform.png');
  this.load.image('star', 'src/assets/star.png');
  this.load.image('bomb', 'src/assets/bomb.png');


  /* sprites */

 this.load.spritesheet('dude', 
      'src/assets/dude.png',
      { frameWidth: 32, frameHeight: 48 }
  ); 

}

function create(){
	// this.add.image(0,0, 'sky').setOrigin(0, 0)
	this.add.image(400, 300, 'sky');
	// this.add.image(400, 300, 'star');

	// PISOOOO
	//física para los cuerpos solidos que no se mueven , por ejem el piso
	platforms = this.physics.add.staticGroup();
	
	platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');
  ///  se envía los parametros en x y y y la imagen
  // PISOOO

  ///JUGADOR
  player = this.physics.add.sprite(100,450, 'dude'); //crea el sprite
  // this.physics.add vuelve el objeto dinámico por defecto
  player.setBounce(0.2); // rebota
  player.setCollideWorldBounds(true);

  player.body.setGravityY(250);
  this.physics.add.collider(player, platforms); 
  // permite que el jugador colisione con las plataformas


  this.anims.create({
  	key: 'left',
  	frames: this.anims.generateFrameNumbers('dude',{start: 0, end: 3}), 
  	//fotogramas 0,1,2,3, a 10 fotogramas por segundo, el repeat -1 hace un loop
  	frameRate: 10,
  	reapeat: -1
  });
  this.anims.create({
  	key: 'turn',
  	frames: [{key: 'dude', frame: 4}],
  	frameRate: 20,
  	
  });
  this.anims.create({
  	key: 'right',
  	frames: this.anims.generateFrameNumbers('dude',{start: 5, end: 8}),
  	frameRate: 10,
  	repeat: -1
  	
  });
  

  /// JUGADOR


  /////////// Bombas

	let bombs = this.physics.add.group();

	this.physics.add.collider(bombs, platforms);
	this.physics.add.collider(player, bombs, hitBomb, null, this);

	/* 


	Las bombas, por supuesto, rebotarán en las plataformas, 
	y si el jugador las golpea, llamaremos la función hitBomb. 
	Todo lo que hará es detener el juego y convertir al jugador en rojo
	*/


	function hitBomb (player, bomb){
	    this.physics.pause();

	    player.setTint(0xff0000);

	    player.anims.play('turn');

	    gameOver = true;
	}
/////






  ///ESTRELLAS


  stars = this.physics.add.group({ //el grupo toma un objeto de configuración dinámico de estrellas para que se muevan y reboten
    key: 'star', //objeto imagen
    repeat: 11, //cantidad// crea 12 stars
    setXY: { x: 12, y: 0, stepX: 70 } // separación de estrellas
	});

	stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); 
	    // itera a todos los hijos 
	    // del grupo y les da un valor de rebote de Y aleatorio entre 0,4 y 0,8.
	    // El valor de rebote significa que volverán a 
	    // rebotar aleatoriamente hasta que finalmente se establezcan para descansar.
	});

this.physics.add.collider(stars, platforms)
// el objeto Collider  se usa para evita que caigan las star, 
// debemos comprobar su colisión contra las plataformas. 

this.physics.add.overlap(player, stars, collectStar, null, this);
// 
// verificaremos si el jugador se 
// superpone con una estrella o no Esto le indica a Phaser que 
// compruebe si hay una superposición 
// entre el jugador y cualquier estrella en el grupo de estrellas. 
// Si se encuentran, se pasan a la función 'collectStar'


/* 
	16 x 16 es la coordenada para mostrar el texto, en 
	'score: 0' es la cadena predeterminada que se muestra 
	y el objeto que sigue contiene un tamaño de fuente 
	y un color de relleno
*/
scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });





function collectStar (player, star){
    star.disableBody(true, true);
    // la estrella tiene su cuerpo físico desactivado y su objeto 
    // de juego principal se vuelve inactivo e invisible, 
    // lo que lo elimina de la pantalla



    /* 
			se agregan 10 puntos por cada estrella y se actualiza el scoreText
    */
    score += 10;
    scoreText.setText('Score: ' + score);


    /* 

			
		Luego necesitamos modificar la función collectStar 
		para que cuando el jugador levante una estrella, 
		su puntaje aumente y el texto se actualice

    */




     if (stars.countActive(true) === 0){
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }

}




/////




}

function update(){
	// movimiento del jugador 

	const cursors = this.input.keyboard.createCursorKeys();
	//objeto cursors con cuatro propiedades: arriba, abajo, izquierda, derecha,



	if (cursors.left.isDown){ // si se apreta la tecla izquierda
	    player.setVelocityX(-160); // se aplica una velocidad horizontal negativa

	    player.anims.play('left', true);
	}
	else if (cursors.right.isDown){ //
	    player.setVelocityX(160); //

	    player.anims.play('right', true);
	}
	else{ // si se queda quieto se gira al fotograma 0
	    player.setVelocityX(0);

	    player.anims.play('turn');
	}

	if (cursors.up.isDown && player.body.touching.down){ // saltar
	    player.setVelocityY(-450); // capacidad del salto
	}

}