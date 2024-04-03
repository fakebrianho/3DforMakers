import * as THREE from 'three'

const tLoader = new THREE.TextureLoader()

export function addBoilerPlateMesh() {
	const box = new THREE.BoxGeometry(1, 1, 1)
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

export function addBackground() {
	const color = tLoader.load('/color.jpg')
	const geometry = new THREE.PlaneGeometry(5, 5)
	const material = new THREE.MeshBasicMaterial({
		map: color,
	})
	const mesh = new THREE.Mesh(geometry, material)
	return mesh
}

export function addGlassKnot() {
	const displace = tLoader.load('/displace.png')
	const geometry = new THREE.TorusKnotGeometry(0.6, 0.01, 100, 100, 2, 3)
	const material = new THREE.MeshPhysicalMaterial({
		displacementMap: displace,
		displacementScale: 0.3,
	})
	const mesh = new THREE.Mesh(geometry, material)
	return mesh
}
