import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	AmbientLight,
	BoxGeometry,
	MeshBasicMaterial,
	MeshLambertMaterial,
	MeshPhongMaterial,
	Object3D,
	Vector3,
	ImageUtils,
	RepeatWrapping
} from 'three'

import {
	World,
	Vec3
} from 'oimo'

import AssetsManager from './AssetsManager'
import Entity from './Entity'
import Box from './Box'
import Controls from './Controls'
import Player from './Player'

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
		this.assets = new AssetsManager()
		this.models = {
			'card' : 'assets/models/card/card.js',
			'tonneau' : 'assets/models/tonneau/tonneau.js',
			'catapulte' : 'assets/models/catapulte/catapulte.js'
		}
	}

	load() {
		return new Promise((resolve, reject) => {
			console.log('Loading...')
			this.assets.loadAll(this.models).then(resolve)
		})
	}

	init() {
		console.log('Initialisation...')
		//



		//

		this.setUpWorldAndScene()

		this.player = new Player(this.camera, this.world)
		this.scene.add(this.player)

		this.controls = new Controls(this)
		var floorGeo = new BoxGeometry(10000, 1000, 10000)
		var t = ImageUtils.loadTexture('assets/textures/floor.jpg')
		t.wrapS = t.wrapT = RepeatWrapping
		t.repeat.set(32, 32)
		var floorMat = new MeshPhongMaterial({map: t})
		var floor = new Entity(floorGeo, floorMat)
		.addBody({
			world: this.world,
			type: 'box',
			move: false
		})
		.setPosition(0, -1000, 0)

		this.scene.add(floor)

		for(var i = 0 ; i < 100 ; i++) {
			var box = new Box(Math.random() * 100, Math.random() * 100, Math.random() * 100)
			.addBody({
				world: this.world,
				type: 'box',
				move: true
			})
			.setPosition(i * Math.random() + 100 , i * 1000, i * Math.random())
			this.scene.add(box);
		}
		console.log(this.assets.models)

		for(var i = 0 ; i < 100 ; i++) {
			var card = new Entity(this.assets.models.card.geometry, this.assets.models.card.materials[0])
			card.scale.set(100, 100, 100)
			card.addBody({
				world: this.world,
				type: 'box',
				move: true
			})
			.setPosition(i * Math.random() + 200 , i * 1000, i * Math.random())
			this.scene.add(card);
		}

		for(var i = 0 ; i < 100 ; i++) {
			var tonneau = new Entity(this.assets.models.tonneau.geometry, this.assets.models.tonneau.materials[0])
			tonneau.scale.set(100, 100, 100)
			tonneau.addBody({
				world: this.world,
				type: 'cylinder',
				move: true
			})
			tonneau.setPosition(i * Math.random() , i * 1000, i * Math.random())
			this.scene.add(tonneau);
		}
		/*
		for(var i = 0 ; i < 100 ; i++) {
			var catapulte = new Entity(this.assets.models.catapulte.geometry, this.assets.models.catapulte.materials[0])
			catapulte.scale.set(100, 100, 100)
			catapulte.addBody({
				world: this.world,
				type: 'box',
				move: true
			})
			catapulte.setPosition(i * Math.random() + 300 , i * 1000, i * Math.random())
			this.scene.add(catapulte);
		}*/


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

		this.renderer = new WebGLRenderer({canvas: this.canvas, antialias : true})

		var light = new AmbientLight(0x1a1a1a)
		this.scene.add(light)
	}
}