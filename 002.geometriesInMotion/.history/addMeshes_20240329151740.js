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

export function addPlanet1() {
	const color = tLoader.load('/Planet1/COLOR.jpg')
	const normal = tLoader.load('/Planet1/NORMAL.jpg')
	const ambientOcclusion = tLoader.load('/Planet1/OCCLUSION.jpg')
	const displace = tLoader.load('/Planet1/DISPLACE.png')
	const roughnessMap = tLoader.load('/Planet1/ROUGH.jpg')
	const planetGeometry = new THREE.SphereGeometry(0.3, 32, 16)
	const planetMaterial = new THREE.MeshStandardMaterial({
		map: color,
		normalMap: normal,
		ambientOcclusion: ambientOcclusion,
		displacementMap: displace,
		roughnessMap: roughnessMap,
	})
	const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial)
	return planetMesh
}

export function addPlanet2() {
	const color = tLoader.load('/Planet1/COLOR.jpg')
	const planetGeometry = new THREE.SphereGeometry(0.3, 32, 16)
	const planetMaterial = new THREE.MeshStandardMaterial({ map: color })
	const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial)
	return planetMesh
}
