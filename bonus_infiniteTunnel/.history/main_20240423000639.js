import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { addTunnel } from './addMeshes'
import gsap from 'gsap'

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
camera.position.set(0, 0, -85)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const timeline = gsap.timeline({ paused: true })
const scrollSpeed = 0.01
let maxScrollPosition = 600
const totalDuration = maxScrollPosition / scrollSpeed // Total duration of the timeline in seconds
let virtualScrollPosition = 0
let loadedFlag = false
const debug = document.querySelector('.scrollPosition')
const tunnelContainer = []

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	const content = document.getElementById('smooth-content')
	content.appendChild(renderer.domElement)

	const elem = document.querySelector('canvas')

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
	animate()
}

function createTunnels(numTunnels) {
	for (let i = 1; i <= numTunnels; i++) {
		meshes[`tunnel${i}`] = addTunnel({
			position: new THREE.Vector3(0, 0, -i * 10),
		})
		console.log(-i * 10)
		tunnelContainer.push(meshes[`tunnel${i}`])
		scene.add(meshes[`tunnel${i}`])
	}
	//
}
// let total = 8 * 13
// console.log(total)

function handleScroll(event) {
	window.addEventListener('wheel', (event) => {
		const scrollDelta = Math.abs(event.deltaY) || event.wheelDelta
		virtualScrollPosition += scrollDelta * 0.01 // Adjust the scroll speed as needed
		virtualScrollPosition = Math.max(
			0,
			Math.min(virtualScrollPosition, maxScrollPosition)
		)

		camera.position.z -= virtualScrollPosition * 0.01
		tunnelContainer.map((tunnel) => {
			if (tunnel.position.z > camera.position.z) {
				// tunnel.position =
			}
		})

		const progress = virtualScrollPosition / maxScrollPosition
		const time = progress * totalDuration
		timeline.seek(time)
		debug.innerHTML = progress
	})
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

	renderer.render(scene, camera)
}
