import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight, addSpotLights } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { postprocessing } from './postprocessing'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	50,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(-19, 7, 11)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const hoverable = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)

//Raycaster
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

let composer

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes

	//lights
	lights.defaultLight = addLight()
	lights.light1 = addSpotLights().light1
	lights.target1 = addSpotLights().target1
	lights.light2 = addSpotLights().light2
	lights.target2 = addSpotLights().target2
	lights.light3 = addSpotLights().light3
	lights.target3 = addSpotLights().target3

	//changes

	//scene operations
	scene.add(lights.defaultLight)
	scene.add(lights.light1)
	scene.add(lights.target1)
	scene.add(lights.light2)
	scene.add(lights.target2)
	scene.add(lights.light3)
	scene.add(lights.target3)

	raycasting()
	flickerLight()
	models()
	resize()
	animate()
}

function raycasting() {
	window.addEventListener('click', (event) => {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(pointer, camera)
		const intersects = raycaster.intersectObjects(scene.children, true)
		for (let i = 0; i < intersects.length; i++) {
			console.log(intersects)
		}
	})
}

function models() {
	const city = new Model({
		name: 'city',
		url: 'city.glb',
		meshes: meshes,
		scene: scene,
		hoverable: hoverable,
	})
	city.init()
	composer = postprocessing(scene, camera, renderer, hoverable)
}

function flickerLight() {
	const rng = Math.random()
	lights.light2.intensity = rng * 5
	const nextFlickerIn = 100 + Math.random() * 200 // Random delay between 100ms and 500ms

	// Schedule the next flicker
	setTimeout(flickerLight, nextFlickerIn)
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
	// console.log(hoverable)
	// composer.outline.selectedObjets
	composer.outline.selectedObjects = [hoverable[0]]

	// meshes.default.scale.x += 0.01

	// renderer.render(scene, camera)
	composer.composer.render()
}
