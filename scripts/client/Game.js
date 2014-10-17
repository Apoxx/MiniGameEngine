//well ...
window.THREE = require('three')

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

import {bodyDebugObject} from './MathUtils' 
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
		this.ressources = {
			three : {				
				'card' : 'assets/models/card/card.js',
				'tonneau' : 'assets/models/tonneau/tonneau.js',
				'catapulte' : 'assets/models/catapulte/catapulte.js'
			},
			obj : {
				'house' : 'assets/models/house/house.obj',
				'bridge' : 'assets/models/bridge/bridge.obj'
			},
			object3D : {
				'houseCollisions' : 'assets/models/house/house.collisions.json',
				'bridgeCollisions' : 'assets/models/bridge/bridge.collisions.json'
			}
		}

	}

	load() {
		return new Promise((resolve, reject) => {
			console.log('Loading...')
			this.assets.loadAll(this.ressources).then(resolve)
		})
	}

	init() {
		console.log('Initialisation...')
		//

		this.setUpWorldAndScene()

		this.player = new Player(this)
		this.scene.add(this.player)

		this.player.setPosition(0, 1000, 0)

		this.controls = new Controls(this)

		var floorGeo = new BoxGeometry(10000, 1000, 10000)
		var t = ImageUtils.loadTexture('assets/textures/stone.png')
		t.wrapS = t.wrapT = RepeatWrapping
		t.repeat.set(32, 32)
		var n = ImageUtils.loadTexture('assets/textures/stone.nmap.png')
		n.wrapS = n.wrapT = RepeatWrapping
		n.repeat.set(32, 32)
		var floorMat = new MeshPhongMaterial({map: t, normalMap: n})
		var floor = new Entity({geometry: floorGeo, material: floorMat})
		.addBody({
			world: this.world,
			type: 'box',
			move: false
		})
		.setPosition(0, -1000, 0)

		this.scene.add(floor)

		//this.assets.objects.house.scale.set(10, 10, 10)

		this.assets.objects.house.children[0].material.map = ImageUtils.loadTexture('assets/models/house/house.jpg')

		/*var bridge = new Entity({source: this.assets.objects.bridge, physic: {
			world: this.world,
			type: 'map',
			move: false,
			map: this.assets.objects.bridgeCollisions
		}})
		bridge.children[0].material.map = ImageUtils.loadTexture('assets/models/bridge/bridge.jpg')
		bridge.scale.set(100, 100, 100)
		this.scene.add(bridge)*/

		//bodyDebugObject(bridge.body)

		//this.assets.objects.houseCollisions.scale.set(100, 100, 100)
		var entity = new Entity({source: this.assets.objects.house})
		this.assets.objects.houseCollisions.scale.set(10, 10, 10)
		entity.scale.set(100, 100, 100)
		entity.addBody({
			type: 'map',
			world: this.world,
			move: false,
			map: this.assets.objects.houseCollisions
		})
		this.scene.add(entity)

		entity.setPosition(0, -500, 0)

		//console.log(this.assets.objects.houseCollisions)

		for(var i = 0 ; i < 10 ; i++) {
			var box = new Box(Math.random(), Math.random(), Math.random())
			box.scale.set(100, 100, 100)
			box.addBody({
				world: this.world,
				type: 'box',
				move: true
			})
			.setPosition(i * Math.random() + 100 , 1000 + i * 1000, i * Math.random())
			this.scene.add(box);
		}
		

		for(var i = 0 ; i < 10 ; i++) {
			var card = new Entity({geometry: this.assets.three.card.geometry, material: this.assets.three.card.materials[0]})
			card.scale.set(100, 100, 100)
			card.addBody({
				world: this.world,
				type: 'box',
				move: true
			})
			.setPosition(i * Math.random() + 200 , 1000 + i * 1000, i * Math.random())
			this.scene.add(card);
		}

		for(var i = 0 ; i < 10 ; i++) {
			var tonneau = new Entity({geometry: this.assets.three.tonneau.geometry, material: this.assets.three.tonneau.materials[0]})
			tonneau.scale.set(150, 150, 150)
			tonneau.addBody({
				world: this.world,
				type: 'cylinder',
				move: true
			})
			tonneau.setPosition(i * Math.random() , 1000 + i * 1000, i * Math.random())
			this.scene.add(tonneau);
		}
		
		for(var i = 0 ; i < 10 ; i++) {
			var catapulte = new Entity({geometry: this.assets.three.catapulte.geometry, material: this.assets.three.catapulte.materials[0]})
			catapulte.scale.set(100, 100, 100)
			catapulte.addBody({
				world: this.world,
				type: 'box',
				move: true
			})
			catapulte.setPosition(i * Math.random() + 300 , 1000 + i * 1000, i * Math.random())
			this.scene.add(catapulte);
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
			setTimeout(() => {
				this.init()
				this.run()
			})
		})
	}

	setUpWorldAndScene() {
		this.world = new World(1/60, 2, 8, false)
		this.world.gravity = new Vec3(0, -9.8, 0)
		this.world.worldscale(100)

		this.scene = new Scene()

		this.camera = new PerspectiveCamera(35, this.width / this.height, 100, 100000 )

		this.renderer = new WebGLRenderer({canvas: this.canvas, antialias : true})

		var light = new AmbientLight(0x6a6a6a)
		this.scene.add(light)
	}
}