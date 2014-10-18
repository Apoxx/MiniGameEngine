import {
	Mesh,
	Box3,
	Object3D,
	Quaternion,
	BoxGeometry,
	SphereGeometry,
	Matrix4,
	Vector3,
	Light,
	Euler
} from 'three'

import {
	Body
} from 'oimo'

import {
	bodyDebugObject,
	quaternionToMat33
} from './MathUtils'

export default class Entity extends Object3D {
	constructor(object, physic) {
		super()
		if(object instanceof Mesh) {
			this.add(object.clone())
		} else {
			object.clone(this, true)
		}		
		
		if(physic) {
			this.addBody(physic)
		}
	}

	addBody(world, type = 'box', move) {
		console.log(this)
		var obj = this.clone()
		obj.traverse((child) => {
			if(child instanceof Light) obj.remove(child)
		})

		var types = []
		var positions = []
		var rotations = []
		var sizes = []
		obj.children.forEach(child => {
			var box = new Box3().setFromObject(child)
			var {x: w, y: h, z: d} = box.max.sub(box.min)
			var posX = box.min.x + w / 2
			var posY = box.min.y + h / 2
			var posZ = box.min.z + d / 2

			w *= obj.scale.x
			h *= obj.scale.y
			d *= obj.scale.z

			if(child.geometry instanceof SphereGeometry) {
				console.log('shpere')
				types.push('sphere')
				w /= 2
				h /= 2
				d /= 2
			} else {
				types.push('box')
			}
			sizes.push(w, h, d)
			positions.push(posX , posY, posZ)
			var {x, y, z} = new Euler().setFromQuaternion(child.quaternion)
			rotations.push(x, y, z)
		})

		this.body = new Body({
			world,
			move,
			type: types,
			size: sizes,
			rot: rotations.map(x => x * 180 / Math.PI),
			pos: positions
		})
		this.add(bodyDebugObject(this.body, this.scale))
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
		if(this.body) {
	        this.position.copy(this.body.getPosition())
	        this.quaternion.copy(this.body.getQuaternion())
		}
	}
}