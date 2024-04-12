import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()

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

export function addFloor() {
	const plane = new THREE.PlaneGeometry(3, 3)
	const planeMaterial = new THREE.MeshBasicMaterial({ color: 'yellow' })
	const planeMesh = new THREE.Mesh(plane, planeMaterial)
	planeMesh.position.set(0, -2, 0)
	planeMesh.rotation.set(0, Math.PI / 2, 0)
	return planeMesh
}
