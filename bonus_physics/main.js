import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh, addFloor } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as CANNON from 'cannon-es'

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
const bodys = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
const world = new CANNON.World()
let physicsMaterial
world.gravity.set(0, -9.82, 0)
let oldElapsedTime = 0
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.standard = addStandardMesh()
	meshes.floor = addFloor()

	//lights
	lights.defaultLight = addLight()

	//changes
	meshes.default.scale.set(2, 2, 2)

	//scene operations
	scene.add(meshes.default)
	scene.add(meshes.standard)
	scene.add(meshes.floor)
	scene.add(lights.defaultLight)

	physics()
	resize()
	animate()
}

function physics() {
	// Tweak contact properties.
	// Contact stiffness - use to make softer/harder contacts
	world.defaultContactMaterial.contactEquationStiffness = 1e9

	// Stabilization time in number of timesteps
	world.defaultContactMaterial.contactEquationRelaxation = 4
	const solver = new CANNON.GSSolver()
	solver.iterations = 7
	solver.tolerance = 0.1
	world.solver = new CANNON.SplitSolver(solver)
	physicsMaterial = new CANNON.Material('physics')
	const physics_physics = new CANNON.ContactMaterial(
		physicsMaterial,
		physicsMaterial,
		{
			friction: 0.0,
			restitution: 0.3,
		}
	)

	// We must add the contact materials to the world
	world.addContactMaterial(physics_physics)
	// Create the ground plane
	const groundShape = new CANNON.Plane()
	const groundBody = new CANNON.Body({ mass: 0, material: physicsMaterial })
	groundBody.addShape(groundShape)
	groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
	world.addBody(groundBody)
	//box
	const size = 1
	const halfExtents = new CANNON.Vec3(size, size, size)
	const boxShape = new CANNON.Box(halfExtents)
	const boxBody = new CANNON.Body({
		mass: 1,
		position: new CANNON.Vec3(2, 0, 0),
		shape: boxShape,
	})
	bodys.boxBody = boxBody
	world.addBody(boxBody)

	//floor
	const floorShape = new CANNON.Plane()
	const floorBody = new CANNON.Body()
	floorBody.mass = 0
	floorBody.addShape(floorShape)
	floorBody.quaternion.setFromAxisAngle(
		new CANNON.Vec3(-1, 0, 0),
		Math.PI * 0.5
	)
	world.addBody(floorBody)
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
	const elapsedTime = clock.getElapsedTime()
	const deltaTime = elapsedTime - oldElapsedTime
	oldElapsedTime = elapsedTime
	world.step(1 / 60, deltaTime, 3)

	// meshes.default.position.set(...bodys.boxBody.position)
	meshes.default.position.x = bodys.boxBody.position.x
	meshes.default.position.y = bodys.boxBody.position.y
	meshes.default.position.z = bodys.boxBody.position.z

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.z += 0.01

	// meshes.default.scale.x += 0.01

	renderer.render(scene, camera)
}
