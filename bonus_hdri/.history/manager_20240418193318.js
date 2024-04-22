import { LoadingManager } from 'three'
import gsap from 'gsap'

export function manager(callback) {
	const loadManager = new LoadingManager()
	loadManager.onLoad = function () {
		gsap.to('.loader', {
			opacity: 0,
			duration: 4,
		})
	}
	return loadManager
}
