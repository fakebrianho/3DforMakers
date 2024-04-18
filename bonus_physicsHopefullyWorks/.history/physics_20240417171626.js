import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'
import { MeshBVH, MeshBVHHelper, StaticGeometryGenerator } from 'three-mesh-bvh'

const params = {
	firstPerson: false,

	displayCollider: false,
	displayBVH: false,
	visualizeDepth: 10,
	gravity: -30,
	playerSpeed: 10,
	physicsSteps: 5,

	reset: reset,
}

export function character() {
	let player = new THREE.Mesh(
		new RoundedBoxGeometry(1.0, 2.0, 1.0, 10, 0.5),
		new THREE.MeshStandardMaterial()
	)

	player.capsuleInfo = {
		radius: 0.5,
		segment: new THREE.Line3(
			new THREE.Vector3(),
			new THREE.Vector3(0, -1.0, 0.0)
		),
	}

	return player
}

export function colliderWorld() {}
