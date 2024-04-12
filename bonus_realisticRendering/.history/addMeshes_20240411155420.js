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

export function addHalo() {
	const geometry = new THREE.TorusGeometry(3.35, 0.05, 16, 100)
	const material = new THREE.MeshStandardMaterial({
		color: 0x000000,
		emissive: 0xffffff,
	})
	const mesh = new THREE.Mesh(geometry, material)
	const pointLight = new THREE.PointLight(0xffffff, 1)
	pointLight.position.set(0, 5, 0)

	return { mesh: mesh, light: pointLight }
}
