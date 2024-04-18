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
let environment, collider, visualizer, player, controls
let playerIsOnGround = false
let fwdPressed = false,
	bkdPressed = false,
	lftPressed = false,
	rgtPressed = false
let playerVelocity = new THREE.Vector3()
let upVector = new THREE.Vector3(0, 1, 0)
let tempVector = new THREE.Vector3()
let tempVector2 = new THREE.Vector3()
let tempBox = new THREE.Box3()
let tempMat = new THREE.Matrix4()
let tempSegment = new THREE.Line3()

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

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
		for (let i = 0; i < steps; i++) {
			update(0.016 / steps)
		}
	},
}
let environment, collider, visualizer
const spheres = []
const hits = []
const tempSphere = new THREE.Sphere()
const deltaVec = new THREE.Vector3()
const tempVec = new THREE.Vector3()
const forwardVector = new THREE.Vector3(0, 0, 1)
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

	const c = character()
	scene.add(c)

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

		const sphere = createSphere()
		sphere.position
			.copy(camera.position)
			.addScaledVector(raycaster.ray.direction, 3)
		sphere.velocity
			.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
			.addScaledVector(raycaster.ray.direction, 10 * Math.random() + 15)
			.multiplyScalar(0.5)
	})
	window.createSphere = createSphere

	// models()
	resize()
	animate()
}
let fwdPressed = false,
	bkdPressed = false,
	lftPressed = false,
	rgtPressed = false

const characterParams = {
	firstPerson: false,

	displayCollider: false,
	displayBVH: false,
	visualizeDepth: 10,
	gravity: -30,
	playerSpeed: 10,
	physicsSteps: 5,

	// reset: reset,
}

export function character() {
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
			case 'Space':
				if (playerIsOnGround) {
					playerVelocity.y = 10.0
					playerIsOnGround = false
				}

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

	// if the player has fallen too far below the level reset their position to the start
	if (player.position.y < -25) {
		reset()
	}
}

function createSphere() {
	const white = new THREE.Color(0xffffff)
	const color = new THREE.Color(0x263238 / 2)
		.lerp(white, Math.random() * 0.5 + 0.5)
		.convertSRGBToLinear()
	const sphere = new THREE.Mesh(
		new THREE.SphereGeometry(1, 20, 20),
		new THREE.MeshStandardMaterial({ color })
	)
	scene.add(sphere)
	sphere.castShadow = true
	sphere.receiveShadow = true
	sphere.material.shadowSide = 2

	const radius = 0.5 * params.sphereSize * (Math.random() * 0.2 + 0.6)
	sphere.scale.setScalar(radius)
	sphere.collider = new THREE.Sphere(sphere.position, radius)
	sphere.velocity = new THREE.Vector3(0, 0, 0)
	sphere.mass = (Math.pow(radius, 3) * Math.PI * 4) / 3

	spheres.push(sphere)
	return sphere
}
function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}
function updateSphereCollisions(deltaTime) {
	const bvh = collider.geometry.boundsTree
	for (let i = 0, l = spheres.length; i < l; i++) {
		const sphere = spheres[i]
		const sphereCollider = sphere.collider

		// move the sphere
		sphere.velocity.y += params.gravity * deltaTime
		sphereCollider.center.addScaledVector(sphere.velocity, deltaTime)

		// remove the spheres if they've left the world
		if (sphereCollider.center.y < -80) {
			spheres.splice(i, 1)
			i--
			l--

			sphere.material.dispose()
			sphere.geometry.dispose()
			scene.remove(sphere)
			continue
		}

		// get the sphere position in world space
		tempSphere.copy(sphere.collider)

		let collided = false
		bvh.shapecast({
			intersectsBounds: (box) => {
				return box.intersectsSphere(tempSphere)
			},

			intersectsTriangle: (tri) => {
				// get delta between closest point and center
				tri.closestPointToPoint(tempSphere.center, deltaVec)
				deltaVec.sub(tempSphere.center)
				const distance = deltaVec.length()
				if (distance < tempSphere.radius) {
					// move the sphere position to be outside the triangle
					const radius = tempSphere.radius
					const depth = distance - radius
					deltaVec.multiplyScalar(1 / distance)
					tempSphere.center.addScaledVector(deltaVec, depth)

					collided = true
				}
			},

			boundsTraverseOrder: (box) => {
				return (
					box.distanceToPoint(tempSphere.center) - tempSphere.radius
				)
			},
		})

		if (collided) {
			// get the delta direction and reflect the velocity across it
			deltaVec
				.subVectors(tempSphere.center, sphereCollider.center)
				.normalize()
			sphere.velocity.reflect(deltaVec)

			// dampen the velocity and apply some drag
			const dot = sphere.velocity.dot(deltaVec)
			sphere.velocity.addScaledVector(deltaVec, -dot * 0.5)
			sphere.velocity.multiplyScalar(Math.max(1.0 - deltaTime, 0))

			// update the sphere collider position
			sphereCollider.center.copy(tempSphere.center)
		}
	}

	// Handle sphere collisions
	for (let i = 0, l = spheres.length; i < l; i++) {
		const s1 = spheres[i]
		const c1 = s1.collider
		for (let j = i + 1; j < l; j++) {
			const s2 = spheres[j]
			const c2 = s2.collider

			// If they actually intersected
			deltaVec.subVectors(c1.center, c2.center)
			const depth = deltaVec.length() - (c1.radius + c2.radius)
			if (depth < 0) {
				deltaVec.normalize()

				// get the magnitude of the velocity in the hit direction
				const v1dot = s1.velocity.dot(deltaVec)
				const v2dot = s2.velocity.dot(deltaVec)

				// distribute how much to offset the spheres based on how
				// quickly they were going relative to each other. The ball
				// that was moving should move back the most. Add a max value
				// to avoid jitter.
				const offsetRatio1 = Math.max(v1dot, 0.2)
				const offsetRatio2 = Math.max(v2dot, 0.2)

				const total = offsetRatio1 + offsetRatio2
				const ratio1 = offsetRatio1 / total
				const ratio2 = offsetRatio2 / total

				// correct the positioning of the spheres
				c1.center.addScaledVector(deltaVec, -ratio1 * depth)
				c2.center.addScaledVector(deltaVec, ratio2 * depth)

				// Use the momentum formula to adjust velocities
				const velocityDifference = new THREE.Vector3()
				velocityDifference
					.addScaledVector(deltaVec, -v1dot)
					.addScaledVector(deltaVec, v2dot)

				const velDiff = velocityDifference.length()
				const m1 = s1.mass
				const m2 = s2.mass

				// Compute new velocities in the moving frame of the sphere that
				// moved into the other.
				let newVel1, newVel2
				const damping = 0.5
				if (
					velocityDifference.dot(s1.velocity) >
					velocityDifference.dot(s2.velocity)
				) {
					newVel1 = (damping * velDiff * (m1 - m2)) / (m1 + m2)
					newVel2 = (damping * velDiff * 2 * m1) / (m1 + m2)

					// remove any existing relative velocity from the moving sphere
					newVel1 -= velDiff
				} else {
					newVel1 = (damping * velDiff * 2 * m2) / (m1 + m2)
					newVel2 = (damping * velDiff * (m2 - m1)) / (m1 + m2)

					// remove any existing relative velocity from the moving sphere
					newVel2 -= velDiff
				}

				// Apply new velocities
				velocityDifference.normalize()
				s1.velocity.addScaledVector(velocityDifference, newVel1)
				s2.velocity.addScaledVector(velocityDifference, newVel2)

				tempVec.copy(c1.center).addScaledVector(deltaVec, -c1.radius)
				onCollide(s1, s2, tempVec, deltaVec, velDiff, 0)
			}
		}

		s1.position.copy(c1.center)
	}
}

function update(delta) {
	if (collider) {
		const steps = params.physicsSteps
		for (let i = 0; i < steps; i++) {
			updateSphereCollisions(delta / steps)
		}
	}
}

function animate() {
	requestAnimationFrame(animate)
	const delta = Math.min(clock.getDelta(), 0.1)

	if (collider) {
		update(params.simulationSpeed * delta)
	}

	renderer.render(scene, camera)
}
