import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect'
import { Vector2 } from 'three'

export function postprocessing(scene, camera, renderer, mesh) {
	const composer = new EffectComposer(renderer)
	composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	composer.setSize(window.innerWidth, window.innerHeight)

	// const asciiEffect = new AsciiEffect(renderer)
	// asciiEffect.setSize(window.innerWidth, window.innerHeight)
	// const asciiPass = new ShaderPass({
	// 	uniforms: asciiEffect.uniforms,
	// 	vertexShader: asciiEffect.vertexShader,
	// 	fragmentShader: asciiEffect.fragmentShader,
	// })
	// asciiPass.enabled = true
	// composer.addPass(asciiPass)

	const effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true })
	effect.setSize(window.innerWidth, window.innerHeight)
	effect.domElement.style.color = 'white'
	effect.domElement.style.backgroundColor = 'black'
	composer.addPass(effect)

	const renderPass = new RenderPass(scene, camera)
	composer.addPass(renderPass)

	const pixelPass = new RenderPixelatedPass(6, scene, camera)
	pixelPass.pixelSize = 3
	pixelPass.normalEdgeStrength = 12
	composer.addPass(pixelPass)

	const outlinePass = new OutlinePass(
		new Vector2(window.innerWidth, window.innerHeight),
		scene,
		camera
	)
	// outlinePass.selectedObjects = [mesh]
	// composer.addPass(outlinePass)

	const glitchPass = new GlitchPass()
	glitchPass.enabled = true
	// composer.addPass(glitchPass)

	const afterPass = new AfterimagePass()
	afterPass.uniforms.damp.value = 0.98
	afterPass.damp = 0
	// composer.addPass(afterPass)

	const bloomPass = new UnrealBloomPass()
	bloomPass.strength = 0.2
	composer.addPass(bloomPass)

	const outputPass = new OutputPass()
	composer.addPass(outputPass)

	return { composer: composer, glitch: glitchPass, outline: outlinePass }
}
