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
    this.x = x
    this.y = y
    this.color = color
    this.height = height
    this.playerGeo = new THREE.BoxGeometry(0.5, 0.25, this.height)
    this.playerMat = new THREE.MeshBasicMaterial({color: this.color})
    this.playerMesh = new THREE.Mesh(this.playerGeo, this.playerMat)
    this.playerEdg = new THREE.EdgesGeometry(this.playerGeo)
    this.playerLin = new THREE.LineSegments( this.playerEdg, new THREE.LineBasicMaterial( { color: "black" } ) );
    this.Player = new THREE.Group()
    this.Player.add(this.playerMesh)
    this.Player.add(this.playerLin)
    this.Player.position.x = this.x
    this.Player.position.y = this.y
    this.Player.position.z = this.height/2

  }

  show(){
    scene.add(this.Player)
  }
  hide(){
    scene.remove(this.Player)
  }
  run(speed){
    let x = 0
    let y = 0

    if(keys["KeyD"]){
      x = speed
    }
    if(keys["KeyA"]){
      x = -speed
    }
    if(keys["KeyW"]){
      y = speed
    }
    if(keys["KeyS"]){
      y = -speed
    }

    this.Player.position.x += x
    this.Player.position.y += y
  }
}

class Ball{
  constructor(x, y, z, color, radius){
    this.x = x
    this.y = y
    this.z = z
    this.color = color
    this.radius = radius
    this.ballGeo = new THREE.SphereGeometry(0.2, 32, 15)
    this.ballMat = new THREE.MeshBasicMaterial({color : this.color})
    this.ballMesh = new THREE.Mesh(this.ballGeo, this.ballMat)
    this.ballMesh.position.set(this.x, this.y, this.z)
  }
  show(){
    scene.add(this.ballMesh)
  }
  hide(){
    scene.remove(this.ballMesh)
  }
}

let messi = new Player("red", 0, 0, 1.8, 0.2)
messi.show()

let brazuca = new Ball(1, 1, 0.15, "yellow", 0.3)
brazuca.show()

const loop =()=> {
  requestAnimationFrame(loop);
    messi.run(0.2)
  renderer.render(scene, camera);
};

//events
let keys = {}
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
function keyDown(e) {
  keys[e.code] = true
}
function keyUp(e) {
  keys[e.code] = false
}

loop();