import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { addTunnel } from './addMeshes'
import gsap from 'gsap'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	40
)
// camera.position.set(0, 0, -79)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const timeline = gsap.timeline({ paused: true })
const scrollSpeed = 0.01
let maxScrollPosition = 600
let count = 8
let totalScrollPosition = count * 10
const totalDuration = maxScrollPosition / scrollSpeed // Total duration of the timeline in seconds
let virtualScrollPosition = 0
let loadedFlag = false
const debug = document.querySelector('.scrollPosition')
const debug2 = document.querySelector('.scrollPosition')
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
	createTunnels(count)
	resize()
	animate()
}

function createTunnels(numTunnels) {
	for (let i = 1; i <= numTunnels; i++) {
		meshes[`tunnel${i}`] = addTunnel({
			position: new THREE.Vector3(0, 0, -i * 10),
		})
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

		totalScrollPosition += virtualScrollPosition * 0.01
		camera.position.z -= virtualScrollPosition * 0.01
		tunnelContainer.map((tunnel) => {
			if (tunnel.position.z > camera.position.z) {
				// tunnel.position =
			}
		})

		const progress = virtualScrollPosition / maxScrollPosition
		const time = progress * totalDuration
		timeline.seek(time)
		debug2.innerHTML = totalScrollPosition
		debug.innerHTML = camera.position.z
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
