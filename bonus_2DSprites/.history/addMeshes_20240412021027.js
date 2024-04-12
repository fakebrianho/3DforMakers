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

export function addSpritesCharacter() {
	let currentTile = 0
	const horizontalTile = 8
	const verticalTile = 9
	const offsetX = (currentTile % horizontalTile) / horizontalTile
	const offsetY = 
	const map = textureLoader.load('/AnimationSheet_Character.png')
	map.repeat.set(1 / horizontalTile, 1 / verticalTile)
	const material = new THREE.SpriteMaterial({
		map: map,
	})
	const sprite = new THREE.Sprite(material)
	return sprite
}
