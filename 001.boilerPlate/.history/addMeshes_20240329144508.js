import * as THREE from 'three'
export default function addDefaultMesh() {
	const boxGeometry = new THREE.BoxGeometry(1, 1)
	const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
	const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
	return boxMesh
}

export default function addStandardMesh() {
	const boxGeometry = new THREE.BoxGeometry(1, 1)
	const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 })
	const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
	return boxMesh
}