// import { gameOver } from "./gameOver.js";
const AMOUT_ENEMIGES = 7; //Enemigos en pantalla
const SPEED_B = -300; //Velocidadd de las balas (Movimiento vertical negativo)
//--------------------------------------------------- Clase gameOver
var exitButon;
class gameOver extends Phaser.Scene {
        preload() {
            this.load.image('face', '/assets/images/gameOver.jpg');
            this.load.image('salir', '/assets/images/pausaBoton.png')
        }

        create(data) {
            this.face = this.add.image(data.x, data.y, 'face');
            var salir = this.add.image(window.innerWidth / 2, window.innerHeight / 10 * 8, 'salir');
            salir.setScale(.5).setInteractive();
            this.input.on('gameobjectdown', function(pointer, gameobject) {
                if (gameobject === salir) {
                    window.location = '/index.html'
                    console.log("Hola")
                }
            })
        }
    }
    // ---------------------------------------------------Fin clase gameOver
var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        gameOver: gameOver,
    }
};
var ship;
var bullet;
var destroySound;
var flag = false;
var group_e; //Grupo de enemigos
var bullets = []; //Array de balas
var game = new Phaser.Game(config); //Tamaño de ventana y motor de renderizado
var score = 0;
var namePlayer = sessionStorage.getItem('playerName');
var textScore;
var textName;
var ufosGroup;
var pauseButton;
//Funciones de juego
function preload() { //Cargar los assets
    this.load.crossOrigin = 'anonymous';
    this.load.image('backgroud', 'assets/images/estrellas.png');
    this.load.spritesheet('ship', '../assets/images/nave.png', { frameWidth: 150, frameHeight: 381 })
    this.load.spritesheet('ufos', 'assets/images/ufo.png', { frameWidth: 125, frameHeight: 136 }) // 125, 136, 8);
    this.load.image('bullet', 'assets/images/misil.png');
    this.load.audio('shot', ['../assets/sounds/disparo_1.mp3']);
    this.load.audio('destroy', ['../assets/sounds/explosion.mp3']);
    this.load.image('pauseButton', ['../assets/images/pausaBoton.png']);
}

function create() {
    textScore = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
    textName = this.add.text(10, 30, '', { font: '16px Courier', fill: '#00ff00' });
    pauseButton = this.add.image(window.innerWidth / 10 * 9, window.innerHeight / 10, 'pauseButton').setScale(0.2).setInteractive();
    textName.setText('Jugador: ' + namePlayer);
    this.anims.create({
        key: 'fire',
        frames: this.anims.generateFrameNumbers('ship', { frames: [0, 1, 2, 3, 4] }),
        frameRate: 5,
        repeat: -1
    });
    var shotSound = this.sound.add('shot');
    destroySound = this.sound.add('destroy');

    this.anims.create({ key: 'ufoA', frames: this.anims.generateFrameNumbers('ufos', { frames: [0] }), });
    this.anims.create({ key: 'dove', frames: this.anims.generateFrameNumbers('ufos', { frames: [1] }), });
    this.anims.create({ key: 'turtle', frames: this.anims.generateFrameNumbers('ufos', { frames: [2] }), });
    this.anims.create({ key: 'saboteur', frames: this.anims.generateFrameNumbers('ufos', { frames: [3] }), });
    this.anims.create({ key: 'paranoid', frames: this.anims.generateFrameNumbers('ufos', { frames: [4] }), });
    this.anims.create({ key: 'ninja', frames: this.anims.generateFrameNumbers('ufos', { frames: [5] }), });
    this.anims.create({ key: 'luz', frames: this.anims.generateFrameNumbers('ufos', { frames: [6] }), });
    this.anims.create({ key: 'thor', frames: this.anims.generateFrameNumbers('ufos', { frames: [7] }), });

    ufosGroup = ['ufoA', 'dove', 'turtle', 'saboteur', 'paranoid', 'ninja', 'luz', 'thor'];
    group_e = this.physics.add.group({
        key: 'ufo',
        repeat: AMOUT_ENEMIGES - 1 /* Numero de enemigos iniciales */
    });
    group_e.children.iterate(createEnemi, this);
    ship = this.physics.add.sprite(100, 100).setOrigin(0, 0).setScale(0.3);
    ship.setSize(150, 205, false); //Hitbox
    ship.setImmovable(true);
    ship.play('fire');
    this.input.on('pointermove', function(pointer) {
        ship.setPosition(pointer.x, pointer.y);
    });
    this.input.on('pointerdown', function(pointer) {
        bullet = this.physics.add.image(pointer.x, pointer.y, 'bullet').setScale(0.1);
        bullet.setVelocityY(SPEED_B);
        shotSound.play();
        bullets.push(bullet);
    }, this);
    this.physics.add.collider(ship, group_e, dead); //Colisiones entre los enemigos y la nave, llamada a funcion si se cumple
    this.physics.add.collider(group_e, bullets, deadEnemi)
        // Boton salir
    this.input.on('gameobjectdown', function(pointer, gameobject) {
        if (gameobject === pauseButton) {
            window.location = '/index.html'
        }
    })
}

function update() {
    textScore.setText('Puntuación: ' + score);
    if (group_e.getLength() == 2) {
        group_e = this.physics.add.group({
            key: 'ufo',
            repeat: AMOUT_ENEMIGES - 1 /* Numero de enemigos iniciales */
        });
        group_e.children.iterate(createEnemi, this);
        this.physics.add.collider(group_e, bullets, deadEnemi); //Agregando colisiones a enemigos nuevos con las balas
        this.physics.add.collider(ship, group_e, dead); //Colision a enemigos nuevos para perder
    }
}
//FIN FUNCIONES DE JUEGO
// Funciones propias
function createEnemi(ufo) {
    Phaser.Geom.Rectangle.Random(this.physics.world.bounds, ufo);
    ufo.setSize(125, 136, false);
    ufo.setScale(0.5);
    ufo.play(Phaser.Math.RND.pick(ufosGroup));
    ufo.setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(-150, 150));
    ufo.setBounce(1).setCollideWorldBounds(true); //Activar colider con los bordes de la pantalla
}

function dead() {
    enviarScore(score, namePlayer);
    ship.destroy();
    game.scene.add('gameOver', gameOver, true, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
}

function deadEnemi(bullet, enemi) { //Muerte del enemigo, se reciben dos parametros que son los objetos que colisionan
    destroySound.play();
    enemi.destroy();
    bullet.destroy();
    score += 10;
}
//FIN FUNCIONES PROPIAS