import { LoadingManager } from 'three'

export function manager() {
	//
	const loadManager = new LoadingManager()
	loadManager.onLoad = function () {
		console.log('All assets loaded.')
		// Actions after all assets are loaded
	}
}
