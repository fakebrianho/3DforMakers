import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Lenis from '@studio-freight/lenis'
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
const clock = new THREE.Clock()
const timeline = gsap.timeline({ paused: true })
const scrollSpeed = 0.01
let maxScrollPosition = 600
const totalDuration = maxScrollPosition / scrollSpeed // Total duration of the timeline in seconds
let virtualScrollPosition = 0
let loadedFlag = false
const debug = document.querySelector('.scrollPosition')

init()

function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.standard = addStandardMesh()

	//lights
	lights.defaultLight = addLight()

	//changes
	meshes.default.scale.set(2, 2, 2)

	//scene operations
	scene.add(meshes.default)
	scene.add(meshes.standard)
	scene.add(lights.defaultLight)

	initTimeline()
	models()
	handleScroll()
	resize()
	animate()
}

function models() {
	const flower = new Model({
		name: 'flower',
		url: 'flowers.glb',
		replace: true,
		scene: scene,
		meshes: meshes,
	})
	flower.init()
}

function initTimeline() {
	timeline.to(
		meshes.default.position,
		{ duration: totalDuration * 0.3, x: -2 },
		0.3 * totalDuration
	)
	timeline.to(
		'#animation1',
		{ duration: totalDuration * 0.08, opacity: 1 },
		0.3 * totalDuration
	)
	timeline.to(
		'#animation1',
		{ duration: totalDuration * 0.08, opacity: 0 },
		0.52 * totalDuration
	)
	timeline.to(
		'#animation2',
		{ duration: totalDuration * 0.08, opacity: 1 },
		0.7 * totalDuration
	)
	timeline.to(
		meshes.standard.position,
		{ duration: totalDuration * 0.3, x: 2 },
		0.7 * totalDuration
	)
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function handleScroll(event) {
	window.addEventListener('wheel', (event) => {
		const scrollDelta = event.deltaY || event.wheelDelta
		virtualScrollPosition += scrollDelta * 0.01 // Adjust the scroll speed as needed
		virtualScrollPosition = Math.max(
			0,
			Math.min(virtualScrollPosition, maxScrollPosition)
		)

		const progress = virtualScrollPosition / maxScrollPosition
		const time = progress * totalDuration
		timeline.seek(time)
		debug.innerHTML = progress
	})
}

function animate() {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()
	while (!loadedFlag) {
		console.log('not loaded yet!')
		if (meshes.flower) {
			loadedFlag = true
			console.log('loaded!')
		}
	}

	renderer.render(scene, camera)
}
