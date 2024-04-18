import { LoadingManager } from 'three'

export function manager(_manager) {
	//
	const loadManager = new LoadingManager(_manager)
	loadManager.onLoad = function () {
		console.log('All assets loaded.')
		// Actions after all assets are loaded
	}
	return loadManager
}
