window.addEventListener("load", () => {
	let canvas = document.getElementById("canvas");
	let body = document.getElementsByTagName("body")[0];
	canvas.width  = body.clientWidth * 2;
	canvas.height = body.clientHeight * 2;

	console.log(canvas.width);
	console.log(canvas.height);

	let ctx = canvas.getContext("2d");
	ctx.fillStyle = "#FFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	let global = {
		update: 		
		() => {
			if (!global.started)
			{
				global.points = [];
				global.t = 0;
				global.maxEnergy = 0;
				for (let i = 0; i < 200; i++)
				{
					let speed = 0.1;
					let point = {
						x:  Math.random() * canvas.width,
						y:  Math.random() * canvas.height,
						vx: Math.random() * speed * 2 - speed,
						vy: Math.random() * speed * 2 - speed
					};
					global.points.push(point);
					global.maxEnergy += Math.abs(point.vx) + Math.abs(point.vy);
				}
				global.maxEnergy *= 500;
				global.started = true;
			}

			let delta = 1 / 600;
			for (let p of global.points) {
				p.x += p.vx;
				p.y += p.vy;

				let x = ((canvas.width / 2) - p.x) * delta;
				let y = ((canvas.height / 2) - p.y) * delta;
				for (let o of global.points) {
					let dx = p.x - o.x;
					let dy = p.y - o.y;
					let distance = (dx * dx + dy * dy)
					if (2 < distance && distance < 1000) {
						x += dx * 39.1;
						y += dy * 39.1;
					}
				}
				p.vx *= (1 - delta);
				p.vy *= (1 - delta);
				p.vx += x * delta;
				p.vy += y * delta;

				if (p.x > canvas.width || p.x < 0) {
					p.vx *= -1.0;
				}
				if (p.y > canvas.height || p.y < 0) {
					p.vy *= -1.0;
				}
			}

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			let totalEnergy = 0;
			for (let p of global.points) {
				let speed = p.vx * p.vx + p.vy * p.vy;
				totalEnergy += Math.abs(p.vx) + Math.abs(p.vy);
				ctx.beginPath();
				ctx.arc(p.x, p.y, Math.max(Math.min(speed * 2, 100), 3), 0, 2 * Math.PI);
				ctx.fillStyle = "#000";
				ctx.fill();
			}
		}
	};

	if (global.interval)
		window.clearInterval(global.interval);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	global.interval = setInterval(global.update, 1 / 60 * 1000);
	global.started = false;

});
