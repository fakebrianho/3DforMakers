import { CubeTextureLoader } from 'three'

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
	rgbeLoader = new RGBELoader()
}
