const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisioncanvas1');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let score = 0;
let gameOver = false;
let gameSpeed = 13; 
let timeToNextBat = 0;
let BatInterval = 1000;
let lastTime = 0; 
let bats = []; 
let explosions = []; 
let particles = [];

class Layer {
    constructor(image, speedModifier, gameWidth, gameHeight){
        this.x = 0;
        this.y = 0;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 1920;
        this.height = 1080;
        this.image = image
        this.speedModifier = speedModifier
        this.speed = gameSpeed * speedModifier
    }

    update() {
        this.speed = gameSpeed * this.speedModifier;
        if (this.x <= -this.gameWidth){
            this.x = 0
        }
        this.x -= this.speed; 
    }

    draw() {
        ctx.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.gameWidth, this.gameHeight)
        ctx.drawImage(this.image, 0, 0, this.width, this.height, this.x + this.gameWidth, this.y, this.gameWidth, this.gameHeight)
    }
}

class Bats {
    constructor(){
        this.spriteWidth = 475;
        this.spriteHeight = 470;
        this.sizeModifier = Math.random()* 0.1 + 0.3;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 7 + 6;
        this.directionY = Math.random() * 5 - 3;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'sprite/bat.png'
        this.frame = 0;
        this.maxFrame = 9;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
        this.hasTrail = Math.random() > 0.5;
    }

    update(deltaTime){
        if (score > 9) {
            this.image.src = 'sprite/bat.png'
            this.spriteWidth = 475;
            this.spriteHeight = 470;
            this.maxFrame = 9;
            this.directionX = (Math.random() * 7 + 6) + 7;
            BatInterval = 900;
        }

        if (score > 24) {
            this.image.src = 'sprite/bat.png'
            this.spriteWidth = 475;
            this.spriteHeight = 470;
            this.maxFrame = 9;
            this.directionX = (Math.random() * 7 + 6) + 10;
            BatInterval = 600;
        }

        if (score > 39) {
            this.image.src = 'sprite/bat.png'
            this.spriteWidth = 475;
            this.spriteHeight = 470;
            this.maxFrame = 9;
            this.directionX = (Math.random() * 7 + 6) + 15;
            BatInterval = 500;
        }

        if (score > 54) {
            this.image.src = 'sprite/bat.png'
            this.spriteWidth = 475;
            this.spriteHeight = 470;
            this.maxFrame = 9;
            this.directionX = (Math.random() * 7 + 6) + 18;
            BatInterval = 400;
        }

        if (score > 79) {
            this.image.src = 'sprite/bat.png'
            this.spriteWidth = 475;
            this.spriteHeight = 470;
            this.maxFrame = 9;
            this.directionX = (Math.random() * 7 + 6) + 18;
            BatInterval = 300;
        }

        if (score > 99) {
            this.image.src = 'sprite/bat.png'
            this.spriteWidth = 475;
            this.spriteHeight = 470;
            this.maxFrame = 9;
            this.directionX = (Math.random() * 7 + 6) + 20;
            BatInterval = 300;
        }

        if (score > 199) {
            this.image.src = 'sprite/bat.png'
            this.spriteWidth = 475;
            this.spriteHeight = 470;
            this.maxFrame = 9;
            this.directionX = (Math.random() * 7 + 6) + 20;
            BatInterval = 200;
        }

        if (score > 299) {
            this.image.src = 'sprite/bat.png'
            this.spriteWidth = 475;
            this.spriteHeight = 470;
            this.maxFrame = 9;
            this.directionX = (Math.random() * 7 + 6) + 25;
            BatInterval = 200;
        }

        if (score > 399) {
            this.image.src = 'sprite/bat.png'
            this.spriteWidth = 475;
            this.spriteHeight = 470;
            this.maxFrame = 9;
            this.directionX = (Math.random() * 7 + 6) + 25;
            BatInterval = 100;
        }
        
        if (this.y < 0 || this.y > canvas.height - this.height) {
            this.directionY *= -1;
        }

        this.x -= this.directionX;
        this.y += this.directionY;

        if (this.x < 0 - this.width) this.markedForDeletion = true;
        
        this.timeSinceFlap += deltaTime;
        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;

            if (this.hasTrail) {
                for (let i = 0; i < 5; i++){
                    particles.push(new Particles(this.x, this.y, this.width, this.color))
                }
            }
        }
        if (this.x < 0 - this.width) gameOver = true;
    }

    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height); 

        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width,this.height);
    }
}

class Explosions {
    constructor(x, y, size){
        this.image = new Image();
        this.image.src = 'sprite/blood.png'
        this.spriteWidth = 32;
        this.spriteHeight = 32;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'sound/fire.mp3'
        this.timeSinceLastFrame = 1;
        this.frameInterval = 150;
        this.markedForDeletion = false;

    }

    update(deltaTime){
        if (this.frame === 0) this.sound.play(); 
        this.timeSinceLastFrame += deltaTime;
        if (this.timeSinceLastFrame > this.frameInterval){ 
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5 ) this.markedForDeletion = true;
        }
    }

    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.size, this.size)
    } 
}

class Particles {
    constructor(x, y, size, color) {
        this.size = size
        this.x = x + this.size/2 + Math.random() * 50 - 25;
        this.y = y + this.size/2;
        this.radius = Math.random() * this.size/10;
        this.maxRadius = Math.random() * 20 + 10;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.color = color;
    }

    update(){
        this.x += this.speedX;
        this.radius += 0.5;
        if (this.radius > this.maxRadius - 5) this.markedForDeletion = true;
    }

    draw(){
        ctx.save();
        ctx.globalAlpha = 1 - this.radius/this.maxRadius;
        ctx.beginPath(); 
        ctx.fillStyle = this.color;
        ctx.rect(this.x, this.y, this.radius, this.radius);
        ctx.fill();
        ctx.restore();
    }
}

const audio = new Audio('sound/bgmusic1.mp3')
audio.play();

const audio2 = new Audio('sound/gameover.mp3')

const backgroundLayer1 = new Image();
backgroundLayer1.src = 'parallax/sky.png'
const backgroundLayer2 = new Image();
backgroundLayer2.src = 'parallax/buildings.png'
const backgroundLayer3 = new Image();
backgroundLayer3.src = 'parallax/wall2.png'
const backgroundLayer4 = new Image();
backgroundLayer4.src = 'parallax/wall1.png'
const backgroundLayer5 = new Image();
backgroundLayer5.src = 'parallax/boxes&container.png'
const backgroundLayer6 = new Image();
backgroundLayer6.src = 'parallax/wheels&hydrant.png'
const backgroundLayer7 = new Image();
backgroundLayer7.src = 'parallax/road.png'

const layer1 = new Layer(backgroundLayer1, 0.2, CANVAS_WIDTH, CANVAS_HEIGHT)
const layer2 = new Layer(backgroundLayer2, 0.4, CANVAS_WIDTH, CANVAS_HEIGHT)
const layer3 = new Layer(backgroundLayer3, 0.5, CANVAS_WIDTH, CANVAS_HEIGHT)
const layer4 = new Layer(backgroundLayer4, 0.6, CANVAS_WIDTH, CANVAS_HEIGHT)
const layer5 = new Layer(backgroundLayer5, 0.7, CANVAS_WIDTH, CANVAS_HEIGHT)
const layer6 = new Layer(backgroundLayer6, 0.7, CANVAS_WIDTH, CANVAS_HEIGHT)
const layer7 = new Layer(backgroundLayer7, 0.7, CANVAS_WIDTH, CANVAS_HEIGHT)

const gameObjects = [layer1, layer2, layer3, layer4, layer5, layer6, layer7]

const game_over = document.getElementById('container');
const scoring = document.getElementById('score');
const finalScore = document.getElementById('finalScore');

function drawScore(){
    scoring.innerHTML = "Score: " + score
}

function drawGameOver(){
    game_over.style.display = 'grid';
    finalScore.innerHTML = score
    audio.pause();
    audio2.play();
}

window.addEventListener('click', function(e){
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1); 
    const pc = detectPixelColor.data;

    bats.forEach(object => {
        if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]) { 
            object.markedForDeletion = true;
            score++;
            explosions.push(new Explosions(object.x, object.y, object.width))
        }
    })
})

function animate(timestamp){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    collisionCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp; 
    timeToNextBat += deltaTime 

    gameObjects.forEach(object => {
        object.update();
        object.draw();
    })

    if (timeToNextBat > BatInterval) { 
        bats.push(new Bats());
        timeToNextBat = 0;
        bats.sort(function(a,b){
            return a.width - b.width
        })
    };

    drawScore();

    [...particles, ...bats, ...explosions].forEach(object => object.update(deltaTime));
    [...particles, ...bats, ...explosions].forEach(object => object.draw())
    bats = bats.filter(object => !object.markedForDeletion) 
    explosions = explosions.filter(object => !object.markedForDeletion)
    particles = particles.filter(object => !object.markedForDeletion)

    if (!gameOver) requestAnimationFrame(animate);
    else drawGameOver()       
}

animate(0);