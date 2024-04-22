import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { EquirectangularReflectionMapping } from 'three'

export function HDRI(manager) {
	const rgbeLoader = new RGBELoader()
	const hdrMap = rgbeLoader.load('hdri.hdr', (envMap) => {
		envMap.mapping = EquirectangularReflectionMapping
		return envMap
	})
	return hdrMap
}
