import './style.css'
import * as THREE from 'three'
import {
	addBoilerPlateMesh,
	addStandardMesh,
	addHalo,
	addFloor,
} from './addMeshes'
import { addLight, topLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { environment } from './environment'
import { postprocessing } from './postprocessing'
import gsap from 'gsap'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(3.5, 3.5, 5)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
const composer = postprocessing(scene, camera, renderer)

init()
function init() {
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.standard = addStandardMesh()
	meshes.halo = addHalo().mesh
	meshes.floor = addFloor()

	//lights
	lights.defaultLight = addLight()
	lights.roof = topLight()[0]
	lights.roofLight = topLight()[1]
	// lights.halo = addHalo().light
	//changes
	meshes.default.scale.set(2, 2, 2)

	//scene operations
	// scene.add(meshes.halo)
	// scene.add(meshes.default)
	// scene.add(meshes.standard)
	// scene.add(meshes.floor)
	// scene.add(lights.roof)
	scene.add(lights.roofLight)
	// scene.add(lights.halo)
	// scene.add(lights.defaultLight)

	//Env mapping
	// scene.background = environment()
	// scene.environment = environment()
	// scene.backgroundBlurriness = 0.2
	models()
	resize()
	animate()
}

function models() {
	const car = new Model({
		name: 'car',
		scene: scene,
		meshes: meshes,
		url: 'car.glb',
		// position: new THREE.Vector3(0, -2, 0),
	})
	car.init()
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
	const delta = clock.getDelta()

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.z += 0.01

	// meshes.default.scale.x += 0.01

	renderer.render(scene, camera)
}
