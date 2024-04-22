import { LoadingManager } from 'three'
import gsap from 'gsap'

export function manager(callback) {
	const loadManager = new LoadingManager()
	loadManager.onLoad = function () {
		console.log('all assets loaded')
	}
	return loadManager
}
