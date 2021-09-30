class MODeviceData extends EventTarget {
  constructor(uuid) {
    super()
    this._length = 50
    const initArray = new Array(this._length).fill(0)
    this._xArray = [...initArray]
    this._zArray = [...initArray]
    this._dataChangeEvent = new CustomEvent('datachange')
    this._stateChangeEvent = new CustomEvent('statechange')
    this._stateChangeEvent.uuid = uuid
    this._thresholdX = 15000
    this._thresholdZ = 20000
  }

  _appendToArray(array, value) {
    array.shift()
    array.push(Math.abs(value))
  }

  _sumArray(array) {
    return array.reduce((sum, current) => {
      return sum + current
    })
  }

  _averageArray(array) {
    return this._sumArray(array) / array.length
  }

  _varianceArray(array) {
    const average = this._averageArray(array)
    return array.reduce((sum, current) => {
      return sum + Math.round((current - average) ** 2)
    })
  }

  _updateState(x, z) {
    if (x > this._thresholdX) {
      this._changeState(1)
      return
    }

    if (z > this._thresholdZ) {
      this._changeState(2)
      return
    }

    this._changeState(0)
  }

  _changeState(state) {
    if (this._stateChangeEvent.state === state) return
    this._stateChangeEvent.state = state
    this.dispatchEvent(this._stateChangeEvent)
  }

  append(data) {
    this._appendToArray(this._xArray, data.pitch)
    this._dataChangeEvent.x = this._varianceArray(this._xArray)

    this._appendToArray(this._zArray, data.roll)
    this._dataChangeEvent.z = this._varianceArray(this._zArray)

    this._dataChangeEvent.pitch = data.pitch
    this._dataChangeEvent.roll = data.roll
    this._dataChangeEvent.heading = data.heading

    this._dataChangeEvent.color = data.color

    this.dispatchEvent(this._dataChangeEvent)
    this._updateState(this._dataChangeEvent.x, this._dataChangeEvent.z)
  }
}

export { MODeviceData }
