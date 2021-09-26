import { MODeviceData } from './devicedata.js'

const serviceUUID = 'd5875408-fa51-4763-a75d-7d33cecebc31'
const characteristicUUID = 'a4f01d8c-a037-43b6-9050-1876a8c23584'
const deviceName = 'Artificial_Light'

class MODevice {
  constructor() {
    this.data = new MODeviceData()
  }

  async _fetchCharacteristic() {
    const options = {
      filters: [{ name: deviceName }],
      optionalServices: [serviceUUID]
    }

    this._device = await navigator.bluetooth.requestDevice(options)
    const server = await this._device.gatt.connect()
    const service = await server.getPrimaryService(serviceUUID)
    return await service.getCharacteristic(characteristicUUID)
  }

  _handler(event) {
    const value = event.target.value
    const string = new TextDecoder().decode(value)
    const json = JSON.parse(string)
    const data = {
      x: json.a.x,
      z: json.a.z,
      pitch: json.pitch,
      roll: json.roil,
      heading: json.heading
    }
    this.data.append(data)
  }

  async connect() {
    try {
      const characteristic = await this._fetchCharacteristic()
      characteristic.addEventListener('characteristicvaluechanged', (event) => { this._handler(event) })
      characteristic.startNotifications()
      return true
    } catch(error) {
      console.error(error)
      return false
    }
  }

  disconnect() {
    this._device.gatt.disconnect()
  }
}

export { MODevice }