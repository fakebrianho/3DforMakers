import * as THREE from 'three'

export function addBoilerPlateMesh() {
	const box = new THREE.BoxGeometry(0.5, 0.5, 0.5)
	const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
	const boxMesh = new THREE.Mesh(box, boxMaterial)
	boxMesh.position.set(2, 0, 0)
	return boxMesh
}

export function addStandardMesh() {
	const box = new THREE.BoxGeometry(1, 1, 1)
	const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
	const boxMesh = new THREE.Mesh(box, boxMaterial)
	boxMesh.position.set(-2, 0, 0)
	return boxMesh
}

export function addPlanet1() {
	const sphere = new THREE.SphereGeometry(1, 32, 16)
	const sphereMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
	const sphereMesh = new THREE.Mesh(sphere, sphereMat)
	sphereMesh.position.set(0, 0, 0)
	return sphereMesh
}
