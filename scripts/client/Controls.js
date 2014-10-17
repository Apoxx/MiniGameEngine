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
		this.front = 0
		this.side = 0
		this.jump = false

		if(this.keysDown[38]) this.front = 1
		if(this.keysDown[40]) this.front = -1
		if(this.keysDown[39]) this.side = 1
		if(this.keysDown[37]) this.side = -1
		if(this.keysDown[96]) {
			if(this.game.player.isOnFloor()) {
				console.log('coucou')
				this.jump = true
			}
		}
		var dir = Controls.getDirectionVector(this.game.player.camera, this.front * 3, this.side * 3)
		var y = this.game.player.body.body.linearVelocity.y
		this.game.player.body.body.linearVelocity.scaleEqual(0.90)
		this.game.player.body.body.linearVelocity.y = y
		if(this.jump) dir.y = 20
		this.game.player.body.body.linearVelocity.y -= 0.5
		this.game.player.body.body.linearVelocity.addEqual(dir)
	}

	static getDirectionVector(camera, frontSpeed, sideSpeed) {
		var direction = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize()		
		var strafe = direction.clone().cross(new Vector3(0, 1, 0)).multiplyScalar(sideSpeed)
		var face = direction.clone().multiply(new Vector3(1, 0, 1)).multiplyScalar(frontSpeed)
		return face.add(strafe)
	}
}