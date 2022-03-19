var ground, groundImage, groundSafe;
var trex ,trex_running, trexCollided;
var nube, nubeImage, nubeGroup;
var obstacle, obstacleGroup;
var cactus1, cactus2, cactus3, cactus4, cactus5, cactus6;
var score = 0;
var PLAY=1;
var END=0;
var gamestate=PLAY;
var gameOver, gameRestart, gameOverImage, gameRestartImage;
var checkpoint;
var jump;
var die;

function preload(){
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  trexCollided=loadAnimation("trex_collided.png");
  groundImage=loadImage("ground2.png");
  nubeImage=loadImage("cloud.png");
  cactus1=loadImage("obstacle1.png");
  cactus2=loadImage("obstacle2.png");
  cactus3=loadImage("obstacle3.png");
  cactus4=loadImage("obstacle4.png");
  cactus5=loadImage("obstacle5.png"); 
  cactus6=loadImage("obstacle6.png");
  gameOverImage=loadImage("gameOver.png");
  gameRestartImage=loadImage("restart.png");
  checkpoint=loadSound("checkPoint.mp3");
  jump=loadSound("jump.mp3");
  die=loadSound("die.mp3");
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  
  //crear sprite del t-rex.
  trex=createSprite(50,height/2,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided", trexCollided);
  trex.scale=0.5;

  ground=createSprite(width/2,height-20,width,2);
  ground.addImage("ground",groundImage);
  groundSafe=createSprite(width/2,height-20,width,2);
  groundSafe.visible=false;
  trex.debug=false;
  //trex.setCollider("rectangle", 0,0,300,trex.height);
  trex.setCollider("circle", 0,0,35);

  gameOver=createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImage);
  gameOver.scale=0.5;
  gameOver.visible=false;
  gameRestart=createSprite(width/2,height/2);
  gameRestart.addImage(gameRestartImage);
  gameRestart.scale=0.5;
  gameRestart.visible=false;

  nubeGroup=createGroup();
  obstacleGroup=createGroup();
}

function draw(){
  background("white");
  //xconsole.log(trex.y);
  if(gamestate==PLAY){
    ground.velocityX=-(6+score/100);
    score=score+Math.round(frameRate()/60);
    if(score>0 && score%100==0){
      checkpoint.play();
    }

    if(ground.x<0){
      ground.x=ground.width/2;
    }
    if(touches.length>0 && trex.y>height-39){
      trex.velocityY=-12;
      jump.play();
      touches=[];
    }
    
    if(keyDown("space")&& trex.y>height-39){
      trex.velocityY=-12;
      jump.play();
    }

    trex.velocityY=trex.velocityY+0.8;
    spawnClouds();
    spawnObstacles();
    if(obstacleGroup.isTouching(trex)){
        //trex.velocityY=-12;
        //jump.play();
      gamestate=END;
      die.play();
    }
  }

  else if(gamestate==END){
    ground.velocityX=0;
    obstacleGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    nubeGroup.setVelocityXEach(0);
    nubeGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided",trexCollided);
    trex.velocityY=0;
    gameOver.visible=true;
    gameRestart.visible=true;
    // text("Game Over", 300,100);
    if(touches.length>0 || mousePressedOver(gameRestart)){
      reset();
      touches=[];
    }
  }

  trex.collide(groundSafe);
  drawSprites();
  textSize(14);
  text("Score: "+ score, width-100,50);
}

function spawnClouds(){
  if(frameCount%40==0){
    nube=createSprite(width+5,100,40,10);
    nube.velocityX=-(3+score/100);
    nube.addImage(nubeImage);
    nube.scale=0.5;
    nube.y=Math.round(random(10,width-100));
    nube.depth=trex.depth;
    trex.depth+=1;
    nube.depth=gameRestart.depth;
    gameRestart.depht+=1;
    nube.depth=gameOver.depth;
    gameOver.depht=+1;
    nube.lifetime=440;
    //console.log(trex.depth, nube.depth);
    nubeGroup.add(nube);
  }
}

function spawnObstacles(){
  if(frameCount%60==0){
    obstacle=createSprite(width+5,height-35,10,40);
    obstacle.velocityX=-(6+score/100);
    obstacle.lifetime=220;
    obstacle.scale=0.5;
    obstacle.debug=false;
    var r = Math.round(random(1,6));
    switch(r){
      case 1:
        obstacle.addImage(cactus1);
        break;
      case 2:
        obstacle.addImage(cactus2);
        break;
      case 3:
        obstacle.addImage(cactus3);
        break;
      case 4:
        obstacle.addImage(cactus4);
        break;
      case 5:
        obstacle.addImage(cactus5);
        break;
      case 6:
        obstacle.addImage(cactus6);
        break;
      default:
        break;
    }
    obstacleGroup.add(obstacle);
  }
}
function reset(){
  gamestate=PLAY;
  gameOver.visible=false;
  gameRestart.visible=false;
  trex.y=187;
  obstacleGroup.destroyEach();
  nubeGroup.destroyEach();
  score=0;
  trex.changeAnimation("running",trex_running);
}