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
// controls.enableRotate = false
const interactables = []
const defaultPosition = new THREE.Vector3(-19, 10, 11)

//tree
//-10.493, 2.739, 1.476 / r: -18.52, -9.41,-3.10

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
	turnOffLights()
	animate()
}

function addInteraction() {
	const treeTag = new Clickable({
		intensity: 0,
		scene: scene,
		lights: lights,
		name: 'treeTag',
		position: new THREE.Vector3(-7.937, 2.669, -2.561),
		lookPosition: new THREE.Vector3(-10, 2.0, 1.476),
		container: interactables,
	})
	treeTag.init()
	const cafeTag = new Clickable({
		intensity: 0,
		scene: scene,
		lights: lights,
		name: 'cafeTag',
		position: new THREE.Vector3(1.179, 3.514, -2.715),
		lookPosition: new THREE.Vector3(-3.114, 3.547, -1.379),
		container: interactables,
	})
	cafeTag.init()
	const constructionTag = new Clickable({
		intensity: 0,
		scene: scene,
		lights: lights,
		name: 'constructionTag',
		position: new THREE.Vector3(4.502, 1.083, 0.119),
		lookPosition: new THREE.Vector3(2.991, 1.891, 3.411),
		container: interactables,
	})
	constructionTag.init()
	const plantTag = new Clickable({
		intensity: 0,
		scene: scene,
		lights: lights,
		name: 'plantTag',
		position: new THREE.Vector3(8.043, 1.634, -2.045),
		lookPosition: new THREE.Vector3(9.401, 1.384, 0.52),
		container: interactables,
	})
	plantTag.init()
	const carTag = new Clickable({
		intensity: 0,
		scene: scene,
		lights: lights,
		name: 'carTag',
		position: new THREE.Vector3(7.322, 1.995, 6.458),
		lookPosition: new THREE.Vector3(7.396, 2.601, 0.837),
		container: interactables,
	})
	carTag.init()
	const pipeTag = new Clickable({
		intensity: 0,
		scene: scene,
		lights: lights,
		name: 'pipeTag',
		position: new THREE.Vector3(-2.169, 1.334, 2.496),
		lookPosition: new THREE.Vector3(-3.789, 2.932, -3.621),
		container: interactables,
	})
	pipeTag.init()
	const dumpsterTag = new Clickable({
		intensity: 0,
		scene: scene,
		lights: lights,
		name: 'dumpsterTag',
		position: new THREE.Vector3(-9.094, 2.708, 7.736),
		lookPosition: new THREE.Vector3(-4.058, 3.664, 10.542),
		container: interactables,
	})
	dumpsterTag.init()
}

function moveTarget({ x, y, z }) {
	gsap.to(controls.target, {
		x: x,
		y: y - 1.0,
		z: z,
		duration: 2,
		ease: 'power3.inOut',
		onUpdate: () => {
			controls.update()
		},
	})
}

function moveCamera(position) {
	gsap.to(camera.position, {
		x: position.x,
		y: position.y,
		z: position.z,
		duration: 2,
		ease: 'power3.inOut',
	})
}

function raycasting() {
	window.addEventListener('click', (event) => {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(pointer, camera)
		const intersects = raycaster.intersectObjects(interactables, true)
		for (let i = 0; i < intersects.length; i++) {
			const object = intersects[0].object.parent
			if (!object.userData.active) {
				object.intensity = 1
				object.userData.active = true
				const targetPosition = object.position
				const cameraPosition = object.userData.lookAt
				moveTarget({ ...targetPosition })
				moveCamera(cameraPosition)
			} else {
				object.userData.active = false
				object.intensity = 0.0
				moveTarget({ x: 0, y: 0, z: 0 })
				moveCamera({ ...defaultPosition })
			}
		}
	})
}

function turnOffLights() {
	for (let i = 0; i < interactables.length; i++) {
		console.log(interactables[i])
		interactables[i].userData.active = false
		interactables[i].intensity = 0
	}
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

	// meshes.default.scale.x += 0.01

	// renderer.render(scene, camera)
	composer.composer.render()
}
