import {
	Vector3
} from 'three'

export default class Controls {
	constructor(game) {
		this.acceleration = 2
		this.speed = 0
		this.speedStrafe = 0
		this.resistance = 0.9
		this.game = game
		this.keysDown = {}
		this.setupMouse()
		this.setupKeyboard()
	}

	setupMouse(){
		this.game.camera.rotation.order = "YXZ"
		this.game.canvas.addEventListener('click', (event) => this.game.canvas.requestPointerLock())
		this.game.canvas.addEventListener('mousemove', (event) => {
			this.game.camera.rotation.x -= event.movementY * 0.002
			this.game.camera.rotation.y -= event.movementX * 0.002
		})
	}

	setupKeyboard(){
		document.addEventListener('keydown', (event) => {
			this.keysDown[event.keyCode] = true
		})
		document.addEventListener('keyup', (event) => {
			this.keysDown[event.keyCode] = false
		})
	}

	update() {
		if(this.keysDown[38]) this.speed += this.acceleration
		if(this.keysDown[40]) this.speed -= this.acceleration
		if(this.keysDown[39]) this.speedStrafe += this.acceleration
		if(this.keysDown[37]) this.speedStrafe -= this.acceleration
		this.speed *= this.resistance
		this.speedStrafe *= this.resistance

		var direction = new Vector3(0, 0, -1).applyQuaternion(this.game.camera.quaternion).normalize()
		var face = direction.clone().multiplyScalar(10 * this.speed)
		var strafe = direction.clone().cross(new Vector3(0, 1, 0)).multiplyScalar(10 * this.speedStrafe)

		this.game.camera.position.add(face.add(strafe))
	}
}