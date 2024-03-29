import * as THREE from 'three'
export function addLights() {
	const light = new THREE.DirectionalLight(0xffffff, 1)
	light.position.set(2, 2, 4)
	return light
}
