import Entity from './Entity'

import {
	BoxGeometry,
	MeshBasicMaterial,
	Raycaster,
	Vector3,
	Box3
} from 'three'

export default class Player extends Entity {
	constructor(game) {
		this.game = game
		this.camera = game.camera
		super({geometry: null, material: null , physic: {
			type: 'sphere',
			world: game.world,
			move: true,
			size: [500, 500, 500],
			config: [
			  0.1
			]
		}})
		this.add(this.camera)
		this.camera.position.set(0, 500, 0)
		this.body.body.allowSleep = false
		this.raycaster = new Raycaster()

	}

	update() {
		if(this.body) {	
	        this.position.copy(this.body.getPosition())
		}
	}

	isOnFloor() {
		this.raycaster.set(this.position, new Vector3(0, -1, 0))
		var floor = this.raycaster.intersectObjects( this.game.scene.children, true )[0]
		if(floor) {
			if(floor.distance < 275) return true
		}
		return false
	}
}