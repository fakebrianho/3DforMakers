import * as THREE from 'three'

export function addLight() {
	const light = new THREE.DirectionalLight(0xffffff, 1)
	light.position.set(1, 1, 1)
	return light
}

export function topLight() {
	const roof = new THREE.Plane(10, 10)
	const roofMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
}
