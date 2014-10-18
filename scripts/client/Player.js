import Entity from './Entity'

import {
	BoxGeometry,
	SphereGeometry,
	MeshBasicMaterial,
	Raycaster,
	Vector3,
	Box3,
	Object3D,
	Mesh
} from 'three'

export default class Player extends Entity {
	constructor(game) {
		this.game = game
		this.camera = game.camera
		var representation = new Object3D()
		var geometry = new SphereGeometry(100)
		representation.add(new Mesh(geometry))
		super(representation)
		this.name = 'player'
		this.addBody(game.world, 'sphere', true)
		this.visible = false
		this.add(this.camera)
		this.camera.position.set(0, 100, 0)
		//this.body.allowSleep = false
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
			console.log(floor.distance)
			if(floor.distance < 200) return true
		}
		return false
	}
}