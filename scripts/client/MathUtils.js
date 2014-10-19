import {
	Mesh,
	BoxGeometry,
	SphereGeometry,
	MeshBasicMaterial,
	Object3D,
	Matrix3,
	Vector3
} from 'three'


import {
	Mat33,
	Body,
	Quaternion,
	BoxShape,
	SphereShape
} from 'oimo'

export function quaternionToMat33(quaternion) {
	var {x, y, z, w} = quaternion

	var x2 = x * x
	var y2 = y * y
	var z2 = z * z
	var w2 = w * w

	var e00 = 2 * x2 + 2 * w2 - 1
	var e01 = 2 * x * y - 2 * z * w
	var e02 = 2 * x * z + 2 * y * w
	var e10 = 2 * x * y + 2 * z * w
	var e11 = 2 * y2 + 2 * w2 - 1
	var e12 = 2 * y * z - 2 * x * w
	var e20 = 2 * x * z - 2 * y * w
	var e21 = 2 * y * z + 2 * x * w
	var e22 = 2 * z2 + 2 * w2 - 1

	return new Mat33(e00, e01, e02, e10, e11, e12, e20, e21, e22)
}

export function bodyDebugObject(body, scale) {
	var debugBody = new Object3D()
	var material = new MeshBasicMaterial({wireframe: true, color: 0xff0000})
	var shapes = body.body.shapes

	//shapes.push(shape)

	/*while(shape.next) {
		shape = shape.next
		shapes.push(shape)
	}*/
	shapes.forEach((shape) => {
		if(shape instanceof BoxShape){
		 var geometry = new BoxGeometry(shape.width, shape.height, shape.depth)
		}
		else if(shape instanceof SphereShape) var geometry = new SphereGeometry(shape.radius)
		var mesh = new Mesh(geometry, material)
		mesh.scale.multiply(new Vector3(100 / scale.x, 100 / scale.y, 100 / scale.z))
		var q = new Quaternion().setFromRotationMatrix(shape.relativeRotation)
		mesh.quaternion.copy(q)
		mesh.position.copy(shape.relativePosition)
		mesh.position.multiply(new Vector3(100 / scale.x, 100 / scale.y, 100 / scale.z))
		debugBody.add(mesh)
	})

	return debugBody
}