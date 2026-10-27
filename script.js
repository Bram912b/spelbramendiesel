class Raster {
  constructor(r,k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  teken() {
    push();
    noFill();
    stroke('grey');
    for (var rij = 0;rij < this.aantalRijen;rij++) {
      for (var kolom = 0;kolom < this.aantalKolommen;kolom++) {
        rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
      }
    }
    pop();
  }
}

class Jos {
  constructor() {
    this.startX = 400;
    this.startY = 300;
    this.x = this.startX;
    this.y = this.startY;
    this.animatie = [];
    this.frameNummer =  3;
    this.stapGrootte = null;
    this.gehaald = false;
    this.levens =3; 
  }

  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x,0,canvas.width);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }

  wordtGeraakt(vijand) {
    return (this.x == vijand.x && this.y == vijand.y);
    
    }
   raakt(object) {
     var marge = raster.celGrootte * 0.7;
     return (abs(this.x - object.x) < marge && abs(this.y - object.y) < marge);
    }
  
  verliesLeven() {
 this.levens--;
this.x = this.startX;
this.y = this.startY;
}
  toon() {   image(this.animatie[this.frameNummer],this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}  

class Vijand {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1,2))*this.stapGrootte;
    this.y += floor(random(-1,2))*this.stapGrootte;

    this.x = constrain(this.x,0,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  } 
}

class Raket {
  constructor(x, snelheid) {
    this.x = x;
    this.y = 500; 
    this.snelheid = snelheid;
    this.beginSnelheid = snelheid;
    this.zwaartekracht = 0.5;
    this.sprite = null; 
}

beweeg() {
  this.snelheid += this.zwaartekracht;
  this.y += this.snelheid;

  if (this.y >= 500) {
    this.y = 500;
    this.snelheid = this.beginSnelheid;
  } 

  
   if (this.y < 0) {
     this.y = 0;
     this.snelheid = 0;
  }
}

toon() {
  image(this.sprite, this.x, this.y,
       raster.celGrootte, raster.celGrootte);
}
}

class Pingpongbal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.snelheidX = 6;
    this.snelheidY = 6;
    this.gegeten = false;
  }
    
beweeg() {
 if (this.gegeten) {
   return;
 }
this.x += this.snelheidX;
this.y += this.snelheidY;

if (this.x <= 0 || this.x >= canvas.width - raster.celGrootte) {
  this.snelheidX *= -1;
}
if (this.y <= 0 || this.y >= canvas.height - raster.celGrootte) {
  this.snelheidY *= -1;
}

this.x = constrain(this.x, 0, canvas.width - raster.celGrootte);
this.y = constrain(this.y, 0, canvas.height -raster.celGrootte);
}

toon() {
  if (this.gegeten) {
    return;
  }
  push();
  fill('white');
  stroke('orange');
  strokeWeight(3);
  var d = raster.celGrootte * 0.4;
  ellipse(this.x + raster.celGrootte / 2, this.y + raster.celGrootte / 2, d, d);
  pop();
}
}
function tekenOmgekeerdePiramide(aantal, x, y, grootte) {

 if (aantal < 1) {
   return;
 }

for (var i = 0; i < aantal; i++) {
  rect(x + i * grootte, y, grootte, grootte);
}
tekenOmgekeerdePiramide(aantal - 1, x + grootte / 2, y + grootte, grootte);
}
function toonEindscherm(kleur, boodschap) {
  background(kleur);
  push();
  fill('white')
  textSize(80)
  text(boodschap, 30, 300);
  pop();
  noLoop();
}

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
raketPlaatje = loadImage("images/sprites/raket.png");

}
function setup() {
  canvas = createCanvas(900,600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);

  raster = new Raster(6,9);
  raster.berekenCelGrootte();

  eve = new Jos();
  eve.stapGrootte = 1*raster.celGrootte;
  for (var b = 0;b < 6;b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  alice = new Vijand(700,200);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");  

  cindy = new Vijand(200,100);
  cindy.stapGrootte = 1*eve.stapGrootte;
  cindy.sprite = loadImage("images/sprites/Cindy100px/Cindy.png")
raket1 = new Raket(floor(random(5,9))*100, -12);
raket2 = new Raket(floor(random(5,9))*100, -15);
raket3 = new Raket(floor(random(5,9))*100, -18);

raket1.sprite = raketPlaatje;
raket2.sprite = raketPlaatje;
raket3.sprite = raketPlaatje;

bal = new Pingpongbal(100, 100);
}

function draw() {
  background(brug);

  push()
  fill(255, 215, 0, 150);
  stroke('black');
  var blokGrootte = 50;
  var aantalBlokken = 8;
  var piramideX = (canvas.width - aantalBlokken * blokGrootte) / 2;
  var piramideY = (canvas.height - aantalBlokken * blokGrootte) / 2;
  tekenOmgekeerdePiramide(aantalBlokken, piramideX, piramideY, blokGrootte);
  pop();
  
  raster.teken();
  
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  cindy.beweeg();
  
  raket1.beweeg();
  raket2.beweeg();
  raket3.beweeg();
  bal.beweeg();
  
  eve.toon();
  alice.toon();
  bob.toon();
  cindy.toon();

  raket1.toon();
  raket2.toon();
  raket3.toon();
  bal.toon();


  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob)  || eve.wordtGeraakt(cindy)) {
    eve.verliesLeven();
}

else if (eve.raakt(raket1) || eve.raakt(raket2) || eve.raakt(raket3)) {
  eve.verliesLeven();
}

if(!bal.gegeten && eve.raakt(bal)) {
  bal.gegeten = true;
  eve.levens++;
}

push();
textSize(30);
fill('white');
stroke('black');
strokeWeight(4);
text("Levens: " + eve.levens, 10, 40);
pop();
if (eve.levens <= 0) {
  toonEindscherm('red', 'Game over!');
  }
else if (eve.gehaald) {
  toonEindscherm('green', 'Je hebt gewonnen!');
  }
}