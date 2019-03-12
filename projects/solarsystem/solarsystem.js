var scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(
		75, window.innerWidth / window.innerHeight,
		0.1, 2000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); 

function createSun() {
	var geometry = new THREE.SphereGeometry(50, 25, 25);
	var material = new THREE.MeshBasicMaterial( {color: 0xffdc17} );
	var sun = new THREE.Mesh(geometry, material);
	scene.add(sun);
	return sun;
}

function createPlanet(size, c) {
	var geometry = new THREE.SphereGeometry(size, 20, 20);
	var material = new THREE.MeshPhongMaterial( {color: c, specular: 0x555555, shininess: 30 } );
	var planet = new THREE.Mesh(geometry, material);
	scene.add(planet);
	return planet;
}

function animate(it, radius, freq, planet) {
	//it += 10 * (Math.sin(it/5) + 1);
	//freq = freq / 6;
	planet.position.set(radius * Math.sin(it/freq), 0, radius * Math.cos(it/(freq)));
}

function animateCamera(it) {
	RADIUS = 500;
	FREQUENCY = 300;
	camera.position.set(0, RADIUS * Math.sin(it/FREQUENCY), RADIUS * Math.cos(it/FREQUENCY));
	camera.lookAt(scene.position);
	camera.rotation.z = 0;
}

var sun = createSun();
var earth = createPlanet(10, 0x115ad9);
var venus = createPlanet(10, 0xbf9517);
var mars = createPlanet(8, 0xd14c13);
var moon = createPlanet(3, 0x787878);
var phobos = createPlanet(2, 0x787878);
var deimos = createPlanet(1, 0x787878);
var jupiter = createPlanet(30, 0xe69729);

var light = new THREE.PointLight( 0x404040, 100, 1500, 8);
light.position.set(0,0,0);
scene.add(light);

var light2 = new THREE.AmbientLight( 0x333333 );
scene.add(light2);

//var light3 = new THREE.PointLight( 0x404040, 100, 1500, 8);
//light3.position.set(0,200,100);
//scene.add(light3);

camera.position.set(0,100,500);
camera.rotation.set(-0.1,0,0);


var speed = 1;

var it = 0;
function render() {
	requestAnimationFrame(render);
	animate(it, 300, 120, mars);
	animate(it, 250, 100, earth);
	animate(it, 180, 80, venus);
	animate(it, 500, 130, jupiter);
	//animateCamera(it, camera);
	moon.position.set(250 * Math.sin(it/100) + 15 * Math.sin(it/20), 0,
			250 * Math.cos(it/100) + 15 * Math.cos(it/20));
	phobos.position.set(300 * Math.sin(it/120) + 13 * Math.sin(it/20), 8 * Math.sin(it/20),
			300 * Math.cos(it/120) + 13 * Math.cos(it/20));
	deimos.position.set(300 * Math.sin(it/120) + 12 * Math.sin(it/15), 0,
			300 * Math.cos(it/120) + 12 * Math.cos(it/15));
	renderer.render(scene, camera);
	var s = 1 + 0.1 * Math.sin(it/100);
	sun.scale.set(s,s,s);
	it += speed;

    speed += 0.0007;
}

render();
