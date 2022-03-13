// 201835518 전소영
window.onload = function init()
{
	const canvas = document.getElementById( "gl-canvas" );
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const renderer = new THREE.WebGLRenderer({canvas});
	renderer.setSize(canvas.width,canvas.height);

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	camera = new THREE.PerspectiveCamera(75,canvas.width / canvas.height,0.1, 300);
	camera.rotation.y = 90/180*Math.PI;
	camera.position.x = 2;
	camera.position.y = 7;
	camera.position.z = 10;

	const controls = new THREE.OrbitControls(camera, renderer.domElement);

	hlight = new THREE.AmbientLight (0x404040,5);
	scene.add(hlight);

	light = new THREE.PointLight(0xc4c4c4,7);
	light.position.set(0,3000,5000);
	scene.add(light);

	light2 = new THREE.PointLight(0xc4c4c4,5);
	light2.position.set(5000,1000,0);
	scene.add(light2);

	light3 = new THREE.PointLight(0xc4c4c4,7);
	light3.position.set(0,1000,-5000);
	scene.add(light3);

	light4 = new THREE.PointLight(0xc4c4c4,3);
	light4.position.set(-5000,3000,5000);
	scene.add(light4);


	const loader = new THREE.GLTFLoader();
	// loader.load('./model/scene.gltf', function(gltf){
	loader.load('./toon_cat_free/scene.gltf', function(gltf){
	//   rocket = gltf.scene.children[0];
	  rocket = gltf.scene;
	  rocket.scale.set(0.005,0.005,0.005);
	  scene.add(gltf.scene);
	  animate();
	}, undefined, function (error) {
		console.error(error);
	});

	function animate() {
		if(rocket) rocket.rotation.x += 0.03;
		renderer.render(scene,camera);
		requestAnimationFrame(animate);
	 }
 
}


