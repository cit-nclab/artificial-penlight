import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js'
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js'

class MODeviceCanvas {
  constructor(canvas) {
    this._renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true
    })
    this._scene = new THREE.Scene()
    this._camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20)
    this._camera.position.z = 10

    const light = new THREE.AmbientLight()
    this._scene.add(light)

    const loader = new GLTFLoader()
    loader.load('models/device.glb', (gltf) => {
      this._model = gltf.scene
      this._scene.add(this._model)
    })

    this._onResize(window.innerWidth, window.innerHeight)
    window.addEventListener('resize', () => this._onResize(window.innerWidth, window.innerHeight))
    this._tick()
  }

  _onResize(width, height) {
    this._renderer.setSize(width, height)

    this._camera.aspect = width / height
    this._camera.updateProjectionMatrix()
  }

  _tick() {
    requestAnimationFrame(() => { this._tick() })
    this._renderer.render(this._scene, this._camera)
  }

  rotateModel(x, y, z) {
    console.log(x, y, z)

    const radX = THREE.MathUtils.degToRad(x)
    const radY = THREE.MathUtils.degToRad(y)
    const radZ = THREE.MathUtils.degToRad(z)
    this._model.rotation.set(radX, radY, radZ)
  }
}

export { MODeviceCanvas }
