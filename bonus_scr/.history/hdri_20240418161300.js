import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { EquirectangularReflectionMapping } from 'three'

export function HDRI(manager) {
	const rgbeLoader = new RGBELoader()
	const hdrMap = rgbeLoader.load('hdrMap.hdr', (environmentMap) => {
		environmentMap.mapping = EquirectangularReflectionMapping
		return environmentMap
	})
	return hdrMap
}
