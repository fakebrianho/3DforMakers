import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { WheelAdaptor } from 'three-story-controls'
import gsap from 'gsap'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(0, 0, 50)

//Globals
const meshes = {}
const slides = []
const lights = {}
let currentItem = 0
const clock = new THREE.Clock()
const wheelAdaptor = new WheelAdaptor({ type: 'discrete' })
wheelAdaptor.connect()
wheelAdaptor.addEventListener('trigger', () => {
	if (currentItem < slides.length - 1) {
		currentItem++
	} else {
		currentItem = 0
	}
	gsap.to(camera.position, {
		y: currentItem * -10,
		duration: 2,
		ease: 'back.inOut',
	})
})
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	meshes.standard = addStandardMesh()
	meshes.standard.position.set(0, 0, 0)
	meshes.s2 = addStandardMesh()
	meshes.s2.position.set(0, -20, 0)
	meshes.s3 = addStandardMesh()
	meshes.s3.position.set(0, -10, 0)

	//lights
	lights.defaultLight = addLight()

	//changes
	scene.add(lights.defaultLight)

	models()
	resize()
	animate()
}

function addSlides(mesh) {
	slides.push(mesh)
}

function models() {
	const sword = new Model({
		name: 'sword',
		url: 'sword.glb',
		meshes: meshes,
		scene: scene,
		replace: true,
		rotation: new THREE.Vector3(Math.PI / 2, -Math.PI / 4, Math.PI / 4),
		position: new THREE.Vector3(0, -10, 0),
		scale: new THREE.Vector3(3, 3, 3),
		callback: addSlides,
	})
	const shield = new Model({
		name: 'shield',
		url: 'shield.glb',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(0.005, 0.005, 0.005),
		rotation: new THREE.Vector3(0, -Math.PI / 4, 0),
		position: new THREE.Vector3(0, 0, 0),
		replace: true,
		callback: addSlides,
	})
	const flowers = new Model({
		name: 'flower',
		url: 'flowers.glb',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(3.5, 3.5, 3.5),
		position: new THREE.Vector3(-0.2, -21.5, 0),
		replace: true,
		callback: addSlides,
	})
	shield.init()
	sword.init()
	flowers.init()
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

	renderer.render(scene, camera)
}
