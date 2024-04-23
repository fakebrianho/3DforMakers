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

export function addTunnel() {
	const wallGeometry1 = new THREE.PlaneGeometry(1, 1)
	const wallMaterial1 = new THREE.MeshBasicMaterial()
	const wall1 = new THREE.Mesh(wallGeometry1, wallMaterial1)
	const wallGeometry2 = new THREE.PlaneGeometry(1, 1)
	const wallMaterial2 = new THREE.MeshBasicMaterial()
	const wall2 = new THREE.Mesh(wallGeometry2, wallMaterial2)
	const wallGeometry3 = new THREE.PlaneGeometry(1, 1)
	const wallMaterial3 = new THREE.MeshBasicMaterial()
	const wall3 = new THREE.Mesh(wallGeometry3, wallMaterial3)
	const wallGeometry4 = new THREE.PlaneGeometry(1, 1)
	const wallMaterial4 = new THREE.MeshBasicMaterial()
	const wall4 = new THREE.Mesh(wallGeometry4, wallMaterial4)
}
