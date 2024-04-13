import * as THREE from 'three'

export function addLight() {
	const light = new THREE.DirectionalLight(0xffffff, 1)
	light.position.set(1, 1, 1)
	return light
}

export function addSpotLights() {
	const light1 = new THREE.SpotLight(0xffffff, 1, 0, 1, 1, 2)
	light1.position.set(0.467, 3.731, -0.604)
	const light2 = new THREE.SpotLight(0xffffff, 1, 0, 1, 1, 2)
	light2.position.set(0.467, 3.731, -0.604)
	const light3 = new THREE.SpotLight(0xffffff, 1, 0, 1, 1, 2)
}
