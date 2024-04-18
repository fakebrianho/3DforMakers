import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { EquirectangularReflectionMapping } from 'three'

export function HDRI(_manager) {
	const rgbeLoader = new RGBELoader(_manager)
	const hdrMap = rgbeLoader.load('hdrMap.hdr', (environmentMap) => {
		environmentMap.mapping = EquirectangularReflectionMapping
		return environmentMap
	})
	return hdrMap
}
