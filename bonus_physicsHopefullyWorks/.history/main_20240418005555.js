import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { StaticGeometryGenerator, MeshBVHHelper } from 'three-mesh-bvh'
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
	// TODO: support steps based on given sphere velocity / radius
	simulationSpeed: 1,
	sphereSize: 1,
	pause: false,
	step: () => {
		const steps = params.physicsSteps
		for (let i = 0; i < steps; i++) {
			update(0.016 / steps)
		}
	},
	// explode: explodeSpheres,
	// reset: reset,
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
		// collider.material.wireframe = true
		// collider.material.opacity = 0.5
		// collider.material.transparent = true

		// visualizer = new MeshBVHHelper(collider, params.visualizeDepth)
		// scene.add(visualizer)
		// scene.add(collider)
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

	//meshes

	//lights
	lights.defaultLight = addLight()

	//changes

	//scene operations

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
// function onCollide(object1, object2, point, normal, velocity, offset = 0) {
// 	// if (velocity < Math.max(Math.abs(0.04 * params.gravity), 5)) {
// 	// 	return
// 	// }
// }
function update(delta) {
	if (collider) {
		const steps = params.physicsSteps
		for (let i = 0; i < steps; i++) {
			updateSphereCollisions(delta / steps)
		}
	}

	// Update collision animations
	// for (let i = 0, l = hits.length; i < l; i++) {
	// 	const hit = hits[i]
	// 	hit.lifetime += delta

	// 	const ratio = hit.lifetime / hit.maxLifetime
	// 	let scale = Math.sin((ratio * 4.5 * Math.PI) / 4)
	// 	scale = 1.0 - Math.pow(1.0 - scale, 2)
	// 	hit.scale.setScalar(scale * hit.maxScale)
	// 	hit.material.opacity = 1.0 - Math.sin((ratio * 2 * Math.PI) / 4)

	// 	if (ratio >= 1) {
	// 		hits.splice(i, 1)
	// 		hit.parent.remove(hit)
	// 		hit.geometry.dispose()
	// 		hit.material.dispose()
	// 		i--
	// 		l--
	// 	}
	// }
}

function animate() {
	requestAnimationFrame(animate)
	const delta = Math.min(clock.getDelta(), 0.1)

	if (collider) {
		// collider.visible = params.displayCollider
		// visualizer.visible = params.displayBVH

		if (!params.pause) {
			update(params.simulationSpeed * delta)
		}
	}

	renderer.render(scene, camera)
}
