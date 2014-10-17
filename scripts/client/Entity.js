import {
	Mesh,
	Box3,
	Object3D,
	Quaternion,
	BoxGeometry,
	SphereGeometry,
	Matrix4
} from 'three'

import {
	Body,
	BoxShape,
	SphereShape,
	ShapeConfig,
	Vec3
} from 'oimo'

import {
	quaternionToMat33,
	bodyDebugObject
} from './MathUtils'

export default class Entity extends Object3D {
	constructor({geometry, material, physic, source}) {
		super()
		if(source) source.clone(this, true)
		else if(geometry && material) this.add(new Mesh(geometry, material))
		if(physic) {
			this.addBody(physic)
		}
	}

	addBody(physic) {
		physic.pos = [this.position.x, this.position.y, this.position.z]

		if(physic.type === 'map') {
			physic.type = null
			this.body = new Body(physic)
			var firstShape = this.body.body.shapes
			var map = physic.map

			map.children.forEach(child => {
				var config = new ShapeConfig()
				var {x, y, z} = child.position
				config.relativePosition = new Vec3(x, y, z)
				config.relativeRotation = quaternionToMat33(child.quaternion)			
				config.belongsTo = 2
				config.collidesWith = 1

				if(child.geometry instanceof BoxGeometry) {
					var {width, height, depth} = child.geometry.parameters
					var shape = new BoxShape(config, width, height, depth)
				}
				if(child.geometry instanceof SphereGeometry) {
					var radius = child.geometry.parameters.radius
				}
				this.body.body.addShape(shape)
			})

			
			this.body.body.removeShape(firstShape)
			//this.body.body.setupMass(physic.move)

		} else {
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
			//cylinder is a Oimo lie
			if(physic.type === 'cylinder') {
				console.log('cylinder')
				physic.size = [w, h, w, w, h, w, w, h, w, w, h, w]
			}

			this.body = new Body(physic)
		}
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
		if(this.body && !this.body.getSleep()) {		
	        this.position.copy(this.body.getPosition())
	        var {x, y, z, w} = this.body.getQuaternion()
	        this.quaternion.set(x, y, z, w)
		}
	}
}