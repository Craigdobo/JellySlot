/**
 * Created by cturner on 06/03/2017.
 */
var availStakes = [0.20, 0.50, 1, 2, 4, 5, 8, 10, 25, 50, 100, 200];
var stakepos = 3;

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
