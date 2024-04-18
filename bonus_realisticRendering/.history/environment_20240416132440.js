import { CubeTextureLoader, EquirectangularReflectionMapping } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
export function environment() {
	const cLoader = new CubeTextureLoader()
	const environmentMap = cLoader.load([
		'px.png',
		'nx.png',
		'py.png',
		'ny.png',
		'pz.png',
		'nz.png',
	])
	return environmentMap
}

export function hdriBG() {
	const rgbeLoader = new RGBELoader()
	const hdrMap = rgbeLoader.load('sky.hdr', (environmentMap) => {
		environmentMap.mapping = EquirectangularReflectionMapping
		return environmentMap
	})
	return hdrMap
}
