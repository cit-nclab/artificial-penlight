import { MODevice } from './device.js'
import { MOServer } from './server.js'
import { MODeviceCanvas } from './devicecanvas.js'

let sendTimer
const sendStateToServer = (uuid, color, state) => {
  if(state === 0) return
  server.send(`${uuid}_${color}_${state}`)
}

const server = new MOServer()
const device = new MODevice()
const connectDeviceButton = document.getElementById('button-device')
connectDeviceButton.addEventListener('click', async () => {
  if(await device.connect()) {
    device.data.addEventListener('statechange', (event) => {
      clearInterval(sendTimer)
      sendTimer = setInterval(sendStateToServer, 500, event.uuid, event.color, event.state)
    })

    server.connect()
    server.addEventListener('message', (event) => {
      console.log(event.data)
    })

    const canvas = document.getElementById('canvas-device')
    const deviceCanvas = new MODeviceCanvas(canvas)
    device.data.addEventListener('datachange', (event) => {
      const indicatorX = document.getElementById('indicator_x')
      indicatorX.style.width = Math.min(event.x / device.data._thresholdX, 1) * 100 + '%'
      const indicatorZ = document.getElementById('indicator_z')
      indicatorZ.style.width = Math.min(event.z / device.data._thresholdZ, 1) * 100 + '%'

      deviceCanvas.rotateModel(event.pitch, 0, 90 - event.roll)
    })

    const dialog = document.getElementById('dialog-device')
    dialog.classList.remove('dialog--open')
  }
})

window.addEventListener('beforeunload', () => {
  device.disconnect()
})