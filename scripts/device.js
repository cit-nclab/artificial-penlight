import { MODeviceData } from './devicedata.js'

const getJSON = async (path) => {
  const response = await fetch(path)
  return await response.json()
}

const deviceName = 'Artificial_Light'
const serviceUUIDList = await getJSON('./json/uuid.json')

class MODevice {
  constructor() {
    this.data = new MODeviceData()
  }

  async _fetchCharacteristic() {
    const options = {
      filters: [
        { namePrefix: deviceName },
        { services: serviceUUIDList }
      ]
    }

    this._device = await navigator.bluetooth.requestDevice(options)
    const server = await this._device.gatt.connect()
    const services = await server.getPrimaryServices()
    const characteristics = await services[0].getCharacteristics()
    return characteristics[0]
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