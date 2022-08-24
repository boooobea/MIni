
//캔버스세팅 
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width=400;
canvas.height=500;

let game = document.querySelector('game');
game.appendChild(canvas);
// document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameoverImage;
let gameover = false;
let score = 0;

//우주선 좌표
let spaceshipX = canvas.width/2 - 32;
let spaceshipY = canvas.height - 58;

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src = "image/background.jpg";

    spaceshipImage = new Image();
    spaceshipImage.src = "image/rocket.png";

    bulletImage = new Image();
    bulletImage.src ="image/bullet.png";

    enemyImage = new Image();
    enemyImage.src = "image/enemy.png";

    gameoverImage = new Image();
    gameoverImage.src = "image/gameover.jpg";
}//loadImage


let bulletList = [];
function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.x = spaceshipX+18;
        this.y = spaceshipY;
        this.alive = true //살아있는총알 ,false 는 죽은총알 
        bulletList.push(this);
    }//init
    this.update = function(){
        this.y -= 7;
    };

    this.checkHit = function(){
        for(let i=0; i<enemyList.length; i++){
            if(this.y <=enemyList[i].y &&
               this.x >=enemyList[i].x &&
               this.x <=enemyList[i].x+40){
                score ++;

                this.alive = false;
                enemyList.splice(i, 1);//총알 만나서 false, 잘라냄 
            }//if
        };//for
    };//checkHit
}; //총알 정의

let enemyList = [];
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init= function(){
        this.y = 0;
        this.x = generateRandomValue(0,canvas.width-48);
        enemyList.push(this);
        // console.log(enemyList);
    };//init
    this.update = function(){
        this.y += 2;

        if(this.y >= canvas.height-48){
            gameover=true;
            console.log("gameover");
        }//바닥에 닿으면 게임 끝
    }
};// 적

function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum;
}//랜덤 적 좌표


let keysDown={};
function setupKeyboardListener(){
    document.addEventListener("keydown", function(event){

        keysDown[event.keyCode] = true;
        console.log("키다운객체에 들어간 값",keysDown);
    })

    document.addEventListener("keyup", function(event){
        delete keysDown[event.keyCode];
        console.log("클릭후",keysDown);

        if(event.keyCode==32){
            createBullet(); //스페이스바 누를시 총알 생성
            
        }//if
    });
}//setupKeyboardListener

function createBullet(){
    console.log("총알");
    let b = new Bullet();   //객체생성
    b.init();               //객체초기화(값수정)
    console.log("새로운 총알 리스트", bulletList);
};

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init();
        // console.log(e);
    },1000);
};//적 생성


function update(){
    if( 39 in keysDown){ //right
        spaceshipX += 4
    } //right
    if( 37 in keysDown){
        spaceshipX -= 4
    }// left

    if(spaceshipX <= 0){
        spaceshipX = 0;
    }
    if(spaceshipX >= canvas.width-58){
        spaceshipX = canvas.width-58;
    }   // 우주선 좌표값 설정 

    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    };  //총알 위치 업데이트 

    for(let i=0; i<enemyList.length; i++){
        enemyList[i].update();
    };  //적군 위치 업데이트 
}//update

//이미지렌더링
function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    ctx.fillText(`Score:${score}`, 30, 30);
    ctx.fillStyle = "white";
    ctx.font ="20px Arial";

    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
            
        };//if
    }//총알list 만큼 총알 이미지랜더링

    for(let i=0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }//적list 만큼 이미지 랜더링 
}//render

function main(){
    if(!gameover){ //게임오버 
        update() //좌표값을 입력
        render() //이미지그리기 
        requestAnimationFrame(main) //계속호출 
    } else {
        ctx.drawImage(gameoverImage,10,100,380,380);
        show();
    }
}//main


//----------------
loadImage();
setupKeyboardListener();
createEnemy();
main();

function show(){
    let divShow = document.querySelector(".show");

    let str = "";

    str += "<button type='button' class='gameBtn'>Replay</button>";
    divShow.appendChild(str)
}