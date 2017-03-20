/**
 * Created by cturner on 06/03/2017.
 */
var availStakes = [0.20, 0.50, 1, 2, 4, 5, 8, 10, 25, 50, 100, 200];
var stakepos = 3;
var winlines = [[0,1,2],[1,2,3],[2,3,4],[0,1,2,3],[1,2,3,4],[0,1,2,3,4,5]];
var winnings;
var reels;
var rngArray = [];
var rngnumber;
var stake = availStakes[stakepos];

function rng(){
    rngnumber = Math.floor((Math.random()* 5));
}

function increaseStake(){

    if (stakepos > availStakes.length){
        upbtn.interactive = false;
    }
    else{
        stakepos = stakepos + 1;
        stake = availStakes[stakepos];
        initStake.text = "£" + availStakes[stakepos].toString();
        upbtn.interactive = true;
        downbtn.interactive = true;
    }
}

function decreaseStake(){
    if (stakepos < 1){
        downbtn.interactive = false;
    }
    else{
        stakepos = stakepos - 1;
        stake = availStakes[stakepos];
        initStake.text = "£" + availStakes[stakepos].toString();
        downbtn.interactive = true;
        upbtn.interactive = true;
    }
}

function checkbalance() {
    if(availStakes[stakepos] > balance){
        spin.interactive = false;
        keyObject.press = null;
        stage.addChild(insufffunds,ok);
        refresh();
    }
    else{
        spin.interactive = true;
        keyObject.press = function() {
            spingame()
        };
    }

}

function checkbalanceDown() {
    if(availStakes[stakepos] > balance){
        keyObject.press = null;
        spin.interactive = false;
        refresh();
    }
    else{
        spin.interactive = true;
        keyObject.press = function() {
            spingame()
        };
    }

}

function addReelSets() {
    //noinspection JSDuplicatedDeclaration

    for (var i = 0; i < 5; i++) {

        H6 = new PIXI.Sprite(PIXI.loader.resources["img/sym/blue_jelly.png"].texture);
        H6.scale.set(0.4,0.4);
        H5 = new PIXI.Sprite(PIXI.loader.resources["img/sym/green_jelly.png"].texture);
        H5.scale.set(0.4,0.4);
        H4 = new PIXI.Sprite(PIXI.loader.resources["img/sym/purple_jelly.png"].texture);
        H4.scale.set(0.4,0.4);
        H3 = new PIXI.Sprite(PIXI.loader.resources["img/sym/red_jelly.png"].texture);
        H3.scale.set(0.4,0.4);
        H2 = new PIXI.Sprite(PIXI.loader.resources["img/sym/yellow_jelly.png"].texture);
        H2.scale.set(0.4,0.4);
        H1 = new PIXI.Sprite(PIXI.loader.resources["img/sym/black_jelly.png"].texture);
        H1.scale.set(0.4,0.4);
        reels = [H1,H2,H3,H4,H5,H6];

        rng();
        images[i] = reels[rngnumber];
        rngArray[i] = rngnumber;
    }
    images[0].position.set(300,300);
    images[1].position.set(450,300);
    images[2].position.set(600,300);
    images[3].position.set(750,300);
    images[4].position.set(900,300);

    //noinspection JSDuplicatedDeclaration
    for (var i = 0; i < images.length; i++) {
        stage.addChild(images[i]);
        refresh();
    }
    console.log(reels[rng]);
}

function checkwinnings(){

    if((rngArray[0] === rngArray[1]) && (rngArray[1] === rngArray[2]) && (rngArray[2] === rngArray[3]) && (rngArray[3] === rngArray [4])) {
        winnings = availStakes[stakepos] * 20;
        wintxt.text = "You have won " + winnings.toFixed(2);
        console.log(winnings.toString());
        balance = balance + winnings;
        balancetxt.text = "£ " + balance.toFixed(2);
    }
        else if((rngArray[0] === rngArray[1]) && (rngArray[1] === rngArray[2]) && (rngArray[2] === rngArray[3])){
        winnings = availStakes[stakepos] * 10;
        wintxt.text = "You have won £ " + winnings.toFixed(2);
        console.log(winnings.toString());
        balance = balance + winnings;
        balancetxt.text = "£ " + balance.toFixed(2);
    }
    else if((rngArray[1] === rngArray[2]) && (rngArray[2] === rngArray[3]) && (rngArray[3] === rngArray[4])){
        winnings = availStakes[stakepos] * 10;
        wintxt.text = "You have won £ " + winnings.toFixed(2);
        console.log(winnings.toString());
        balance = balance + winnings;
        balancetxt.text = "£ " + balance.toFixed(2);
    }
    else if ((rngArray[0] === rngArray[1]) && (rngArray[1] === rngArray[2])){
        winnings = availStakes[stakepos] * 5;
        wintxt.text = "You have won £ " + winnings.toFixed(2);
        console.log(winnings.toString());
        balance = balance + winnings;
        balancetxt.text = "£ " + balance.toFixed(2);
    }
    else if ((rngArray[2] === rngArray[3]) && (rngArray[3] === rngArray[4])){
        winnings = availStakes[stakepos] * 5;
        wintxt.text = "You have won £ " + winnings.toFixed(2);
        console.log(winnings.toString());
        balance = balance + winnings;
        balancetxt.text = "£ " + balance.toFixed(2);
    }
    else if ((rngArray[1] === rngArray[2]) && (rngArray[2] === rngArray[3])){
        winnings = availStakes[stakepos] * 5;
        wintxt.text = "You have won £ " + winnings.toFixed(2);
        balance = balance + winnings;
        balancetxt.text = "£ " + balance.toFixed(2);
    }
    else{
        winnings = "No win this time"
        wintxt.text = winnings;
    }
    refresh();
}