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
	mesh.position.set(0, 0, -1)
	return mesh
}

export function addGlassKnot() {
	const displace = tLoader.load('/displace.png')
	const ambient = tLoader.load('/ambient.jpg')
	const normals = tLoader.load('/normal.jpg')
	const color = tLoader.load('/color.jpg')
	const roughness = tLoader.load('/roughness.jpg')
	const geometry = new THREE.TorusKnotGeometry(0.6, 0.01, 100, 100, 2, 3)
	const material = new THREE.MeshPhysicalMaterial({
		color: 0xff0000,
		map: color,
		displacementMap: displace,
		displacementScale: 0.3,
		aoMap: ambient,
		normalMap: normals,
		roughnessMap: roughness,
		transmission: 1.0,
		ior: 2.33,
		metalness: 0.1,
		roughness: 0.0,
		thickness: 1.0,
	})
	const mesh = new THREE.Mesh(geometry, material)
	return mesh
}

export function addMatcap() {
	const mat = tLoader.load('/matcap.png')
	const geometry = new THREE.TorusKnotGeometry(0.6, 0.3, 100, 100, 2, 3)
	const material = new THREE.MeshMatcapMaterial({ matcap: mat })
	const mesh = new THREE.Mesh(geometry, material)
	mesh.position.set(2, 0, 0)
	return mesh
}
