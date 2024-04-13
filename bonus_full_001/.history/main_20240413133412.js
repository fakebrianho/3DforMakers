import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight, addSpotLights } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { postprocessing } from './postprocessing'
import Clickable from './Clickable'
import gsap from 'gsap'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	50,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(-19, 10, 11)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const hoverable = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)

//tree
//-12.076, 2.803, 2.403 / r: -17.83, 37.35, 11.04

//cafe
//-3.114, 3.547, -1.379 / r: -28.96, -56.67, -24.81

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

	addInteraction()
	raycasting()
	flickerLight()
	models()
	resize()
	animate()
}

function addInteraction() {
	const treeTag = new Clickable({
		intensity: 0,
		scene: scene,
		lights: lights,
		name: 'treeTag',
		position: new THREE.Vector3(-7.937, 2.669, -2.561),
		lookPosition: new THREE.Vector3(-12.076, 2.803, 2.403),
	})
	treeTag.init()
}

function moveTarget({ x, y, z }) {
	gsap.to(controls.target, {
		x: x,
		y: y,
		z: z,
		duration: 2,
		ease: 'power3.inOut',
	})
}

function moveCamera({ x, y, z }) {
	console.log(x, y, z)
	gsap.to(camera.position, {
		x: x,
		y: y,
		z: z,
		duration: 2,
		ease: 'power3.inOut',
	})
}

function raycasting() {
	window.addEventListener('click', (event) => {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(pointer, camera)
		const intersects = raycaster.intersectObjects(scene.children, true)
		for (let i = 0; i < intersects.length; i++) {
			const object = intersects[0].object.parent
			console.log(object)
			object.intensity = 0.5
			const targetPosition = object.position
			const cameraPosition = object.lookPosition
			// moveTarget({ ...targetPosition })
			// moveCamera({ ...cameraPosition })
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
	renderer.domElement.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		composer.setSize(width, height)
	})
}

function animate() {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()
	// console.log(hoverable)
	// composer.outline.selectedObjets
	if (hoverable.length > 0) {
		// composer.outline.selectedObjects = [hoverable[0]]
	}

	// meshes.default.scale.x += 0.01

	// renderer.render(scene, camera)
	composer.composer.render()
}
