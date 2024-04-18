import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'
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

let player = new THREE.Mesh(new THREE.SphereGeometry(1, 30, 30))
