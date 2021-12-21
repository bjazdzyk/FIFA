const degToRad =(deg)=>{
  return deg*Math.PI/180
}

// let cameraHeight = 30
// let FOV = 60

let cameraHeight = 20
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
    this.defensive = true
    this.show()

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
      x += speed
    }
    if(keys["KeyA"]){
      x -= speed
    }
    if(keys["KeyW"]){
      y += speed
    }
    if(keys["KeyS"]){
      y -= speed
    }
    if(x > 0){
      if(y > 0){
        this.Player.rotation.z = degToRad(-45)
      }else if(y < 0){
        this.Player.rotation.z = degToRad(45)
      }else{
        this.Player.rotation.z = degToRad(90)
      }
    }else if(x < 0){
      if(y > 0){
        this.Player.rotation.z = degToRad(-135)
      }else if(y < 0){
        this.Player.rotation.z = degToRad(135)
      }else{
        this.Player.rotation.z = degToRad(-90)
      }
    }else if(y > 0){
      this.Player.rotation.z = degToRad(180)
    }else if(y < 0){
      this.Player.rotation.z = degToRad(0)
    }
    this.Player.position.x += x
    this.Player.position.y += y
  }
  controlls(ball){
    if(this.defensive){
      let dX = Math.abs(ball.Ball.position.x-this.Player.position.x)
      let dY = Math.abs(ball.Ball.position.y-this.Player.position.y)
      let dZ = Math.abs(ball.Ball.position.z-0.15)
      console.log(Math.abs(ball.Ball.position.x), Math.abs(this.Player.position.x), dX)
      if(Math.sqrt(dX*dX + dY*dY) < 1){
        ball.setPos(this.Player.position.x, this.Player.position.y, ball.radius)
        console.log("lol")
      }
    }
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
    this.Ball = new THREE.Group()
    this.Ball.add(this.ballMesh)
    this.Ball.position.set(this.x, this.y, this.z)
    this.ballMesh.position.set(0, 0, 0)
    this.show()
  }
  show(){
    scene.add(this.Ball)
  }
  hide(){
    scene.remove(this.Ball)
  }
  setPos(x, y, z){
    this.Ball.position.set(x, y, z)
  }
}

let messi = new Player("red", -5, 0, 1.6)
let brazuca = new Ball(0, 0, 0.15, "yellow", 0.3)

const loop =()=> {
  requestAnimationFrame(loop);
  messi.run(0.1)
  messi.controlls(brazuca)
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
  keys[e.code] = null
}

loop();