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
    this.ballControll = null
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
    if(this.ballcontroll == null){
      let dX = Math.abs(ball.Ball.position.x-this.Player.position.x)
      let dY = Math.abs(ball.Ball.position.y-this.Player.position.y)
      let dZ = Math.abs(ball.Ball.position.z-this.Player.position.z)
      if(Math.sqrt(Math.sqrt(dX*dX + dY*dY) + dZ*dZ/3) < ball.radius*2){
        ball.setVel(0, 0, 0)
        ball.setPos(this.Player.position.x, this.Player.position.y, ball.radius)
        this.ballControll = ball
      }
    }else if(this.ballControll == ball){
      ball.setPos(this.Player.position.x, this.Player.position.y, ball.radius)
    }
  }
}

class Ball{
  constructor(x, y, z, color, radius){
    this.x = x
    this.y = y
    this.z = z
    this.velX = 0
    this.velY = 0
    this.velZ = 0
    this.color = color
    this.radius = radius
    this.ballGeo = new THREE.SphereGeometry(0.2, 32, 15)
    this.ballMat = new THREE.MeshBasicMaterial({color : this.color})
    this.ballMesh = new THREE.Mesh(this.ballGeo, this.ballMat)
    this.Ball = new THREE.Group()
    this.Ball.add(this.ballMesh)
    this.Ball.add(camera)
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
    this.x = x
    this.y = y
    this.z = z
  }
  addVel(x, y, z){
    this.velX += x
    this.velY += y
    this.velZ += z
  }
  setVel(x, y, z){
    this.velX = 0
    this.velY = 0
    this.velZ = 0
  }
  gravity(){
    if(this.z > this.radius){
      this.addVel(0, 0, -0.01)
    }else if(this.z < this.radius){
      console.log(this.velZ)
      this.z = this.radius
      if(Math.abs(this.velZ) < 0.05){
        this.z = this.radius
        this.velZ = 0
      }else{
        this.velZ *= -0.6
      }
    }
  }
  update(){
    this.gravity()
    this.x += this.velX
    this.y += this.velY
    this.z += this.velZ
    this.Ball.position.set(this.x, this.y, this.z)
  }
}

let messi = new Player("red", -5, 0, 1.6)
let brazuca = new Ball(0, 0, 5, "yellow", 0.3)

//brazuca.addVel(0.05, 0, 0)

const loop =()=> {
  requestAnimationFrame(loop);
  messi.run(0.1)
  messi.controlls(brazuca)
  brazuca.update()
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