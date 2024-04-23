import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { addTunnel } from './addMeshes'
import Lenis from '@studio-freight/lenis'

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
	document.body.appendChild(renderer.domElement)

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
		scene.add(meshes[`tunnel${i}`])
	}
	//
}

function handleScroll(event) {
	window.addEventListener('wheel', (event) => {
		console.log(event)
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

function animate() {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()

	// meshes.default.rotation.x += 0.01
	// meshes.default.rotation.z += 0.01

	// meshes.standard.rotation.x += 0.01
	// meshes.standard.rotation.z += 0.01

	// meshes.default.scale.x += 0.01

	renderer.render(scene, camera)
}
