const degToRad =(deg)=>{
  return deg*Math.PI/180
}

// let cameraHeight = 30
// let FOV = 60

let cameraHeight = 10
let FOV = 40

const scene = new THREE.Scene();
scene.background=new THREE.Color("skyblue")
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const loader = new THREE.TextureLoader()
 
const material = new THREE.MeshBasicMaterial({
  map: loader.load('img/grass.jpg'),
});
const geometry = new THREE.PlaneGeometry( 105, 68 )
//const material = new THREE.MeshLambertMaterial( {map: , side: THREE.DoubleSide} )
const plane = new THREE.Mesh( geometry, material )
scene.add( plane );

camera.position.z = cameraHeight
camera.position.y = -cameraHeight*Math.sqrt(3)

camera.rotation.x = degToRad(60)

class Player{
  constructor(color, x, y, height){
    this.color = color
    this.height = height
    this.playerGeo = new THREE.BoxGeometry(0.5, 0.5, this.height)
    this.playerMat = new THREE.MeshBasicMaterial({color: this.color})
    this.playerMesh = new THREE.Mesh(this.playerGeo, this.playerMat)
    this.playerEdg = new THREE.EdgesGeometry(this.playerGeo)
    this.playerLin = new THREE.LineSegments( this.playerEdg, new THREE.LineBasicMaterial( { color: "black" } ) );
  }

  show(){
    scene.add(this.playerMesh)
    scene.add(this.playerLin)
  }
  hide(){
    scene.remove(this.playerMesh)
  }
}

let messi = new Player("red", 0, 0, 3)
messi.show()

const loop =()=> {
  requestAnimationFrame(loop);



  renderer.render(scene, camera);
};

loop();