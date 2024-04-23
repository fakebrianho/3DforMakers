import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { addTunnel } from './addMeshes'
import Lenis from '@studio-freight/lenis'
import VirtualScroll from '@studio-freight/lenis'

let vt
console.log(vt)

var container = document.getElementById('smooth-wrapper')
let lenis
// var wrapper = document.querySelector('canvas')
// const lenis = new Lenis({
// 	wrapper: container,
// 	content: document.querySelector('canvas'),
// 	duration: 1.2,
// 	easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
// 	direction: 'vertical', // vertical, horizontal
// 	gestureDirection: 'vertical', // vertical, horizontal, both
// 	smooth: true,
// 	mouseMultiplier: 1,
// 	smoothTouch: false,
// 	touchMultiplier: 2,
// 	infinite: false,
// })

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	40
)
// camera.position.set(0, 0, 0)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
// const controls = new OrbitControls(camera, renderer.domElement)
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	container.appendChild(renderer.domElement)
	const elem = document.querySelector('canvas')
	// vt = new VirtualScroll(elem)
	// vt.virtualScroll((e) => {
	// 	console.log(e)
	// })
	// vt.onWheel((e) => {
	// 	console.log(e)
	// })
	// console.log(vt.virtualScroll.onWheel)
	lenis = new Lenis({
		wrapper: container,
		content: document.querySelector('canvas'),
		duration: 1.2,
		easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
		direction: 'vertical', // vertical, horizontal
		gestureDirection: 'vertical', // vertical, horizontal, both
		smooth: true,
		mouseMultiplier: 1,
		smoothTouch: false,
		touchMultiplier: 2,
		infinite: false,
	})
	// lenis.on('scroll', (e) => {
	// 	console.log(e)
	// })

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.standard = addStandardMesh()
	meshes.tunnel1 = addTunnel({ position: new THREE.Vector3(0, 0, -3) })

	//lights
	lights.defaultLight = addLight()

	//changes
	meshes.default.scale.set(2, 2, 2)

	//scene operations
	// scene.add(meshes.default)
	// scene.add(meshes.standard)
	scene.add(meshes.tunnel1)
	scene.add(lights.defaultLight)

	handleScroll()
	createTunnels(8)
	resize()
	// animate()
}

function createTunnels(numTunnels) {
	for (let i = 1; i <= numTunnels; i++) {
		meshes[`tunnel${i}`] = addTunnel({
			position: new THREE.Vector3(0, 0, -i * 10),
		})
		scene.add(meshes[`tunnel${i}`])
	}
	//
}

function handleScroll(event) {
	window.addEventListener('scroll', (event) => {
		console.log(event)
		// console.log(lenis)
		// const scrollDelta = event.deltaY || event.wheelDelta
		// virtualScrollPosition += scrollDelta * 0.01 // Adjust the scroll speed as needed
		// virtualScrollPosition = Math.max(
		// 	0,
		// 	Math.min(virtualScrollPosition, maxScrollPosition)
		// )
		// const progress = virtualScrollPosition / maxScrollPosition
		// const time = progress * totalDuration
		// timeline.seek(time)
		// debug.innerHTML = progress
	})
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

// function animate() {
// 	requestAnimationFrame(animate)
// 	const delta = clock.getDelta()

// 	// meshes.default.rotation.x += 0.01
// 	// meshes.default.rotation.z += 0.01

// 	// meshes.standard.rotation.x += 0.01
// 	// meshes.standard.rotation.z += 0.01

// 	if (lenis) {
// 		// const scrollProgress =
// 		// lenis.scroll.instance.scroll.y /
// 		// (lenis.scroll.instance.limit.y - window.innerHeight)
// 		console.log(lenis.scroll.instance)
// 	}

// 	// Update camera position based on scroll progress
// 	// camera.position.z = scrollProgress * -0.4
// 	// meshes.default.scale.x += 0.01
// 	lenis.raf()

// 	renderer.render(scene, camera)
// }

function raf(time) {
	lenis.raf(time)
	console.log(lenis)
	renderer.render(scene, camera)

	requestAnimationFrame(raf)
}

requestAnimationFrame(raf)
