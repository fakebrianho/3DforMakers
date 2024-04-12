import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'

import {
	Color,
	AnimationMixer,
	PointsMaterial,
	Points,
	MeshMatcapMaterial,
	TextureLoader,
	Vector3,
	BufferGeometry,
	Float32BufferAttribute,
	AdditiveBlending,
	MeshBasicMaterial,
	MeshPhysicalMaterial,
	Group,
	Mesh,
	Vector2,
} from 'three'

export default class Model {
	constructor(obj) {
		this.name = obj.name
		this.meshes = obj.meshes
		this.file = obj.url
		this.scene = obj.scene
		this.loader = new GLTFLoader()
		this.dracoLoader = new DRACOLoader()
		this.dracoLoader.setDecoderPath('./draco/')
		this.loader.setDRACOLoader(this.dracoLoader)
		this.textureLoader = new TextureLoader()
		this.animations = obj.animationState || false
		this.replaceMaterials = obj.replace || false
		this.defaultMatcap = obj.replaceURL
			? this.textureLoader.load(`${obj.replaceURL}`)
			: this.textureLoader.load('/mat.png')
		this.mixer = null
		this.mixers = obj.mixers
		this.defaultParticle = obj.particleURL
			? this.textureLoader.load(`${obj.particleURL}`)
			: this.textureLoader.load('/10.png')
		this.scale = obj.scale || new Vector3(1, 1, 1)
		this.position = obj.position || new Vector3(0, 0, 0)
		this.rotation = obj.rotation || new Vector3(0, 0, 0)
		this.palette = [
			new Color('#FAAD80'),
			new Color('#FF6767'),
			new Color('#FF3D68'),
			new Color('#A73489'),
		]
	}
	init() {
		this.loader.load(this.file, (gltf) => {
			this.mesh = gltf.scene.children[0]
			if (this.replaceMaterials) {
				const replacementMaterial = new MeshMatcapMaterial({
					matcap: this.defaultMatcap,
				})
				gltf.scene.traverse((child) => {
					if (child.isMesh) {
						child.material = replacementMaterial
					}
				})
			}
			gltf.scene.traverse((child) => {
				if (child.isMesh && child.material.isMeshStandardMaterial) {
					child.material.envMapIntensity = 3
				}
				if (child.name == 'ap_triumph_spitfire_0') {
					const replacementMaterial = new MeshMatcapMaterial({
						matcap: this.defaultMatcap,
					})
					const material = new MeshPhysicalMaterial({
						color: 0xaaaaaa, // A light gray color
						metalness: 0.35, // High metalness value for a metallic appearance
						roughness: 0.05, // Low roughness value for a shiny/reflective surface
						reflectivity: 1.0, // High reflectivity value for strong reflections
						clearcoat: 1.0, // Add a clear coat layer for extra shine
						clearcoatRoughness: 0.05, // Low clear coat roughness for a smooth clear coat
						normalScale: new Vector2(0.2, 0.2), // Adjust the normal map intensity (optional)
					})
					let target = child.children[2].material
					// console.log(child.children[0])
					// child.children[2].material.metalness = 0.9
					// child.children[2].material.roughness = 0.0
					// target.color = new Color(0xff0000)
					// target.metalnessMap = null
					// target.roughnessMap = null
					// console.log(child.children)

					child.children[2].material = material
					// child[0]
				}
				// console.log(child.name)
			})
			if (this.animations) {
				this.mixer = new AnimationMixer(gltf.scene)
				gltf.animations.forEach((clip) => {
					this.mixer.clipAction(clip).play()
				})
				this.mixers.push(this.mixer)
			}
			this.meshes[`${this.name}`] = gltf.scene
			this.meshes[`${this.name}`].position.set(
				this.position.x,
				this.position.y,
				this.position.z
			)
			this.meshes[`${this.name}`].scale.set(
				this.scale.x,
				this.scale.y,
				this.scale.z
			)
			this.meshes[`${this.name}`].rotation.set(
				this.rotation.x,
				this.rotation.y,
				this.rotation.z
			)
			this.meshes[`${this.name}`].userData.groupName = this.name
			this.scene.add(this.meshes[`${this.name}`])
		})
	}
	initPoints() {
		this.loader.load(this.file, (gltf) => {
			const meshes = []
			const pointCloud = new Group()
			gltf.scene.traverse((child) => {
				if (child.isMesh) {
					meshes.push(child)
				}
			})
			for (const mesh of meshes) {
				pointCloud.add(this.createPoints(mesh))
			}
			console.log(pointCloud)
			this.meshes[`${this.name}`] = pointCloud
			this.meshes[`${this.name}`].scale.set(
				this.scale.x,
				this.scale.y,
				this.scale.z
			)
			this.meshes[`${this.name}`].position.set(
				this.position.x,
				this.position.y,
				this.position.z
			)
			this.meshes[`${this.name}`].rotation.set(
				this.rotation.x,
				this.rotation.y,
				this.rotation.z
			)
			this.scene.add(this.meshes[`${this.name}`])
		})
	}
	createPoints(_mesh) {
		const sampler = new MeshSurfaceSampler(_mesh).build()
		const numParticles = 3000
		const particlesPosition = new Float32Array(numParticles * 3)
		const particleColors = new Float32Array(numParticles * 3)
		const newPosition = new Vector3()
		for (let i = 0; i < numParticles; i++) {
			sampler.sample(newPosition)
			const color =
				this.palette[Math.floor(Math.random() * this.palette.length)]
			particleColors.set([color.r, color.g, color.b], i * 3)
			particlesPosition.set(
				[newPosition.x, newPosition.y, newPosition.z],
				i * 3
			)
		}
		const pointsGeometry = new BufferGeometry()
		pointsGeometry.setAttribute(
			'position',
			new Float32BufferAttribute(particlesPosition, 3)
		)
		pointsGeometry.setAttribute(
			'color',
			new Float32BufferAttribute(particleColors, 3)
		)
		const pointsMaterial = new PointsMaterial({
			vertexColors: true,
			transparent: true,
			alphaMap: this.defaultParticle,
			alphaTest: 0.001,
			depthWrite: false,
			blending: AdditiveBlending,
			size: 0.12,
		})
		const points = new Points(pointsGeometry, pointsMaterial)
		return points
	}
}
