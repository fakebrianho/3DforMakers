import * as THREE from 'three'

export function addLight() {
	const light = new THREE.DirectionalLight(0xffffff, 5)
	light.position.set(1, 1, 1)
	return light
}

export function addLight2() {
	const light = new THREE.DirectionalLight(0xffffff, 5)
	light.position.set(2, 4, 4)
	return light
}
