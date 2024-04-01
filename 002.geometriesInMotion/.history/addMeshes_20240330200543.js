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
	const planetGeometry = new THREE.SphereGeometry(0.3, 200, 100)
	const planetMaterial = new THREE.MeshStandardMaterial({
		map: color,
		normalMap: normal,
		ambientOcclusion: ambientOcclusion,
		displacementMap: displace,
		displacementScale: 0.1,
		roughnessMap: roughnessMap,
		roughness: 0.3,
		metalness: 0.3,
	})
	const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial)
	return planetMesh
}
export function addPlanet2() {
	const color = tLoader.load('/Planet2/COLOR.jpg')
	const normal = tLoader.load('/Planet2/NORM.jpg')
	const ambientOcclusion = tLoader.load('/Planet2/OCC.jpg')
	const displace = tLoader.load('/Planet2/DISP.png')
	const roughnessMap = tLoader.load('/Planet2/ROUGH.jpg')
	const planetGeometry = new THREE.SphereGeometry(0.3, 200, 100)
	const planetMaterial = new THREE.MeshStandardMaterial({
		map: color,
		normalMap: normal,
		ambientOcclusion: ambientOcclusion,
		displacementMap: displace,
		displacementScale: 0.3,
		roughnessMap: roughnessMap,
		roughness: 1.0,
		// metalness: 0.1,
	})
	const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial)
	planetMesh.position.set(0, 1, 0)
	return planetMesh
}
export function addPlanet3() {
	const color = tLoader.load('/Planet3/COLOR.jpg')
	const normal = tLoader.load('/Planet3/NORM.jpg')
	const ambientOcclusion = tLoader.load('/Planet3/OCC.jpg')
	const displace = tLoader.load('/Planet3/DISP.png')
	const roughnessMap = tLoader.load('/Planet3/ROUGH.jpg')
	const planetGeometry = new THREE.SphereGeometry(0.3, 200, 100)
	const planetMaterial = new THREE.MeshStandardMaterial({
		map: color,
		normalMap: normal,
		ambientOcclusion: ambientOcclusion,
		displacementMap: displace,
		// displacementScale: 0.3,
		roughnessMap: roughnessMap,
		roughness: 1.0,
		// metalness: 0.1,
	})
	const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial)
	planetMesh.position.set(0, -1, 0)
	return planetMesh
}

// export function addPlanet2() {
// 	const color = tLoader.load('/Planet1/COLOR.jpg')
// 	const planetGeometry = new THREE.SphereGeometry(0.3, 32, 16)
// 	const planetMaterial = new THREE.MeshStandardMaterial({ map: color })
// 	const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial)
// 	return planetMesh
// }
