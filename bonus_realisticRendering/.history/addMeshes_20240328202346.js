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

export function addPlanet1() {
	const color = textureLoader.load('/COLOR.jpg')
	const displace = textureLoader.load('/DISP.png')
	const sphere = new THREE.SphereGeometry(0.5, 32, 16)
	const sphereMat = new THREE.MeshStandardMaterial({
		map: color,
		displacementMap: displace,
		displacementScale: 1.3,
		// wireframe: true,
	})
	const sphereMesh = new THREE.Mesh(sphere, sphereMat)
	sphereMesh.position.set(0, 0, 0)
	return sphereMesh
}

export function addPlanet2() {
	const sphere = new THREE.SphereGeometry(0.5, 32, 16)
	const sphereMat = new THREE.MeshBasicMaterial({ color: 0xffff00 })
	const sphereMesh = new THREE.Mesh(sphere, sphereMat)
	sphereMesh.position.set(0, 0, 0)
	return sphereMesh
}
