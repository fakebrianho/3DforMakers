import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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
const controls = new OrbitControls(camera, renderer.domElement)
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

	setupSongs()
	resize()
	animate()
}

function setupSongs() {
	//We want to queryselect all the elements w/ the songs class so we can loop through and pause them all when we start a new song.
	const songs = document.querySelectorAll('.songs')
	//We then select each song and each button so we can selectively play the correct song
	const song1 = document.querySelector('#sound1')
	const song2 = document.querySelector('#sound2')

	//For each button we then assign the click listener so that when we click the button we then tell the correct song to play. Since we will eventually have more songs and we don't necessarily know which songs if any are playing prior to the button click, we'll loop through our songs variable which is holding all of our songs and pause each song before playing only our selected song.
	const btn1 = document.querySelector('.btn1')
	btn1.addEventListener('click', () => {
		songs.forEach((song) => {
			song.pause()
		})
		song1.play()
	})
	const btn2 = document.querySelector('.btn2')
	btn2.addEventListener('click', () => {
		songs.forEach((song) => {
			song.pause()
		})
		song2.play()
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

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.z += 0.01

	// meshes.default.scale.x += 0.01

	renderer.render(scene, camera)
}
