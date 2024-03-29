import * as THREE from 'three'
export function addLights() {
	const light = new THREE.PointLight(0xffffff, 1)
	light.position.set(2, 3, 4)
	return light
}
