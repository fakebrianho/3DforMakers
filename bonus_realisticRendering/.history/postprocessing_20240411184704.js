import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass'

export function postprocessing(scene, camera, renderer, layers) {
	const composer = new EffectComposer(renderer)
	composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	composer.setSize(window.innerWidth, window.innerHeight)

	const renderPass = new RenderPass(scene, camera)
	composer.addPass(renderPass)

	const pixelPass = new RenderPixelatedPass(6, scene, camera)
	pixelPass.pixelSize = 5
	pixelPass.normalEdgeStrength = 2
	// composer.addPass(pixelPass)

	const glitchPass = new GlitchPass()
	glitchPass.enabled = false
	composer.addPass(glitchPass)

	const AfterImagePass = new AfterimagePass()
	AfterImagePass.uniforms.damp.value = 0.96
	AfterImagePass.damp = 0
	composer.addPass(AfterImagePass)

	const bloomPass = new UnrealBloomPass()
	bloomPass.strength = 0.1
	// bloomPass.layers = layers // Apply bloom only to our bloomLayer
	composer.addPass(bloomPass)

	const outputPass = new OutputPass()
	composer.addPass(outputPass)

	// return composer
	return { composer: composer, bloom: bloomPass }
}
