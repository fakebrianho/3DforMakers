import * as THREE from 'three'
export function addLights() {
	const light = new THREE.DirectionalLight(0x000000, 1)
	light.position.set(2, 3, 4)
	return light
}
