const degToRad =(deg)=>{
  return deg*Math.PI/180
}

let cameraHeight = 30
let FOV = 60

// let cameraHeight = 40
// let FOV = 20

const scene = new THREE.Scene();
scene.background=new THREE.Color("skyblue")
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const loader = new THREE.TextureLoader();
 
const material = new THREE.MeshBasicMaterial({
  map: loader.load('img/grass.jpg'),
});
const geometry = new THREE.PlaneGeometry( 105, 68 );
//const material = new THREE.MeshLambertMaterial( {map: , side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );
scene.add( plane );

camera.position.z = cameraHeight;
camera.position.y = -cameraHeight*Math.sqrt(3);
camera.rotation.x = degToRad(60)

const loop =()=> {
  requestAnimationFrame(loop);



  renderer.render(scene, camera);
};

loop();