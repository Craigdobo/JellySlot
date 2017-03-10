/**
 * Created by cturner on 06/03/2017.
 */
var availStakes = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var stakepos = 1;

function increaseStake(){
    if (stakepos > 7){
        upbtn.interactive = false;
    }
    else{
        stakepos = stakepos + 1;
        initStake.text = availStakes[stakepos].toString();
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
        initStake.text = availStakes[stakepos].toString();
        downbtn.interactive = true;
        upbtn.interactive = true;
    }
}