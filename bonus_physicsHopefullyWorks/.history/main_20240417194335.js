import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh'
import {
	MeshBVH,
	acceleratedRaycast,
	computeBoundsTree,
	disposeBoundsTree,
} from 'three-mesh-bvh'

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
	mesh1.position.set(4, 4, 0)
	scene.add(mesh1) // Add mesh1 to the scene

	geometry1 = mesh1.geometry
	geometry1.boundsTree = new MeshBVH(geometry1)

	models()
	resize()
	animate()
}

function models() {
	const dungeon = new Model({
		url: 'dungeon.glb',
		scene: scene,
		meshes: meshes,
		name: 'dungeon',
	})
	dungeon.init()
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function createBVHForMeshes(object) {
	object.traverse((child) => {
		if (child.isMesh) {
			child.geometry.boundsTree = new MeshBVH(child.geometry)
		}
	})
}

function checkCollision() {
	// Update the world matrices of the objects
	scene.updateMatrixWorld()

	// Recursively check for collisions
	scene.traverse((object) => {
		if (object.isMesh && object.geometry.boundsTree) {
			const intersects = raycaster.intersectObject(object, true)

			if (intersects.length > 0) {
				// Collision detected
				console.log('Collision detected between mesh1 and', object.name)
				// Handle the collision as needed
			}
		}
	})
}

function animate() {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.z += 0.01

	// meshes.default.scale.x += 0.01
	if (!modelFlag && meshes.dungeon) {
		createBVHForMeshes(meshes.dungeon)
		modelFlag = true
	}
	if (modelFlag) {
		checkCollision()
	}
	// console.log(meshes.dungeon)

	renderer.render(scene, camera)
}
