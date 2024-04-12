import * as THREE from 'three'

export function addLight() {
	const light = new THREE.DirectionalLight(0xffffff, 1)
	light.position.set(1, 1, 1)
	return light
}

export function topLight() {
	const bloomLayer = new THREE.Layers()
	bloomLayer.set(1)

	const roof = new THREE.PlaneGeometry(4, 6)
	const roofMaterial = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide,
	})
	const planeMesh = new THREE.Mesh(roof, roofMaterial)
	planeMesh.position.set(0, 4, 0)
	planeMesh.rotation.set(Math.PI / 2, 0, 0)
	planeMesh.layers.enable(1)

	const rectLight = new THREE.RectAreaLight(0xffffff, 8, 4, 6)
	rectLight.position.copy(planeMesh.position)
	rectLight.rotation.copy(planeMesh.rotation)
	rectLight.lookAt(0, 0, 0)
	rectLight.layers.enable(1)
	return [planeMesh, rectLight]
}
