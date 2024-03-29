import * as THREE from 'three'
export function addLights() {
	const light = new THREE.DirectionalLight(0xffffff, 1)
	light.position.set(1, 2, 3)
	return light
}
