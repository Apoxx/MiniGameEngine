//well ...
window.THREE = require('three')

var Stats = require('./Stats')
var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms

// Align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );

import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	AmbientLight,
	BoxGeometry,
	SphereGeometry,
	MeshBasicMaterial,
	MeshLambertMaterial,
	MeshPhongMaterial,
	Object3D,
	Vector3,
	ImageUtils,
	RepeatWrapping,
	Mesh
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
		this.player.setPosition(0,1000,0)
		this.scene.add(this.player)

		this.controls = new Controls(this)

		var floorGeo = new BoxGeometry(10000, 100, 10000)
		var t = ImageUtils.loadTexture('assets/textures/stone.png')
		t.wrapS = t.wrapT = RepeatWrapping
		t.repeat.set(32, 32)
		var n = ImageUtils.loadTexture('assets/textures/stone.nmap.png')
		n.wrapS = n.wrapT = RepeatWrapping
		n.repeat.set(32, 32)
		var floorMat = new MeshPhongMaterial({map: t, normalMap: n})
		var container = new Object3D()
		container.add(new Mesh(floorGeo, floorMat))
		var floor = new Entity(container)
		floor.addBody(this.world, 'box', false)
		this.scene.add(floor)

		this.assets.objects.house.children[0].material.map = ImageUtils.loadTexture('assets/models/house/house.jpg')

		/*var house = new Entity(this.assets.objects.house)
		house.scale.set(50, 50, 50)
		//house.addBody(this.world, 'box', false)

		this.scene.add(house)*/


		/*var ball = new Entity(new Mesh(new SphereGeometry(100)))
		ball.addBody(this.world, 'sphere', true)
		this.scene.add(ball)
		ball.setPosition(0, 1000, 0)*/



		var ball1 = new Mesh(new BoxGeometry(100, 100, 100))

		var ball2 = new Mesh(new SphereGeometry(50))
		var ball3 = new Mesh(new BoxGeometry(100, 100, 100))
		//ball3.scale.set(0.5, 0.5, 0.5)
		ball3.rotation.x = Math.PI / 4
		ball3.rotation.y = Math.PI / 4
		ball3.rotation.z = Math.PI / 4

		ball2.position.z = 200
		ball3.position.z = 400
		//ball1.position.z = 100


		var c = new Object3D()
		c.add(ball1)
		c.add(ball2)
		c.add(ball3)
		var doubleBall = new Entity(c)
		//doubleBall.add(ball2)
		doubleBall.position.y = 500
		doubleBall.position.x = 2000

		doubleBall.scale.set(2, 2, 2)

		doubleBall.addBody(this.world, 'box', true)

		doubleBall.setPosition(500, 500, 500)

		this.scene.add(doubleBall)


		/*var sphereMat = new MeshBasicMaterial()
		var sphereGeo = new SphereGeometry(100)
		var model = new Mesh(sphereGeo, sphereMat)
		var model2 = new Mesh(sphereGeo, sphereMat)
		model2.position.x = 200

		var cont = new Object3D()
		cont.add(model)
		cont.add(model2)

		for(var i = 0; i < 10 ; i ++) {
		    var sphere = new Entity(cont)
			sphere.addBody({
				world: this.world,
				move: true
			})

			this.scene.add(sphere)
		}*/

		/*var box = new Box(1, 1, 1)
		box.scale.set(3, 1, 3)

		box.setPosition(0, 0, -10)

		this.scene.add(box)*/

		//this.assets.objects.house.scale.set(10, 10, 10)

		//this.assets.objects.house.children[0].material.map = ImageUtils.loadTexture('assets/models/house/house.jpg')

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
		/*var entity = new Entity(this.assets.objects.houseCollisions)
		entity.scale.set(50, 50, 50)
		//entity.addBody(this.world, 'box',  true)
		this.scene.add(entity)*/

		//entity.setPosition(0, -500, 0)

		//console.log(this.assets.objects.houseCollisions)

		/*for(var i = 0 ; i < 1 ; i++) {
			var box = new Box()
			box.addBody(this.world, 'box', false)
			.setPosition(0, 10 + i * 10, 0)
			this.scene.add(box);
		}*/
		

		/*for(var i = 0 ; i < 10 ; i++) {
			var card = new Entity({geometry: this.assets.three.card.geometry, material: this.assets.three.card.materials[0]})
			card.scale.set(100, 100, 100)
			card.addBody({
				world: this.world,
				type: 'box',
				move: true
			})
			.setPosition(i * Math.random() + 200 , 1000 + i * 1000, i * Math.random())
			this.scene.add(card);
		}*/

		/*for(var i = 0 ; i < 1 ; i++) {
			var tonneau = new Entity(new Mesh(this.assets.three.tonneau.geometry, this.assets.three.tonneau.materials[0]))
			tonneau.scale.set(100, 100, 100)
			tonneau.addBody(this.world, 'sphere', true)
			tonneau.setPosition(0, 1000, 0)
			this.scene.add(tonneau);
		}*/
		
		/*for(var i = 0 ; i < 10 ; i++) {
			var catapulte = new Entity({geometry: this.assets.three.catapulte.geometry, material: this.assets.three.catapulte.materials[0]})
			catapulte.scale.set(100, 100, 100)
			catapulte.addBody({
				world: this.world,
				type: 'box',
				move: true
			})
			catapulte.setPosition(i * Math.random() + 300 , 1000 + i * 1000, i * Math.random())
			this.scene.add(catapulte);
		}*/



	}

	run() {
		console.log('Run !')
		//
		var prevTime = 0
		var loop = (time) => {
			window.requestAnimationFrame(loop)
			stats.begin();
			this.update(time, time - prevTime)
			this.render(time, time - prevTime)
			stats.end();
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
		this.world.gravity = new Vec3(0,-9.82,0)

		this.scene = new Scene()

		this.camera = new PerspectiveCamera(35, this.width / this.height, 10, 10000 )

		this.renderer = new WebGLRenderer({canvas: this.canvas, antialias : true})

		var light = new AmbientLight(0x6a6a6a)
		this.scene.add(light)
	}
}