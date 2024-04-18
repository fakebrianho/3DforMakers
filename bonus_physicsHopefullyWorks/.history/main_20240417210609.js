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
let bvh
const raycaster = new THREE.Raycaster()
let mesh1
let modelFlag = false
let geometry1
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
	displayCollider: false,
	displayBVH: false,
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

		const pointLight = new THREE.PointLight(0x00ffff)
		pointLight.distance = 7
		pointLight.position.set(-100, -40, 100)
		environment.add(pointLight)

		const porchLight = new THREE.PointLight(0xffdd66)
		porchLight.distance = 15
		porchLight.intensity = 5
		porchLight.position.set(80, 80, 135)
		porchLight.shadow.normalBias = 1e-2
		porchLight.shadow.bias = -1e-3
		porchLight.shadow.mapSize.setScalar(1024)
		porchLight.castShadow = true

		environment.add(porchLight)

		// collect all geometries to merge
		environment.updateMatrixWorld(true)

		const staticGenerator = new StaticGeometryGenerator(environment)
		staticGenerator.attributes = ['position']

		const mergedGeometry = staticGenerator.generate()
		mergedGeometry.boundsTree = new MeshBVH(mergedGeometry)

		collider = new THREE.Mesh(mergedGeometry)
		collider.material.wireframe = true
		collider.material.opacity = 0.5
		collider.material.transparent = true

		visualizer = new MeshBVHHelper(collider, params.visualizeDepth)
		scene.add(visualizer)
		scene.add(collider)
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
	meshes.default = addBoilerPlateMesh()
	meshes.standard = addStandardMesh()

	//lights
	lights.defaultLight = addLight()

	//changes
	meshes.default.scale.set(2, 2, 2)

	//scene operations
	scene.add(meshes.default)
	scene.add(meshes.standard)
	scene.add(lights.defaultLight)

	mesh1 = new THREE.Mesh(
		new THREE.SphereGeometry(2, 20, 20),
		new THREE.MeshBasicMaterial()
	)
	mesh1.position.set(4, 15, 0)
	scene.add(mesh1) // Add mesh1 to the scene

	geometry1 = mesh1.geometry
	geometry1.boundsTree = new MeshBVH(geometry1)
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

// function models() {
// 	const dungeon = new Model({
// 		url: 'dungeon.glb',
// 		scene: scene,
// 		meshes: meshes,
// 		name: 'dungeon',
// 	})
// 	dungeon.init()
// }
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

function update(delta) {
	if (collider) {
		const steps = params.physicsSteps
		for (let i = 0; i < steps; i++) {
			updateSphereCollisions(delta / steps)
		}
	}

	// Update collision animations
	for (let i = 0, l = hits.length; i < l; i++) {
		const hit = hits[i]
		hit.lifetime += delta

		const ratio = hit.lifetime / hit.maxLifetime
		let scale = Math.sin((ratio * 4.5 * Math.PI) / 4)
		scale = 1.0 - Math.pow(1.0 - scale, 2)
		hit.scale.setScalar(scale * hit.maxScale)
		hit.material.opacity = 1.0 - Math.sin((ratio * 2 * Math.PI) / 4)

		if (ratio >= 1) {
			hits.splice(i, 1)
			hit.parent.remove(hit)
			hit.geometry.dispose()
			hit.material.dispose()
			i--
			l--
		}
	}
}

function onCollide(object1, object2, point, normal, velocity, offset = 0) {
	if (velocity < Math.max(Math.abs(0.04 * params.gravity), 5)) {
		return
	}

	// Create an animation when objects collide
	const effectScale =
		Math.max(
			object2
				? Math.max(object1.collider.radius, object2.collider.radius)
				: object1.collider.radius,
			0.4
		) * 2.0
	const plane = new THREE.Mesh(
		new THREE.RingGeometry(0, 1, 30),
		new THREE.MeshBasicMaterial({
			side: 2,
			transparent: true,
			depthWrite: false,
		})
	)
	plane.lifetime = 0
	plane.maxLifetime = 0.4
	plane.maxScale =
		effectScale *
		Math.max(Math.sin((Math.min(velocity / 200, 1) * Math.PI) / 2), 0.35)

	plane.position.copy(point).addScaledVector(normal, offset)
	plane.quaternion.setFromUnitVectors(forwardVector, normal)
	scene.add(plane)
	hits.push(plane)
}

function animate() {
	requestAnimationFrame(animate)
	// const delta = clock.getDelta()

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.z += 0.01

	// meshes.default.scale.x += 0.01
	// if (!modelFlag && meshes.dungeon) {
	// 	modelFlag = true
	// }
	// if (modelFlag) {
	// }
	// console.log(meshes.dungeon)
	const delta = Math.min(clock.getDelta(), 0.1)

	if (collider) {
		collider.visible = params.displayCollider
		visualizer.visible = params.displayBVH

		if (!params.pause) {
			update(params.simulationSpeed * delta)
		}
	}

	renderer.render(scene, camera)
}
