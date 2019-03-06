window.addEventListener("load", () => {
	let canvas = document.getElementById("canvas");
	let body = document.getElementsByTagName("body")[0];
	canvas.width  = body.clientWidth * 2;
	canvas.height = body.clientHeight * 2;

	let ctx = canvas.getContext("2d");
	ctx.fillStyle = "#FFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	let global = {
		update: () => {
			// Circles
			if (!global.started) {
				global.started = true;
				global.points = [
					{
						r: canvas.height / 4, 
						x: canvas.width / 2, 
						y: canvas.height / 2,
						c: [Math.random() * 380, 50, 40],
						t: 0,
						a: (Math.random() < 0.5) ? 0.9 : 1.1
					}];
				let options = [0.3, 0.5, 0.6, 1.0, 1.1];
				global.k = options[Math.floor(Math.random() * options.length)];
			}
			let new_points = [];
			for (let p of global.points) {
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r * Math.min(p.t, 1.0), 0, 2 * Math.PI);

				ctx.lineWidth = 2.5;
				ctx.fillStyle = "hsl(" + p.c[0] + "," + p.c[1] + "% ," + p.c[2] + "% )";
				ctx.fill();
				if (p.t >= 1.0)
				{
					let c = [p.c[0], p.c[1] * p.a, p.c[2] * p.a]
					new_points.push({
						r: p.r * global.k, 
						x: p.x + p.r, 
						y: p.y,
						a: p.a,
						t: 0,
						c: c
					});
					new_points.push({
						r: p.r * global.k, 
						x: p.x - p.r, 
						y: p.y,
						a: p.a,
						t: 0,
						c: c
					});
					new_points.push({
						r: p.r * global.k, 
						x: p.x, 
						y: p.y + p.r,
						a: p.a,
						t: 0,
						c: c
					});
					new_points.push({
						r: p.r * global.k, 
						x: p.x, 
						y: p.y - p.r,
						a: p.a,
						t: 0,
						c: c
					});
				}
				else
				{
					new_points.push({
						r: p.r,
						x: p.x,
						y: p.y,
						a: p.a,
						t: p.t + 1 / 500,
						c: p.c
					});
				}
			}
			if (new_points.length < 100)
			{
				global.points = new_points;
			}
			else
			{
				global.stop();
			}
		}
	};

	global.stop = () => {
		if (global.interval)
			window.clearInterval(global.interval);
	};

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	global.interval = setInterval(global.update, 1 / 60 * 1000);
	global.started = false;
});
