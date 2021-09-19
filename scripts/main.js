import { MODevice } from './device.js'
import { MOServer } from './server.js'
import { MODeviceCanvas } from './devicecanvas.js'

let sendTimer
const sendStateToServer = (state) => {
  if(state === 0) return
  server.send(state)

  const el = document.getElementById('state')
  el.classList.remove('debug__value--refresh')
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      el.classList.add('debug__value--refresh')
    })
  })
  el.innerHTML = state
}

const server = new MOServer()
const device = new MODevice()
const connectDeviceButton = document.getElementById('button-device')
connectDeviceButton.addEventListener('click', async () => {
  if(await device.connect()) {
    server.connect()

    server.addEventListener('message', (event) => {
      const el = document.getElementById('data-server')
      el.innerHTML = event.data
    })

    const canvas = document.getElementById('canvas-device')
    const deviceCanvas = new MODeviceCanvas(canvas)

    device.data.addEventListener('statechange', (event) => {
      clearInterval(sendTimer)
      sendTimer = setInterval(sendStateToServer, 3000, event.state)
    })

    device.data.addEventListener('datachange', (event) => {
      const el = document.getElementById('data-device')
      el.innerHTML = `${event.x}, ${event.z}`
      deviceCanvas.rotateModel(event.pitch, 0, 90 - event.roll)
    })

    const dialog = document.getElementById('dialog-device')
    dialog.classList.remove('dialog--open')
  }
})

window.addEventListener('beforeunload', () => {
  device.disconnect()
})