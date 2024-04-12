import * as THREE from 'three'

export function addLight() {
	const light = new THREE.DirectionalLight(0xffffff, 1)
	light.position.set(1, 1, 1)
	return light
}

export function topLight() {
	const roof = new THREE.PlaneGeometry(10, 10)
	const roofMaterial = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide,
	})
	const planeMesh = new THREE.Mesh(roof, roofMaterial)
	planeMesh.position.set(0, 5, 0)
	planeMesh.rotation.set(Math.PI / 0, 0)
	const rectLight = new THREE.RectAreaLight(0xffffff, 1, 10, 10)
	rectLight.position.copy(planeMesh.position)
	rectLight.rotation.copy(planeMesh)
	rectLight.lookAt(0, 0, 0)
	return [planeMesh, rectLight]
}
