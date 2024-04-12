import { CubeTextureLoader } from 'three'

export function environment() {
	const cLoader = new CubeTextureLoader()
	const environmentMap = cLoader.load([])
}
