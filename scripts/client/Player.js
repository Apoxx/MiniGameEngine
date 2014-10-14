import Entity from './Entity'

import {
	BoxGeometry,
	MeshBasicMaterial
} from 'three'

export default class Player extends Entity {
	constructor(camera, world) {
		this.camera = camera
		var geo = null//new BoxGeometry(100, 100, 100)
		var mat = null//new MeshBasicMaterial()
		super(geo, mat, {
			type: 'sphere',
			world : world,
			move: true,
			size: [500, 500, 500] 
		})
		this.add(this.camera)
		this.camera.position.set(0, 500, 0)
		this.body.body.allowSleep = false
	}

	update() {
		if(this.body) {	
	        this.position.copy(this.body.getPosition())
	        //console.log(this.body.getPosition())
	        /*var {x, y, z, w} = this.body.getQuaternion()
	        this.quaternion.set(x, y, z, w)*/
		}
	}
}