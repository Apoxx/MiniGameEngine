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
	Body,
	BODY_STATIC,
	BODY_DYNAMIC,
	WORLD_SCALE
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
		var obj = this.clone()
		obj.traverse((child) => {
			if(child instanceof Light) obj.remove(child)
		})

		var types = []
		var positions = []
		var rotations = []
		var sizes = []

		obj.children.forEach((child, id) => {

			var box = new Box3().setFromObject(child)
			var {x: w, y: h, z: d} = box.max.sub(box.min)			


			var {x, y, z} = new Euler().setFromQuaternion(child.quaternion)
			rotations.push(x, y, z)

			if(child.geometry instanceof SphereGeometry) {
				types.push('sphere')
				child.geometry.computeBoundingSphere()
				w = child.geometry.boundingSphere.radius
				h = child.geometry.boundingSphere.radius
				d = child.geometry.boundingSphere.radius
			} else {
				types.push('box')
				if(child.geometry instanceof BoxGeometry) {
					child.geometry.computeBoundingBox()
					var bb = child.geometry.boundingBox.max.sub(child.geometry.boundingBox.min)

					w = bb.x
					h = bb.y
					d = bb.z

				}
			}
			positions.push(child.position.x * this.scale.x, child.position.y * this.scale.y, child.position.z * this.scale.z)
			sizes.push(w * this.scale.x, h * this.scale.y, d * this.scale.z)
		})

		this.body = new Body({
			world,
			move,
			type: types,
			size: sizes,
			pos: positions//,
			//rot: rotations.map(x => x * 180 / Math.PI)
		})
		this.body.body.shapes.forEach((shape, id) => {
			shape.relativeRotation = quaternionToMat33(this.children[id].quaternion)
		})

		//var mode = move ? BODY_DYNAMIC : BODY_STATIC

		//this.body.body.setupMass(mode)

		this.body.body.shapes.forEach((shape, id) => {
			var {x, y, z} = shape.relativePosition
			this.children[id].position.set(x * WORLD_SCALE / this.scale.x, y * WORLD_SCALE / this.scale.y, z * WORLD_SCALE / this.scale.z)
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