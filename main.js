var canvas = document.getElementById("canvas");

var c = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;

// Declaring Sprite Variables
var spr_ship = new Image();
var spr_bullet = new Image();
var spr_astroid = new Image();
var spr_pasue = new Image();
var spr_shop_bullet = new Image();
var spr_slow_motion = new Image();
var spr_thrusters = new Image();
var heart = new Image();
var spr_extra_hearts = new Image();
var BG = new Image();
var spr_shop_bullet_2 = new Image();
var spr_quantum_shift = new Image();
var spr_shop_bot = new Image();
var spr_ghost = new Image();
var spr_bot = new Image();
var spr_bot_bullet = new Image();
var red_skin = new Image();
var blue_skin = new Image();
var green_skin = new Image();
var gold_skin = new Image();
var steel_skin = new Image();
var spr_ship_ghost = new Image();
var spr_tick = new Image();
var spr_current_colour = new Image();
var spr_shop_division = new Image();
var spr_ship_division = new Image();
var spr_division_bullet = new Image();
var purple_skin = new Image();
var spr_shop = new Image();

// Sourcing Sprite Variables
spr_current_colour.src = "Sprites/current_colour.png";
spr_tick.src = "Sprites/tick.png";
spr_ship_ghost.src = "Sprites/ship_ghost.png";
red_skin.src = "Sprites/red_skin.png";
blue_skin.src = "Sprites/blue_skin.png";
green_skin.src = "Sprites/green_skin.png";
gold_skin.src = "Sprites/gold_skin.png";
steel_skin.src = "Sprites/steel_skin.png";
spr_bot_bullet.src = "Sprites/bullet_3.png";
spr_bot.src = "Sprites/bot.png";
spr_ghost.src = "Sprites/ghost.png";
spr_shop_bot.src = "Sprites/shop_bot.png";
spr_quantum_shift.src = "Sprites/quantum_shift.png";
spr_shop_bullet_2.src = "Sprites/shop_bullet_2.png";
spr_extra_hearts.src = "Sprites/extra_hearts.png";
spr_shop_bullet.src = "Sprites/shop_bullet.png";
spr_slow_motion.src = "Sprites/slow_motion.png";
spr_ship.src = "Sprites/ship.png";
spr_bullet.src = "Sprites/bullet.png";
spr_astroid.src = "Sprites/astroid.png";
spr_pasue.src = "Sprites/pause.png";
heart.src = "Sprites/heart.png";
spr_thrusters.src = "Sprites/thrusters.png";
BG.src = "Sprites/BG.gif";
spr_shop_division.src = "Sprites/shop_division.png";
spr_ship_division.src = "Sprites/ship_division.png";
spr_division_bullet.src = "Sprites/bullet_4.png";
purple_skin.src = "Sprites/purple_skin.png";
spr_shop.src = "Sprites/shop.png";

var bulletObj = {x:0,y:0,BSspd:10}
var mainObj = {x:386,y:450,PSspd:8,PSmny:9999,PShlth:8,PSospd:8,size:64};
var astroid = {x:200,y:200,ASspd:5,spawnRate:1};
var bot_obj = {x:mainObj.x,y:540,BtSspd:17,size:64};
var divisionObj = {x:mainObj.x,y:mainObj.y,spd:mainObj.PSspd};
var right, left, up, down, shift = false;
var astroidArray = [];
var wave_count = 0;
var wave = 1;
var bulletArray = [];
var botArray = [];
var pause = false;
var inShop = false;
var Mx = 0;
var My = 0;
var dead = false;
var BGX = -100;
var BGY = -100;
var shoot = false;
var isbot = false;
var ghost = false;
var bought = [false, false, false, false, false, false, false, false, false];
var current_colour = [1, 0, 0, 0, 0, 0];
var bshooting = true;
var division1 = false;
var wait = 200;
var Mmx = 0;
var Mmy = 0;
var opacity = 0;

function mouse_movement(evnt) {
    Mmx = evnt.clientX;
    Mmy = evnt.clientY;
}

function mouse(e) {
    var ev = e || window.event;
    Mx = ev.clientX - canvas.offsetLeft;
    My = ev.clientY - canvas.offsetTop;
}

c.imageSmoothingEnabled = false;
window.addEventListener("load", mainLoop);
window.addEventListener("click", shooting);
window.addEventListener("mouseup", function() {
    shoot = false;
});
canvas.addEventListener("click", mouse);
window.addEventListener("mousedown", function() {
    if (bought[7]) {
        shooting();
    }
    shoot = true;
});
canvas.addEventListener("mousemove", mouse_movement);

function mainLoop(time) {
    window.requestAnimationFrame(mainLoop);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(BG, BGX, BGY, 1100, 1100);
    if (dead == true) {
        pause = false;
        inShop = false;
        c.textAlign = "center";
        c.font = "80px game_font";
        c.fillText("Game Over", (canvas.width / 2), (canvas.height / 2));
        return;
    }

    if (pause && !dead) {
        c.drawImage(spr_pasue, (canvas.width / 2) - 32, (canvas.height / 2) - 32, 64, 64);
        return;
    }

    if (!inShop) {

        for (var e = 0; e < bulletArray.length; e++) {
            if (!dead) {
                c.drawImage(spr_bullet, bulletArray[e].x, bulletArray[e].y - 10, mainObj.size, mainObj.size);
            }
            bulletArray[e].y -= bulletArray[e].spd;
            if (bulletArray[e].y < -bulletObj.size) {
                bulletArray.splice(e, 1);
            }
        }


        if (division1 == true) {
            c.drawImage(spr_ship_division,divisionObj.x,divisionObj.y,mainObj.size,mainObj.size);
        }

        if (isbot) {

            if (astroidArray.length > 0) {
                if (astroidArray[0].x < bot_obj.x) {
                    bot_obj.x -= bot_obj.BtSspd;
                } else if (astroidArray[0].x > bot_obj.x) {
                    bot_obj.x += bot_obj.BtSspd;
                }
                if ((bot_obj.x == astroidArray[0].x || bot_obj.x == astroidArray[0].x) && bshooting) {
                    bot_shooting();
                    bshooting = false;
                    window.setTimeout(function() {
                        bshooting = true;
                    }, wait);
                } else if (astroidArray[0].x <= bot_obj.x && astroidArray[0].x + 17 > bot_obj.x) {
                    bot_obj.x = astroidArray[0].x;
                }
            }

            c.drawImage(spr_bot, bot_obj.x, bot_obj.y, 64, 64);
            for (var e = 0; e < botArray.length; e++) {
                if (!dead) {
                    c.drawImage(spr_bot_bullet, botArray[e].x, botArray[e].y, botArray[e].size, botArray[e].size);
                    botArray[e].y -= 20;
                }
            }
        }

        if (bought[7] && shoot) {
            shooting();
        }

        BGX = -5 - mainObj.x / 6;
        BGY = -10 - mainObj.y / 6;

        c.drawImage(spr_ship, mainObj.x, mainObj.y, mainObj.size, mainObj.size);
        if (ghost && mainObj.PShlth <= 0) {
            mainObj.PShlth = 10;
            spr_ship.src = spr_ship_ghost.src;
            ghost = false;

        }
        if (mainObj.PShlth <= 0 && !ghost) {
            window.setTimeout(function() {
                dead = false;
            }, 3000);
            dead = true;
        }

        for (var i = 0; i < astroidArray.length; i++) {
            c.drawImage(spr_astroid, astroidArray[i].x, astroidArray[i].y, 64, 64);
            astroidArray[i].y += astroidArray[i].spd;
            if (astroidArray[i].y > 700) {
                astroidArray.splice(i, 1);
            }
        }

                        c.globalAlpha = 0.4;
        c.fillStyle = "#191919";
    c.fillRect(829, 7, 64, 64);
    c.globalAlpha = 1;
    c.strokeStyle = "#FFFFFF";
    c.lineWidth = 2;
    c.strokeRect(829, 7, 64, 64);
    c.drawImage(spr_shop, 829, 7, 64, 64);

    if ((829 < Mx && Mx < 829 + 64) && (7 < My && My < 7 + 64)) {
            Mx = 0;
            My = 0;
            inShop = true;
    }

        checkBorders();
        movement();
        spawning();
        collision();

        if (dead == true) {
            spr_ship.src = "Sprites/ship.png";
            spr_bullet.src = "Sprites/bullet.png";

            mainObj = {x:386,y:450,PSspd:7,PSmny:0,PShlth:8,PSospd:8,size:64}
            bulletObj.BSspd = 10;
            astroid.speed = 4;
            astroid.spawnRate = 1;
            astroidArray = [];
            botArray = [];
            bulletArray = [];
            bought = [false, false, false, false, false, false, false, false, false];
            bot_obj = {x:0, y:540, BtSspd:10};
            isbot = false;
            ghost = false;
            current_colour = [1, 0, 0, 0, 0];
            wave = 1;
            wave_count = 0;
            division1 = false;
            wait = 200;
            spr_bot.src = "Sprites/bot.png";
            spr_bot_bullet.src = "Sprites/bot_bullet.png";

        }
        c.fillStyle = "white";
        c.font = "25px Arial";
        c.textAlign = "left";
        c.fillText("£ " + mainObj.PSmny, 7, 25);
        c.fillText("wave: " + wave, 7, 50);
        c.drawImage(heart, 3, 58, 33, 27);
        c.fillText(mainObj.PShlth, 40, 80);

    } else if (inShop && !dead) {
        BGX = -(Mmx/6);
        BGY = -(Mmy/6);
        pause = false;
        c.lineWidth = 2;
        c.textAlign = "left";
        c.fillStyle = "#232323";
        c.strokeStyle = "white";
        c.fillRect(0, 0, canvas.width, 35);
        c.strokeRect(-50, -100, canvas.width+100, 135);
        c.fillStyle = "white";
        c.fillText("£ " + mainObj.PSmny, 10 , 25);

        newShopSlot(40, 70, 120, spr_shop_bullet, 100, "Laser Bullets", 0, laser_bullet);
        newShopSlot(180, 70, 120, spr_slow_motion, 200, "Slow Motion", 3, slow_motion);
        newShopSlot(320, 70, 120, spr_extra_hearts, 300, "Extra Hearts", 1, steel_body);
        newShopSlot(460, 70, 120, spr_thrusters, 400, "Thrusters", 2, upgraded_thruster);
        newShopSlot(600, 70, 120, spr_ghost, 810, "Ghost Ship", 4, ghost_mode);
        newShopSlot(740, 70, 120, spr_bot, 1010, "Bot", 5, bot);

        newShopSlot(40, 250, 120, spr_quantum_shift, 1560, "Quantum Shift", 6, quantum_shift);
        newShopSlot(180, 250, 120, spr_shop_division, 2100, "Division", 7, func_division);
        newShopSlot(320, 250, 120, spr_shop_bullet_2, 3100, "Charged Bullets", 8, SCbullet);


        newSkinSlot(764, 550, 96, 39, "Sprites/ship.png", "Red", red_skin, 0);
        newSkinSlot(648, 550, 96, 39, "Sprites/neon_green.png", "neonGreen", green_skin, 1);
        newSkinSlot(532, 550, 96, 39, "Sprites/vibrant_blue.png", "Vibrant Blue", blue_skin, 2);
        newSkinSlot(416, 550, 96, 39, "Sprites/gold.png", "Golden", gold_skin, 3);
        newSkinSlot(300, 550, 96, 39, "Sprites/steel.png", "Steel", steel_skin, 4);
        newSkinSlot(184, 550, 96, 39, "Sprites/purple.png", "Mystic Purple", purple_skin, 5);
    }
}

function checkBorders() {
    if (mainObj.x > canvas.width - 60) {
        mainObj.x = canvas.width - 64;
        divisionObj.x = 1;
    }
    if (mainObj.x < 0) {
        mainObj.x = 0;
        divisionObj.x = canvas.width - 64;
    }
    if (mainObj.y >= canvas.height - mainObj.size) {
        mainObj.y = canvas.height - mainObj.size;
        divisionObj.y = canvas.height - mainObj.size;
    }
    if (mainObj.y <= 0) {
        mainObj.y = 1;
        divisionObj.y = 1;

    }

    for (var z = 0; z < astroidArray.length; z++) {
        if (astroidArray[z].x > canvas.width - 60) {
            astroidArray[z].x = canvas.width - 64;
        } else if (astroidArray[z].x < 0) {
            astroidArray[z].x = 0;
        } else if (astroidArray[z].y >= canvas.height) {
            mainObj.PShlth -= 1;
            astroidArray.splice(z, 1);
        }
    }
}

function movement() {
    if (right == true) {
        mainObj.x += mainObj.PSspd;
        divisionObj.x -= mainObj.PSspd;
    }
    if (left == true) {
        mainObj.x += -mainObj.PSspd;
        divisionObj.x += mainObj.PSspd;
    }
    if (up == true) {
        mainObj.y += -mainObj.PSspd;
        divisionObj.y += -mainObj.PSspd;
    }
    if (down == true) {
        mainObj.y += mainObj.PSspd;
        divisionObj.y += mainObj.PSspd;
    }
    if (shift == true) {
        mainObj.PSspd = 20;
    }
    if (shift == false) {
        mainObj.PSspd = mainObj.PSospd;
    }
}

document.onkeyup = function(event) {
    var key_up = event.keyCode;
    if (key_up == 39 || key_up == 68) {
        right = false;
    } else if (key_up == 37 || key_up == 65) {
        left = false;
    } else if (key_up == 38 || key_up == 87) {
        up = false;
    } else if (key_up == 40 || key_up == 83) {
        down = false;
    } else if (key_up == 32) {
        shooting();
        shoot = false;
    } if (key_up == 16) {
        shift = false;
    }
};

document.onkeypress = function(event) {
    var key = window.event.keyCode;
    if (key == 32 && bulletObj.BSspd == 15) {
        shooting();
        shoot = true;
    }
};

document.onkeydown = function(event) {
    var key_pressed = event.keyCode;
    if (key_pressed == 39 || key_pressed == 68) {
        right = true;
    } else if (key_pressed == 37 || key_pressed == 65) {
        left = true;
    } else if (key_pressed == 38 || key_pressed == 87) {
        up = true;
    } else if (key_pressed == 40 || key_pressed == 83) {
        down = true;
    } else if (key_pressed == 27) {
        if (inShop) {
            inShop = false;
        } else {
            pause = !pause;
        }
    } else if (key_pressed == 77) {
        if (pause) {
            inShop = false;
        } else {
        Mx = 0;
        My = 0;
            inShop = !inShop;
        }
    }
    if (key_pressed == 16 && right && bought[4]) {
        shift = true;

    } else if (key_pressed == 16 && left && bought[4]) {
        shift = true;}
};

function shooting() {
    bulletArray.push({x:mainObj.x, y:mainObj.y, spd:bulletObj.BSspd, size:mainObj.size});

    if (division1) {
        bulletArray.push({x:divisionObj.x, y:divisionObj.y,spd:bulletObj.BSspd,size:mainObj.size, size:mainObj.size});
    }
}

function collision() {
    for (var s = 0; s < bulletArray.length; s++) {
        for (var j = 0; j < astroidArray.length; j++) {
            if (bulletArray.length == 0) {
                break;
            }
            if ((astroidArray[j].x + 64) >= (bulletArray[s].x) && (astroidArray[j].x) <= (bulletArray[s].x + mainObj.size) &&
                (astroidArray[j].y + 64) >= (bulletArray[s].y) && (astroidArray[j].y) <= (bulletArray[s].y + mainObj.size)) {
                astroidArray.splice(j, 1);
                bulletArray.splice(s, 1);
                mainObj.PSmny += 2;
            }
        }
    }
    for (var s = 0; s < botArray.length; s++) {
        for (var j = 0; j < astroidArray.length; j++) {
            if (botArray.length == 0) {
                break;
            } else if ((astroidArray[j].x + 64) >= (botArray[s].x) && (astroidArray[j].x) <= (botArray[s].x + mainObj.size) &&
                (astroidArray[j].y + 64) >= (botArray[s].y) && (astroidArray[j].y) <= (botArray[s].y + mainObj.size)) {
                astroidArray.splice(j, 1);
                botArray.splice(s, 1);
                mainObj.PSmny += 2;
            }
        }
    }

    for (var j = 0; j < astroidArray.length; j++) {
        if ((astroidArray[j].x + 64) >= (mainObj.x) && (astroidArray[j].x) <= (mainObj.x + mainObj.size) &&
            (astroidArray[j].y + 64) >= (mainObj.y) && (astroidArray[j].y) <= (mainObj.y + mainObj.size)) {
            mainObj.PShlth -= 1;
            astroidArray.splice(j, 1);
        }
    }
}

function spawning() {
    if (astroidArray.length == 0) {
        for (var a=0;a<astroid.spawnRate;a++) {
        astroidArray.push({x:Math.floor(Math.random() * canvas.width), y:-100, spd:(Math.random() * astroid.ASspd) + 1});
    }
        if (wave_count == 12) {
            astroid.spawnRate += wave;
            wave += 1;
            wave_count = 0;
        } else {wave_count += 1;}
    }
}

function newShopSlot(x, y, size, sprite, price, name, index, func) {
    c.globalAlpha = 0.4;
    c.fillStyle = "#191919";
    c.fillRect(x, y, size, size);
    c.globalAlpha = 1;
    c.strokeRect(x, y, size, size);
    c.drawImage(sprite, x, y, size, size);
    c.textAlign = "left";
    c.font = "18px Arial";
    c.fillStyle = "#e0e0e0"
    c.fillText(name, x, y + size + 25);
    c.fillText("£ " + price, x, y + size + 50);
    c.font = "12px Arial";
    c.font = "20px Arial";
    if (bought[index] == 0) {
        if ((x < Mx && Mx < x + size) && (y < My && My < y + size)) {
            Mx = 0;
            My = 0;

            if (mainObj.PSmny >= price) {
                func();
                bought[index] = 1;
                mainObj.PSmny -= price;
                astroidArray = [];
                bulletArray = [];
                botArray = [];
            }
        }
    } else {
        c.drawImage(spr_tick, x, y, size, size);
    }
}

function newSkinSlot(x, y, sizeW, sizeH, source, name, sprite, index) {
    c.globalAlpha = 1
    c.strokeRect(x, y, sizeW, sizeH);
    c.drawImage(sprite, x, y, sizeW, sizeH);
    c.textAlign = "center";
    c.globalAlpha = opacity
    c.fillText(name, x+(sizeW/2), y-10);
    c.globalAlpha = 1
    c.fillStyle = "white";
    if ((x < Mx && Mx < x + sizeW) && (y < My && My < y + sizeH)) {
        Mx = 0;
        My = 0;
        if (spr_ship.src != spr_ship_ghost.src) {
            spr_ship.src = source;
            current_colour = [0, 0, 0, 0, 0];
            current_colour[index] = 1;
        }
    } //if ((x < Mmx && Mmx < x + sizeW) && (y < Mmy && Mmy < y + sizeH)) {
//        opacity = 1;
//        } else {opacity = 0}

    if (current_colour[index] == 1 && spr_ship.src != spr_ship_ghost.src) {
        c.drawImage(spr_current_colour, x, y, sizeW, sizeH);
    }
}

function slow_motion() {
    astroid.ASspd /= 2;
}

function upgraded_thruster() {
    mainObj.PSspd = 10;
    mainObj.PSospd = 10;
}

function quantum_shift() {
    mainObj.PSspd = 12;
    mainObj.PSospd = 12;
}

function laser_bullet() {
        bulletObj.BSspd = 15;
        spr_bullet.src = "Sprites/bullet_2.png";
}

function steel_body() {
    mainObj.PShlth += 5;
}

function bot() {
    isbot = true
    wait = 75
}

function bot_shooting() {
    botArray.push({x:bot_obj.x, y:bot_obj.y, spd:bot_obj.BtSspd, size:bot_obj.size});
}

function ghost_mode() {
    ghost = true;
}

function func_division() {
    division1 = true;
}

function SCbullet() {
    spr_bullet.src = "Sprites/bullet_3.png";
}

function compare(a, b) {
    if (a.speed < b.speed) {return 1}
    if (a.speed > b.speed) {return -1}
    return 0
}
