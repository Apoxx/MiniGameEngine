import {
	Vector3,
	Raycaster
} from 'three'

import {
	Vec3
} from 'oimo'

export default class Controls {
	constructor(game) {
		this.acceleration = 0.5
		this.speed = 0
		this.speedStrafe = 0
		this.speedY = 0
		this.resistance = 0.9
		this.gravity = 9.80
		this.isOnFloor = false
		this.raycaster = new Raycaster();
		this.game = game
		this.keysDown = {}
		this.setupMouse()
		this.setupKeyboard()
	}

	setupMouse(){
		this.game.player.camera.rotation.order = "YXZ"
		this.game.canvas.addEventListener('click', (event) => this.game.canvas.requestPointerLock())
		this.game.canvas.addEventListener('mousemove', (event) => {
			this.game.player.camera.rotation.x -= event.movementY * 0.002
			this.game.player.camera.rotation.y -= event.movementX * 0.002
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
		this.raycaster.set(this.game.player.position, new Vector3(0, -1, 0).normalize())
		var floor = this.raycaster.intersectObjects( this.game.scene.children, true )[0]
		this.isOnFloor = false
		if(floor) {
			if (floor.distance < 1000) this.isOnFloor = true
		}
		if(this.keysDown[38]) this.speed += this.acceleration
		if(this.keysDown[40]) this.speed -= this.acceleration
		if(this.keysDown[39]) this.speedStrafe += this.acceleration
		if(this.keysDown[37]) this.speedStrafe -= this.acceleration
		if(this.keysDown[96]) {
			if(this.isOnFloor) {
				this.isOnFloor = false
				this.speedY = 20
			}
		}

		this.speed *= this.resistance
		this.speedStrafe *= this.resistance
		

		var direction = new Vector3(0, 0, -1).applyQuaternion(this.game.player.camera.quaternion).normalize()
		
		var strafe = direction.clone().cross(new Vector3(0, 1, 0)).multiplyScalar(10 * this.speedStrafe)
		var face = direction.clone().multiply(new Vector3(1, 0, 1)).multiplyScalar(10 * this.speed)
		var goVector = face.add(strafe).add(new Vector3(0, this.speedY, 0))

		this.game.player.body.setPosition(this.game.player.body.getPosition().addEqual(goVector))
	}
}