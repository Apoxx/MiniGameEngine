import {
	JSONLoader
} from 'three'

export default class AssetsManager {

	constructor() {
		this.loader = new JSONLoader()
		this.models = {}
	}

	loadAll(res) {
		var results = []
		for(var key in res) {
			results.push(this.load(key, res[key]))
		}
		return Promise.all(results)
	}

	load(name, url) {
		var self = this
		return new Promise((resolve, reject) => {
			this.loader.load(url, (geometry, materials) => {
				self.models[name] = {geometry, materials}
				resolve(self.models[name])
			})
		})
	}

	get(name) {
		return this.models[name]
	}
}