import * as THREE from 'three'

export function addLight() {
	const light = new THREE.DirectionalLight(0xffffff, 1)
	light.position.set(1, 1, 1)
	return light
}

export function addSpotLights() {
	const light1 = new THREE.SpotLight(0xffffff, 10, 0, 1, 1, 2)
	light1.position.set(0.467, 3.731, -0.604)
	const target1 = new THREE.Object3D()
	target1.position.set(0.467, 0, -0.604)
	light1.target = target1
	target1.updateMatrixWorld(true)

	const light2 = new THREE.SpotLight(0xffffff, 10, 0, 1, 1, 2)
	light2.position.set(5.078, 4.171, -1.215)
	const target2 = new THREE.Object3D()
	target2.position.set(5.078, 0, -1.215)
	target2.updateMatrixWorld(true)
	light2.target = target2
	const light3 = new THREE.SpotLight(0xffffff, 10, 0, 1, 1, 2)
	light3.position.set(11.235, 4.296, -0.878)
	const target3 = new THREE.Object3D()
	light3.target = target3
	target3.position.set(11.235, 0, -0.878)
	target3.updateMatrixWorld(true)
	return {
		light1: light1,
		light2: light2,
		light3: light3,
		target1: target1,
		target2: target2,
		target3: target3,
	}
}
