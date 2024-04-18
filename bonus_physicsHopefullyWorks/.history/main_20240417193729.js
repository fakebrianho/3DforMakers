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

function createBVHForMeshes(meshGroup) {
	meshGroup.children.forEach((child) => {
		if (child.isMesh) {
			child.geometry.boundsTree = new MeshBVH(child.geometry)
		}
	})
}

function checkCollision() {
	// Update the matrices of the meshes
	meshes.dungeon.updateMatrixWorld()
	mesh1.updateMatrixWorld()

	// Compute the bounding box of mesh1 in world space
	const box1 = new THREE.Box3().setFromObject(mesh1)

	// Iterate over the children of meshes.dungeon (assuming it's a THREE.Group)
	console.log9'hi
	meshes.dungeon.children.forEach((child) => {
		if (child.isMesh) {
			const geometry = child.geometry
			const positionAttribute = geometry.attributes.position

			for (let i = 0; i < positionAttribute.count; i++) {
				const vertex = new THREE.Vector3().fromBufferAttribute(
					positionAttribute,
					i
				)

				// Transform the vertex to world space
				vertex.applyMatrix4(child.matrixWorld)

				// Check if the vertex is inside the bounding box of mesh1
				if (box1.containsPoint(vertex)) {
					// Perform raycast from the vertex towards mesh1
					raycaster.set(
						vertex,
						new THREE.Vector3()
							.subVectors(vertex, mesh1.position)
							.normalize()
					)
					const intersects = raycaster.intersectObject(mesh1, true)
					console.log(intersects)

					if (intersects.length > 0) {
						// Collision detected
						console.log(
							'Collision detected between mesh1 and meshes.dungeon!'
						)
						// Handle the collision as needed
					}
				}
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
