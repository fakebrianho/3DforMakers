import * as THREE from 'three'

export const addBoilerPlateMesh = () => {
	const box = new THREE.BoxGeometry(1, 1, 1)
	const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
	const boxMesh = new THREE.Mesh(box, boxMaterial)
	boxMesh.position.set(-2, 0, 0)
}

// function addBoilerPlateMesh(){

// }
