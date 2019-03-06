function i_exp(percent){
    return percent ** 0.75;
}

function interpolate(max, value, min, i_func){
    return i_func((value - min) / max);
}

function prepad(str, chr, target){
    while(str.length < target) str = chr + str;
    return str;
}

function drawPoly(ctx, vertices){
    let moved = false;
    for(idx in vertices){
        if(moved){
            ctx.lineTo(vertices[idx].x, vertices[idx].y);
        }else{
            moved = true;
            ctx.moveTo(vertices[idx].x, vertices[idx].y);
        }
    }
    ctx.closePath();
}

function drawSplash(canvas, ctx, splash, config){
    let curtime = splash.time/config.maxTime;
    ctx.strokeStyle = "#c7c7db" + prepad(Math.floor((1-i_exp(curtime)) * 255).toString(16), "0", 2);
    ctx.lineWidth = 2;
    ctx.beginPath();
    //ctx.arc(splash.x, splash.y, curtime * splash.size, 0, 2 * Math.PI);
    ctx.ellipse(splash.x, splash.y, curtime * splash.size * 2, curtime * splash.size, 0, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    return curtime < 1.0;
}

function run(canvas, framerate){
    const ctx = canvas.getContext('2d');
    ctx.canvas.width = 1000;
    ctx.canvas.height = 1000;
    let config = {
        maxTime: framerate/2,   // Create a ring in 0.5 seconds
        maxRadius: 30,          // Ring radius should be 50 units
        getTimeout: (framerate) => { return Math.floor(Math.random() * .0125 * framerate); }
    };
    let splashes = [];
    let timer = null;
    let time = 0;
    let nextTimeout = 0;
    let timeout = 0;
    let windTimeout = 0;
    let nextWindTimeout = 0;
    let dropHeight = 10;
    let dropWidth = 0.5;
    let fallspeed = 30;
    let windTarget = -Math.PI  / 4;
    let nextWind = 0;
    let rectRadius = Math.sqrt((dropHeight ** 2) + (dropWidth ** 2));
    let windInc = (wind) => { return 0; };
    let windChangeStep = Math.PI/512;

    let rectX = dropWidth;
    let rectY = dropHeight * 2;

    timer = setInterval(function(){
        if(windTimeout >= nextWindTimeout){
            windTimeout = 0;
            nextWindTimeout = 5 * framerate + (Math.random() * 10 * framerate);
            nextWind = (-Math.PI / 4) + (Math.random() * Math.PI / 2);
            windInc = nextWind > windTarget ? () => { windTarget = Math.min(windTarget + windChangeStep, nextWind); } : () => {windTarget = Math.max(windTarget - windChangeStep, nextWind); };
        }
        if(timeout >= nextTimeout){
            for(var n = nextTimeout == 0 ? 1 : (timeout / nextTimeout); n > 0; --n)
            {
                let x = (Math.random() * ctx.canvas.width * 3) - (ctx.canvas.width * 1.5);
                let y = Math.random() * ctx.canvas.height;
                splashes.push({
                    dropY: 0,
                    x: x,
                    y: y,
                    size: 20 + Math.random() * 60,
                    time: 0
                });
            }
            nextTimeout = config.getTimeout(framerate);
            timeout = 0;
        }
        ctx.fillStyle = "#0f173a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
                
        let wts = Math.sin(windTarget);
        let wtc = Math.cos(windTarget);
        let x_x_comp = rectX * wtc;
        let x_y_comp = rectY * wts;
        let y_x_comp = rectY * wtc;
        let y_y_comp = rectX * wts;

        let dropTLX = -x_x_comp + x_y_comp;
        let dropBLX = -x_x_comp - x_y_comp;
        let dropBRX = x_x_comp - x_y_comp;
        let dropTRX = x_x_comp + x_y_comp;

        
        let dropTLY = -y_x_comp - y_y_comp;
        let dropBLY = y_x_comp - y_y_comp;
        let dropBRY = y_x_comp + y_y_comp;
        let dropTRY = -y_x_comp + y_y_comp;


        let toRemove = [];
        for(index in splashes){
            let cursplash = splashes[index];
            
            if(cursplash.dropY != cursplash.y){
                ctx.fillStyle = "#c7c7db";
                ctx.beginPath();
                drawPoly(ctx, [
                    { // Top-left vertex of rect
                        x: dropTLX + cursplash.x,
                        y: dropTLY + cursplash.dropY
                    },
                    { // Bottom-left vertex of rect
                        x: dropBLX + cursplash.x,
                        y: dropBLY + cursplash.dropY
                    },
                    { // Bottom-right vertex of rect
                        x: dropBRX + cursplash.x,
                        y: dropBRY + cursplash.dropY
                    },
                    { // Top-right vertex of rect
                        x: dropTRX + cursplash.x,
                        y: dropTRY + cursplash.dropY
                    }
                ]);
                ctx.fill();
                cursplash.dropY = Math.min(cursplash.y, Math.sin(windTarget + Math.PI / 2) * fallspeed + cursplash.dropY);
                cursplash.x += Math.cos(windTarget + Math.PI / 2) * fallspeed;
            }else{
                let cont = drawSplash(canvas, ctx, cursplash, config);
                cursplash.time += 1;
                if(!cont) toRemove.push(cursplash);
            }
        }
        windInc();
        splashes = splashes.filter((item) => { return toRemove.indexOf(item) == -1; });
        timeout += 1;
        if(windTarget == nextWind) windTimeout += 1;
    }, 1 / framerate * 1000);   // framerate in milliseconds
}
