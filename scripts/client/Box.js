import Entity from './Entity'

import {
	BoxGeometry,
	MeshBasicMaterial,
	PointLight,
	Object3D,
	Mesh
} from 'three'

export default class Box extends Entity {
	constructor(w = 100, h = 100, d = 100, color = ~~(Math.random() * 0xffffff)) {
		var geometry = new BoxGeometry(w, h, d)
		var material = new MeshBasicMaterial({color})
		var mesh = new Mesh(geometry, material)
		super(mesh)
		this.add(new PointLight(color, 1.0, 1000))
	}
}