import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
camera.position.set(0, 0, 5)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const slides = []
let currentSlide = 0
const clock = new THREE.Clock()
// const controls = new OrbitControls(camera, renderer.domElement)

const wheelAdaptor = new WheelAdaptor({ type: 'discrete' })
wheelAdaptor.connect()
wheelAdaptor.addEventListener('trigger', () => {
	//[mesh1, mesh2, mesh3]
	// 0       1 .     2
	if (currentSlide < slides.length - 1) {
		currentSlide++
	} else {
		currentSlide = 0
	}
	gsap.to(camera.position, {
		y: -10,
		duration: 2,
		ease: 'back.inOut',
	})
})
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.standard = addStandardMesh()
	meshes.standard2 = addStandardMesh()
	meshes.standard3 = addStandardMesh()

	//lights
	lights.defaultLight = addLight()

	//changes
	meshes.standard.position.set(0, 0, 0)
	meshes.standard2.position.set(0, -10, 0)
	meshes.standard3.position.set(0, -20, 0)

	//scene operations
	scene.add(meshes.standard)
	scene.add(meshes.standard2)
	scene.add(meshes.standard3)
	slides.push(meshes.standard)
	slides.push(meshes.standard2)
	slides.push(meshes.standard3)
	scene.add(lights.defaultLight)

	resize()
	animate()
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

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.z += 0.01

	// meshes.default.scale.x += 0.01

	renderer.render(scene, camera)
}
