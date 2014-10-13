import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	AmbientLight,
	BoxGeometry,
	MeshBasicMaterial,
	Object3D,
	Vector3
} from 'three'

import {
	World,
	Vec3
} from 'oimo'

import Entity from './Entity'
import Box from './Box'
import Controls from './Controls'


export default class Game {

	constructor(width = window.innerWidth, height = window.innerHeight) {
		this.canvas = document.createElement('CANVAS')
		this.canvas.width = width
		this.canvas.height = height

		this.width = width
		this.height = height
	}

	preload() {
		console.log('Preloading...')
		//
	}

	load() {
		return new Promise((success, error) => {
			console.log('Loading...')
			//
			success()
		})
	}

	init() {
		console.log('Initialisation...')
		//
		this.setUpWorldAndScene()

		this.controls = new Controls(this)

		var floor = new Box(10000, 1000, 10000)
		.addBody({
			world: this.world,
			type: 'box',
			move: false
		})
		.setPosition(0, -1000, 0)

		this.scene.add(floor)

		for(var i = 0 ; i < 100 ; i++) {
			var box = new Box()
			.addBody({
				world: this.world,
				type: 'box',
				move: true
			})
			.setPosition(i * Math.random() , i * 1000, i * Math.random())
			this.scene.add(box);
		}


	}

	run() {
		console.log('Run !')
		//
		var prevTime = 0
		var loop = (time) => {
			window.requestAnimationFrame(loop)
			this.update(time, time - prevTime)
			this.render(time, time - prevTime)
			prevTime = time
		}
		window.requestAnimationFrame(loop)
	}

	update(time, delta) {
		this.world.step()
		this.scene.children.filter(child => child instanceof Entity).map(entity => entity.update())
		this.controls.update()
	}

	render(time, delta) {
		this.renderer.render(this.scene, this.camera)
	}	

	start() {
		this.preload()
		this.load().then(() => {
			this.init()
			this.run()
		})
	}

	setUpWorldAndScene() {
		this.world = new World(1/60, 2, 8, false)
		this.world.gravity = new Vec3(0, -9.8, 0)
		this.world.worldscale(100)

		this.scene = new Scene()

		this.camera = new PerspectiveCamera(35, this.width / this.height, 100, 100000 )

		this.camera.position.z = 2000

		this.renderer = new WebGLRenderer({canvas: this.canvas, antialias : true})

		var light = new AmbientLight(0xcccccc)
		this.scene.add(light)
	}
}