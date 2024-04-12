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
	const geometry = new THREE.PlaneGeometry(50, 50)
	const material = new THREE.MeshStandardMaterial({
		map: textureLoader.load('/metal/color.jpg'),
		aoMap: textureLoader.load('/metal/ao.jpg'),
		normalMap: textureLoader.load('/metal/normal.jpg'),
	})
	const mesh = new THREE.Mesh(geometry, material)
	mesh.rotateX(-Math.PI / 2)
	return mesh
}

export function addHalo() {
	const geometry = new THREE.TorusGeometry(3.35, 0.05, 16, 100)
	const material = new THREE.MeshStandardMaterial({
		color: 0x000000,
		emissive: 0xffffff,
	})
	const mesh = new THREE.Mesh(geometry, material)
	const pointLight = new THREE.PointLight(0xffffff, 50)
	pointLight.position.set(0, 5, 0)

	return { mesh: mesh, light: pointLight }
}
