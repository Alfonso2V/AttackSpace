const AMOUT_ENEMIGES = 7; //Enemigos en pantalla
const SPEED_B = 5; //Velocidadd de las balas
const SPEED_E = 0.3; //Velocidad enemigos
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
    }
};
var ship;
var bullet;
var destroySound;
var flag = false;
var group_e; //Grupo de enemigos
var bullets = []; //Array de balas
var newEnemis = []; //Array de enemigos nuevos
var game = new Phaser.Game(config); //Tamaño de ventana y motor de renderizado
var score = 0;
//Funciones de juego
function preload() { //Cargar los assets
    this.load.crossOrigin = 'anonymous';
    // this.load.image('backgroud', 'assets/images/estrellas.png');
    this.load.spritesheet('ship', '../assets/images/nave.png', { frameWidth: 150, frameHeight: 381 })
    this.load.spritesheet('ufos', 'assets/images/ufo.png', { frameWidth: 125, frameHeight: 136 }) // 125, 136, 8);
    this.load.image('bullet', 'assets/images/misil.png');
    this.load.audio('shot', ['../assets/sounds/disparo_1.mp3']);
    this.load.audio('destroy', ['../assets/sounds/explosion.mp3']);
}

function create() {
    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' })
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
        bullet.setVelocityY(-300);
        shotSound.play();
        bullets.push(bullet);
    }, this);
    this.physics.add.collider(ship, group_e, dead); //Colisiones entre los enemigos y la nave, llamada a funcion si se cumple
    this.physics.add.collider(group_e, bullets, deadEnemi)
}

function update() {
    text.setText('Puntuación: ' + score)
    if (group_e.getLength() == 2) {
        group_e = this.physics.add.group({
            key: 'ufo',
            repeat: AMOUT_ENEMIGES - 1 /* Numero de enemigos iniciales */
        });
        group_e.children.iterate(createEnemi, this);
        this.physics.add.collider(group_e, bullets, deadEnemi); //Agregando colisiones a enemigos nuevos
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
    // ship.destroy();
}

function deadEnemi(bullet, enemi) { //Muerte del enemigo, se reciben dos parametros que son los objetos que colisionan
    destroySound.play();
    enemi.destroy();
    bullet.destroy();
    score += 10;
}
//FIN FUNCIONES PROPIAS