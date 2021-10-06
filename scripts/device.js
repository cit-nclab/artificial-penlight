import { MODeviceData } from './devicedata.js'

const getJSON = async (path) => {
  const response = await fetch(path)
  return await response.json()
}

const deviceName = 'Artificial_Light'
const serviceUUIDList = await getJSON('./json/uuid.json')

class MODevice {
  constructor() {
  }

  async _fetchService() {
    const options = {
      filters: [
        { namePrefix: deviceName },
        { services: serviceUUIDList }
      ]
    }

    this._device = await navigator.bluetooth.requestDevice(options)
    const server = await this._device.gatt.connect()
    const services = await server.getPrimaryServices()
    return services[0]
  }

  async _fetchCharacteristic(service) {
    const characteristics = await service.getCharacteristics()
    return characteristics[0]
  }

  _handler(event) {
    const value = event.target.value
    const string = new TextDecoder().decode(value)
    const json = JSON.parse(string)
    console.log(json)
    const data = {
      x: json.a.x,
      z: json.a.z,
      pitch: json.pitch,
      roll: json.roil,
      heading: json.heading,
      color: json.colorStatus
    }
    this.data.append(data)
  }

  async connect() {
    try {
      const service = await this._fetchService()
      const characteristic = await this._fetchCharacteristic(service)
      const deviceNumber = serviceUUIDList.indexOf(service.uuid) + 1
      this.data = new MODeviceData(deviceNumber)
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