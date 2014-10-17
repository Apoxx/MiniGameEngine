require('three/examples/js/loaders/OBJLoader')

import {
	JSONLoader,
	LoadingManager,
	ObjectLoader
} from 'three' 

var {OBJLoader} = THREE

export default class AssetsManager {

	constructor() {
		this.loadManager = new LoadingManager()
		this.loadManager.onProgress = ( item, loaded, total ) => console.log( item, loaded, total )
		this.threeLoader = new JSONLoader(this.loadManager)
		this.object3DLoader = new ObjectLoader(this.loadManager)
		this.objLoader = new OBJLoader(this.loadManager)
		this.three = {}
		this.objects = {}
	}

	loadAll(res) {
		var results = []
		for(var key in res.three) {
			results.push(this.loadThree(key, res.three[key]))
		}
		for(var key in res.obj) {
			results.push(this.loadOBJ(key, res.obj[key]))
		}
		for(var key in res.object3D) {
			results.push(this.loadObject3D(key, res.object3D[key]))
		}
		return Promise.all(results)
	}

	loadThree(name, url) {
		var self = this
		return new Promise((resolve, reject) => {
			this.threeLoader.load(url, (geometry, materials, object) => {
				self.three[name] = {geometry, materials}
				resolve(self.three[name])
			})
		})
	}

	loadOBJ(name, url) {
		var self = this
		return new Promise((resolve, reject) => {
			this.objLoader.load( url, ( object ) => {
				self.objects[name] = object
				resolve(self.objects[name])
			})
		})
	}

	loadObject3D(name, url) {
		var self = this
		return new Promise((resolve, reject) => {
			this.object3DLoader.load( url, ( object ) => {
				self.objects[name] = object
				resolve(self.objects[name])
			})
		})
	}
}