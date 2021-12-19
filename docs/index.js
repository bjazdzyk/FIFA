const degToRad =(deg)=>{
  return deg*Math.PI/180
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const grassG = new THREE.BoxGeometry(105, 68, 1);
const grassM = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const grass = new THREE.Mesh(grassG, grassM);
scene.add(grass);

camera.position.z = 100;
camera.position.y = -100;
camera.rotation.x = degToRad(45)

const loop =()=> {
  requestAnimationFrame(loop);



  renderer.render(scene, camera);
};

loop();