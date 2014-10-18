import {
	Vector3,
	Raycaster
} from 'three'

import {
	Vec3
} from 'oimo'

export default class Controls {
	constructor(game) {
		this.game = game
		this.keysDown = {}
		this.frontSpeed = 0
		this.sideSpeed = 0
		this.acceleration = 1
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
		this.front = 0
		this.side = 0
		this.jump = false

		if(this.keysDown[38]) this.front = 1
		if(this.keysDown[40]) this.front = -1
		if(this.keysDown[39]) this.side = 1
		if(this.keysDown[37]) this.side = -1
		if(this.keysDown[96]) {
			if(this.game.player.isOnFloor()) {
				this.jump = true
			}
		}
		var dir = Controls.getDirectionVector(this.game.player.camera, this.front, this.side)
		this.game.player.body.body.linearVelocity.add(this.game.player.body.body.linearVelocity, dir)
		if(this.jump) this.game.player.body.body.linearVelocity.y = 10
		this.game.player.body.body.linearVelocity.x *= 0.90
		this.game.player.body.body.linearVelocity.y 
		this.game.player.body.body.linearVelocity.z *= 0.90

	}

	static getDirectionVector(camera, frontSpeed, sideSpeed) {
		var direction = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize()		
		var strafe = direction.clone().cross(new Vector3(0, 1, 0)).multiplyScalar(sideSpeed)
		var face = direction.clone().multiply(new Vector3(1, 0, 1)).multiplyScalar(frontSpeed)
		return face.add(strafe)
	}
}