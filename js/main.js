/**
 * Created by cturner on 01/03/2017.
 */
var stage;
var renderer;
var spin;
var initStake;
var upbtn;
var downbtn;
var balance = 100.00;
var images = [];
var rng;
var reels;
var reelcount = 0;
var balancetxt;
var insufffunds;
var ok;

function init() {

    renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.view);
    renderer.backgroundColor = 0xffffff;
    stage = new PIXI.Container();

    //renderer.autoResize = true;
    //renderer.resize(window.innerWidth, window.innerHeight);

    window.addEventListener("resize", function (event) {
        scaleToWindow(renderer.view);
    });


    PIXI.loader
        .add(["img/background.png", "img/buttons/spin.png", "img/buttons/home.png", "img/buttons/soundon.png",
            "img/buttons/soundoff.png", "img/buttons/paytable.png", "img/buttons/stakefield.png", "img/buttons/up.png",
            "img/buttons/down.png", "img/buttons/no.png", "img/buttons/yes.png", "img/quitgame.png", "img/sym/blue_jelly.png",
            "img/sym/black_jelly.png", "img/sym/green_jelly.png", "img/sym/purple_jelly.png", "img/sym/red_jelly.png", "img/sym/yellow_jelly.png",
            "img/help.png", "img/dialog.png", "img/buttons/ok.png"])
        .on("complete", assetLoad)
        .load();

    refresh();
}

function assetLoad() {

    var background = new PIXI.Sprite(PIXI.loader.resources["img/background.png"].texture);
    background.scale.set(window.innerWidth / 1280, window.innerHeight / 720);
    background.position.set(0, 0);

    balancetxt = new PIXI.Text("£ " + balance.toFixed(2), {
        fontFamily: "Arial",
        fill: 0xFFFFFF,
        fontSize: 50,
        align: center
    });
    balancetxt.position.set(510,20);
    balancetxt.anchor.set(0,0);
    background.addChild(balancetxt);

    //Home Button - clicking closes the lobby

    var home = new PIXI.Sprite(PIXI.loader.resources["img/buttons/home.png"].texture);
    home.scale.set(0.5, 0.5);
    home.position.set(1250, 5);
    home.interactive = true;
    home.buttonMode = true;

    var quitdialog = new PIXI.Sprite(PIXI.loader.resources["img/quitgame.png"].texture);
    quitdialog.scale.set(0.75, 0.75);
    quitdialog.position.set(380, 160);

    var yesquit = new PIXI.Sprite(PIXI.loader.resources["img/buttons/yes.png"].texture);
    yesquit.scale.set(0.6, 0.6);
    yesquit.position.set(700, 420);
    yesquit.interactive = true;
    yesquit.buttonMode = true;

    var noquit = new PIXI.Sprite(PIXI.loader.resources["img/buttons/no.png"].texture);
    noquit.scale.set(0.6, 0.6);
    noquit.position.set(550, 420);
    noquit.interactive = true;
    noquit.buttonMode = true;

    home.mousedown = function (mouseData) {
        home.scale.set(0.48, 0.48);
        home.position.set(1251, 6);
        refresh();
    };
    home.mouseup = function (mouseData) {
        home.scale.set(0.5, 0.5);
        home.position.set(1250, 5);
        stage.addChild(quitdialog, yesquit, noquit);
        spin.interactive = false;
        soundOn.interactive = false;
        soundOff.interactive = false;
        home.interactive = false;
        paytableBtn.interactive = false;
        upbtn.interactive = false;
        downbtn.interactive = false;
        refresh();
    };

    yesquit.mousedown = function (mouseData) {
        yesquit.scale.set(0.58, 0.58);
        yesquit.position.set(701, 421);
        refresh();
    };
    yesquit.mouseup = function (mouseData) {
        window.close();
    };

    noquit.mousedown = function (mouseData) {
        noquit.scale.set(0.58, 0.58);
        noquit.position.set(551, 421);
        refresh();
    };
    noquit.mouseup = function (mouseData) {
        noquit.scale.set(0.6, 0.6);
        noquit.position.set(550, 420);
        stage.removeChild(quitdialog, yesquit, noquit);
        spin.interactive = true;
        soundOn.interactive = true;
        soundOff.interactive = true;
        home.interactive = true;
        paytableBtn.interactive = true;
        upbtn.interactive = true;
        downbtn.interactive = true;
        refresh();
    };


    //Sound off / Sound on button - toggle image and sound

    var soundOn = new PIXI.Sprite(PIXI.loader.resources["img/buttons/soundon.png"].texture);
    soundOn.scale.set(0.5, 0.5);
    soundOn.position.set(1180, 5);
    soundOn.interactive = true;
    soundOn.buttonMode = true;
    soundOn.mousedown = function (mouseData) {
        soundOn.scale.set(0.48, 0.48);
        soundOn.position.set(1181, 6);
        refresh();
    };
    soundOn.mouseup = function (mouseData) {
        soundOn.scale.set(0.5, 0.5);
        soundOn.position.set(1180, 5);
        stage.removeChild(soundOn);
        stage.addChild(soundOff);
        refresh();
    };

    var soundOff = new PIXI.Sprite(PIXI.loader.resources["img/buttons/soundoff.png"].texture);
    soundOff.scale.set(0.5, 0.5);
    soundOff.position.set(1180, 5);
    soundOff.interactive = true;
    soundOff.buttonMode = true;
    soundOff.mousedown = function (mouseData) {
        soundOff.scale.set(0.48, 0.48);
        soundOff.position.set(1181, 6);
        refresh();
    };
    soundOff.mouseup = function (mouseData) {
        soundOff.scale.set(0.5, 0.5);
        soundOff.position.set(1180, 5);
        stage.removeChild(soundOff);
        stage.addChild(soundOn);
        refresh();
    };

    //Paytable button - opens Paytable and hides the game

    var paytableBtn = new PIXI.Sprite(PIXI.loader.resources["img/buttons/paytable.png"].texture);
    paytableBtn.scale.set(0.5, 0.5);
    paytableBtn.position.set(1110, 5);
    paytableBtn.interactive = true;
    paytableBtn.buttonMode = true;

    var help = new PIXI.Sprite(PIXI.loader.resources["img/help.png"].texture);
    help.scale.set(0.6,0.6);
    help.position.set(330,0);

    var payquit = new PIXI.Sprite(PIXI.loader.resources["img/buttons/no.png"].texture);
    payquit.scale.set(0.6, 0.6);
    payquit.position.set(900, 50);
    payquit.interactive = true;
    payquit.buttonMode = true;

    paytableBtn.mousedown = function (mouseData) {
        paytableBtn.scale.set(0.48, 0.48);
        paytableBtn.position.set(1111, 5);
        refresh();
    };

    paytableBtn.mouseup = function (mouseData) {
        paytableBtn.scale.set(0.5, 0.5);
        paytableBtn.position.set(1110, 5);
        stage.addChild(help, payquit);
        spin.interactive = false;
        soundOn.interactive = false;
        soundOff.interactive = false;
        home.interactive = false;
        paytableBtn.interactive = false;
        upbtn.interactive = false;
        downbtn.interactive = false;
        refresh();
    };

    payquit.mousedown = function (mouseData) {
        payquit.scale.set(0.58, 0.58);
        payquit.position.set(901, 51);
        refresh();
    }
    payquit.mouseup = function (mouseData) {
        paytableBtn.scale.set(0.5, 0.5);
        paytableBtn.position.set(1110, 5);
        stage.removeChild(help, payquit);
        spin.interactive = true;
        soundOn.interactive = true;
        soundOff.interactive = true;
        home.interactive = true;
        paytableBtn.interactive = true;
        upbtn.interactive = true;
        downbtn.interactive = true;
        refresh();
    }

    insufffunds = new PIXI.Sprite(PIXI.loader.resources["img/dialog.png"].texture);
    insufffunds.scale.set(0.75,0.75);
    insufffunds.position.set(380,160);

    var insufficent = new PIXI.Text("NOT ENOUGH FUNDS",{fontFamily: "Arial", fill: 0xCC0000, fontSize: 50, align: 'left'});
    insufficent.anchor.set(-0.25,-4);
    insufffunds.addChild(insufficent);

    ok = new PIXI.Sprite(PIXI.loader.resources["img/buttons/ok.png"].texture);
    ok.scale.set(0.5,0.5);
    ok.position.set(640,420);
    ok.buttonMode = true;
    ok.interactive = true;

    ok.mousedown = function (mouseData){
        ok.scale.set(0.48,0.48);
        ok.position.set(641,421);
    }
    ok.mouseup = function (mouseData) {
        ok.scale.set(0.5,0.5);
        ok.position.set(640,420);
        stage.removeChild(insufffunds,ok);
        refresh();
    }

    //Spin button - Needs code to play the game

    spin = new PIXI.Sprite(PIXI.loader.resources["img/buttons/spin.png"].texture);
    spin.scale.set(0.4, 0.4);
    spin.anchor.set(0.5, 0.5);
    spin.position.set(1200, 400);
    spin.interactive = true;
    spin.buttonMode = true;
    spin.mouseover = function (mouseData) {
        animateSpin();
        refresh();
    };
    spin.mouseout = function (mouseData) {
        decreaseSpin();
        refresh();
    };
    spin.click = function (mouseData) {
        moveSprite();
        balance = balance - availStakes[stakepos];
        balancetxt.text = "£ " + balance.toFixed(2);
        refresh();
    };

    //Stake functionality

    var stakefield = new PIXI.Sprite(PIXI.loader.resources["img/buttons/stakefield.png"].texture);
    stakefield.scale.set(0.5, 0.5);
    stakefield.position.set(50, 340);
    initStake = new PIXI.Text("£" + availStakes[stakepos].toString(), {fontFamily: "Arial", fill: 0xFFFFFF, fontSize: 80, align: 'left'});
    initStake.position.set(122,125);
    initStake.anchor.set(0.5, 0.5);
    stakefield.addChild(initStake);
    stakefield.addChild(initStake);

    upbtn = new PIXI.Sprite(PIXI.loader.resources["img/buttons/up.png"].texture);
    upbtn.scale.set(0.5, 0.5);
    upbtn.position.set(65, 250);
    upbtn.interactive = true;
    upbtn.buttonMode = true;
    upbtn.mousedown = function (mouseData) {
        upbtn.scale.set(0.48, 0.48);
        upbtn.position.set(66, 251);
        refresh();
    };
    upbtn.mouseup = function (mouseData) {
        upbtn.scale.set(0.50, 0.50);
        upbtn.position.set(65, 250);
        increaseStake();
        checkbalance();
        refresh();
    };

    downbtn = new PIXI.Sprite(PIXI.loader.resources["img/buttons/down.png"].texture);
    downbtn.scale.set(0.5, 0.5);
    downbtn.position.set(65, 470);
    downbtn.interactive = true;
    downbtn.buttonMode = true;
    downbtn.mousedown = function (mouseData) {
        downbtn.scale.set(0.48, 0.48);
        downbtn.position.set(66, 471);
        refresh();
    };
    downbtn.mouseup = function (mouseData) {
        downbtn.scale.set(0.5, 0.5);
        downbtn.position.set(65, 470);
        decreaseStake();
        checkbalance();
        refresh();
    };
    //Add all of the above to the game

    stage.addChild(background, spin, home, soundOn, paytableBtn, stakefield, upbtn, downbtn);
    addReelSets();
    refresh();
}

//Code to add starting reels to the game

    function addReelSets() {
        //noinspection JSDuplicatedDeclaration


        for (var i = 0; i < 5; i++) {

            var H6 = new PIXI.Sprite(PIXI.loader.resources["img/sym/blue_jelly.png"].texture);
            H6.scale.set(0.4,0.4);
            var H5 = new PIXI.Sprite(PIXI.loader.resources["img/sym/green_jelly.png"].texture);
            H5.scale.set(0.4,0.4);
            var H4 = new PIXI.Sprite(PIXI.loader.resources["img/sym/purple_jelly.png"].texture);
            H4.scale.set(0.4,0.4);
            var H3 = new PIXI.Sprite(PIXI.loader.resources["img/sym/red_jelly.png"].texture);
            H3.scale.set(0.4,0.4);
            var H2 = new PIXI.Sprite(PIXI.loader.resources["img/sym/yellow_jelly.png"].texture);
            H2.scale.set(0.4,0.4);
            var H1 = new PIXI.Sprite(PIXI.loader.resources["img/sym/black_jelly.png"].texture);
            H1.scale.set(0.4,0.4);
            reels = [H1,H2,H3,H4,H5,H6];

            rng = Math.floor((Math.random()*5));

            images[i] = reels[rng];
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
    }

function refresh() {
    renderer.render(stage);
}

function animateSpin() {
    requestAnimationFrame(animateSpin);
    spin.rotation += 0.1;
    refresh();
}

function decreaseSpin() {
    requestAnimationFrame(decreaseSpin);
    spin.rotation -= 0.1;
    refresh();
}

function moveSprite() {

    if(reelcount === 3)
    {
        if (images[0].y >= 300) {
            cancelAnimationFrame(moveSprite);
            spin.interactive = true;
            reelcount = 0;
            checkbalance();
        }
        else {
            images[0].y += 10;
            images[1].y += 10;
            images[2].y += 10;
            images[3].y += 10;
            images[4].y += 10;
            requestAnimationFrame(moveSprite);
        }

    }

    else if (images[0].y >= 600) {
        stage.removeChild(images[0],images[1],images[2],images[3],images[4]);
        addReelSets();
        images[0].position.set(300,150);
        images[1].position.set(450,150);
        images[2].position.set(600,150);
        images[3].position.set(750,150);
        images[4].position.set(900,150);
        images[0].y += 10;
        images[1].y += 10;
        images[2].y += 10;
        images[3].y += 10;
        images[4].y += 10;
        reelcount = reelcount + 1;
        requestAnimationFrame(moveSprite);
    }
    else{
        images[0].y += 10;
        images[1].y += 10;
        images[2].y += 10;
        images[3].y += 10;
        images[4].y += 10;
        requestAnimationFrame(moveSprite);
    }
}


