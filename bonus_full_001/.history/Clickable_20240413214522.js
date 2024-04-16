import {
	MeshBasicMaterial,
	PointLight,
	SphereGeometry,
	Mesh,
	Vector3,
} from 'three'

export default class Clickable {
	constructor(props) {
		this.intensity = 0
		this.scene = props.scene
		this.lights = props.lights
		this.position = props.position || new Vector3(0, 0, 0)
		this.name = props.name
		this.count = props.count
		this.container = props.container
		this.lookPosition = props.lookPosition || new Vector3(0, 0, 0)
		this.lookRotation = props.lookRotation || new Vector3(0, 0, 0)
	}
	init() {
		const light = new PointLight(0xffffff, this.intensity)
		const lightMesh = new Mesh(
			new SphereGeometry(0.1, 16, 8),
			new MeshBasicMaterial({
				color: 0xffffff,
				// opacity: 0,
				// transparent: true,
			})
		)
		light.add(lightMesh)
		light.position.set(this.position.x, this.position.y, this.position.z)
		light.userData.lookAt = this.lookPosition
		light.userData.rotateAt = this.lookRotation
		light.userData.active = false
		this.container.push(light)
		this.lights[`${this.name}`] = light
		// this.scene.add(this.lights[`${this.name}`])
		this.scene.add(light)
	}
}
