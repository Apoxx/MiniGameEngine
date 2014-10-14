import {
	Mesh,
	Box3,
	Object3D,
	Quaternion
} from 'three'

import {
	Body
} from 'oimo'

export default class Entity extends Object3D {
	constructor(geometry, material, physic) {
		super()
		if(geometry && material) this.add(new Mesh(geometry, material))
		if(physic) {
			this.addBody(physic)
		}
	}

	addBody(physic) {
		if(physic.size){
			var {w, h, d} = {w: physic.size[0], h: physic.size[1], d: physic.size[2]}
		} else {
			var box = new Box3().setFromObject(this)
			var {x: w, y: h, z: d} = box.max.sub(box.min)
		}
		
		if(physic.type === 'sphere') {
			var max = [w, h, d].reduce((max = 0, num) => {
				if(num > max) return num
				return max
			})
			w = h = d = max * 0.5
			physic.size = [w, h, d]
		}
		if(physic.type === 'box') {
			physic.size = [w, h, d]
		}
		if(physic.type === 'cylinder') {
			console.log('cylinder')
			physic.size = [w, h, w, w, h, w, w, h, w, w, h, w]
		}
		physic.pos = [this.position.x, this.position.y, this.position.z]
		this.body = new Body(physic)
		return this
	}

	setPosition(x, y, z) {
		if(this.body) {
			this.body.resetPosition(x, y, z)
		}
		this.position.set(x, y, z)
		return this
	}

	update() {
		if(this.body && !this.body.getSleep()) {		
	        this.position.copy(this.body.getPosition())
	        var {x, y, z, w} = this.body.getQuaternion()
	        this.quaternion.set(x, y, z, w)
		}
	}
}