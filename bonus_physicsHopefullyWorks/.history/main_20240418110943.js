import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { StaticGeometryGenerator, MeshBVHHelper } from 'three-mesh-bvh'
// import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'
// import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh'
import {
	MeshBVH,
	acceleratedRaycast,
	computeBoundsTree,
	disposeBoundsTree,
} from 'three-mesh-bvh'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(0, 0, 5)
let playerVelocity = new THREE.Vector3()
let upVector = new THREE.Vector3(0, 1, 0)
let tempVector = new THREE.Vector3()
let tempVector2 = new THREE.Vector3()
let tempBox = new THREE.Box3()
let tempMat = new THREE.Matrix4()
let tempSegment = new THREE.Line3()
let playerIsOnGround = false

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast
const characterParams = {
	firstPerson: true,

	displayCollider: true,
	displayBVH: true,
	visualizeDepth: 10,
	gravity: -30,
	playerSpeed: 10,
	physicsSteps: 5,

	// reset: reset,
}
const params = {
	displayCollider: true,
	displayBVH: true,
	displayParents: false,
	visualizeDepth: 10,
	gravity: -9.8,
	physicsSteps: 5,
	simulationSpeed: 1,
	sphereSize: 1,
	pause: false,
	step: () => {
		const steps = params.physicsSteps
	},
}
let environment, collider, visualizer
const spheres = []
const tempSphere = new THREE.Sphere()
const deltaVec = new THREE.Vector3()
const tempVec = new THREE.Vector3()
function loadColliderEnvironment() {
	new GLTFLoader().load('dungeon.glb', (res) => {
		environment = res.scene
		// environment.scale.setScalar(0.05)
		environment.updateMatrixWorld(true)

		const staticGenerator = new StaticGeometryGenerator(environment)
		staticGenerator.attributes = ['position']

		const mergedGeometry = staticGenerator.generate()
		mergedGeometry.boundsTree = new MeshBVH(mergedGeometry)

		collider = new THREE.Mesh(mergedGeometry)

		scene.add(environment)

		environment.traverse((c) => {
			if (c.material) {
				c.castShadow = true
				c.receiveShadow = true
				c.material.shadowSide = 2
			}
		})
	})
}
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//lights
	lights.defaultLight = addLight()

	scene.add(lights.defaultLight)

	loadColliderEnvironment()
	const raycaster = new THREE.Raycaster()
	const mouse = new THREE.Vector2()
	let x = 0
	let y = 0
	renderer.domElement.addEventListener('pointerdown', (e) => {
		x = e.clientX
		y = e.clientY
	})

	renderer.domElement.addEventListener('pointerup', (e) => {
		const totalDelta = Math.abs(e.clientX - x) + Math.abs(e.clientY - y)
		if (totalDelta > 2) return

		mouse.x = (e.clientX / window.innerWidth) * 2 - 1
		mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(mouse, camera)
	})

	// models()
	resize()
	animate()
}
let fwdPressed = false,
	bkdPressed = false,
	lftPressed = false,
	rgtPressed = false

window.addEventListener('keydown', function (e) {
	switch (e.code) {
		case 'KeyW':
			fwdPressed = true
			break
		case 'KeyS':
			bkdPressed = true
			break
		case 'KeyD':
			rgtPressed = true
			break
		case 'KeyA':
			lftPressed = true
			break
	}
})

window.addEventListener('keyup', function (e) {
	switch (e.code) {
		case 'KeyW':
			fwdPressed = false
			break
		case 'KeyS':
			bkdPressed = false
			break
		case 'KeyD':
			rgtPressed = false
			break
		case 'KeyA':
			lftPressed = false
			break
	}
})

let player = new THREE.Mesh(
	new RoundedBoxGeometry(0.5, 1.0, 0.5, 10, 0.5),
	new THREE.MeshStandardMaterial()
)

player.geometry.translate(0, -1.0, 0)

player.capsuleInfo = {
	radius: 0.5,
	segment: new THREE.Line3(
		new THREE.Vector3(),
		new THREE.Vector3(0, -1.0, 0.0)
	),
}
player.position.set(4, 4, 0)
scene.add(player)

function updatePlayer(delta) {
	if (playerIsOnGround) {
		playerVelocity.y = delta * params.gravity
	} else {
		playerVelocity.y += delta * params.gravity
	}

	player.position.addScaledVector(playerVelocity, delta)

	// move the player
	const angle = controls.getAzimuthalAngle()
	if (fwdPressed) {
		tempVector.set(0, 0, -1).applyAxisAngle(upVector, angle)
		player.position.addScaledVector(
			tempVector,
			characterParams.playerSpeed * delta
		)
	}

	if (bkdPressed) {
		tempVector.set(0, 0, 1).applyAxisAngle(upVector, angle)
		player.position.addScaledVector(
			tempVector,
			characterParams.playerSpeed * delta
		)
	}

	if (lftPressed) {
		tempVector.set(-1, 0, 0).applyAxisAngle(upVector, angle)
		player.position.addScaledVector(
			tempVector,
			characterParams.playerSpeed * delta
		)
	}

	if (rgtPressed) {
		tempVector.set(1, 0, 0).applyAxisAngle(upVector, angle)
		player.position.addScaledVector(
			tempVector,
			characterParams.playerSpeed * delta
		)
	}

	player.updateMatrixWorld()

	// adjust player position based on collisions
	const capsuleInfo = player.capsuleInfo
	tempBox.makeEmpty()
	tempMat.copy(collider.matrixWorld).invert()
	tempSegment.copy(capsuleInfo.segment)

	// get the position of the capsule in the local space of the collider
	tempSegment.start.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat)
	tempSegment.end.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat)

	// get the axis aligned bounding box of the capsule
	tempBox.expandByPoint(tempSegment.start)
	tempBox.expandByPoint(tempSegment.end)

	tempBox.min.addScalar(-capsuleInfo.radius)
	tempBox.max.addScalar(capsuleInfo.radius)

	collider.geometry.boundsTree.shapecast({
		intersectsBounds: (box) => box.intersectsBox(tempBox),

		intersectsTriangle: (tri) => {
			// check if the triangle is intersecting the capsule and adjust the
			// capsule position if it is.
			const triPoint = tempVector
			const capsulePoint = tempVector2

			const distance = tri.closestPointToSegment(
				tempSegment,
				triPoint,
				capsulePoint
			)
			if (distance < capsuleInfo.radius) {
				const depth = capsuleInfo.radius - distance
				const direction = capsulePoint.sub(triPoint).normalize()

				tempSegment.start.addScaledVector(direction, depth)
				tempSegment.end.addScaledVector(direction, depth)
			}
		},
	})

	// get the adjusted position of the capsule collider in world space after checking
	// triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
	// the origin of the player model.
	const newPosition = tempVector
	newPosition.copy(tempSegment.start).applyMatrix4(collider.matrixWorld)

	// check how much the collider was moved
	const deltaVector = tempVector2
	deltaVector.subVectors(newPosition, player.position)

	// if the player was primarily adjusted vertically we assume it's on something we should consider ground
	playerIsOnGround = deltaVector.y > Math.abs(delta * playerVelocity.y * 0.25)

	const offset = Math.max(0.0, deltaVector.length() - 1e-5)
	deltaVector.normalize().multiplyScalar(offset)

	// adjust the player model
	player.position.add(deltaVector)

	if (!playerIsOnGround) {
		deltaVector.normalize()
		playerVelocity.addScaledVector(
			deltaVector,
			-deltaVector.dot(playerVelocity)
		)
	} else {
		playerVelocity.set(0, 0, 0)
	}

	// adjust the camera
	camera.position.sub(controls.target)
	controls.target.copy(player.position)
	camera.position.add(player.position)
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function animate() {
	requestAnimationFrame(animate)
	const delta = Math.min(clock.getDelta(), 0.1)
	if (characterParams.firstPerson) {
		controls.update()
		controls.maxPolarAngle = Math.PI
		controls.minDistance = 1e-4
		controls.maxDistance = 1e-4
	}

	if (collider) {
		collider.visible = params.displayCollider
		const physicsSteps = characterParams.physicsSteps

		for (let i = 0; i < physicsSteps; i++) {
			updatePlayer(delta / physicsSteps)
		}
	}

	renderer.render(scene, camera)
}
