class MODeviceData extends EventTarget {
  constructor() {
    super()
    this._length = 50
    const initArray = new Array(this._length).fill(0)
    this._xArray = [...initArray]
    this._zArray = [...initArray]
    this._dataChangeEvent = new CustomEvent('datachange')
    this._stateChangeEvent = new CustomEvent('statechange')
  }

  _appendToArray(array, value) {
    array.shift()
    array.push(Math.abs(value))
  }

  _sumArray(array) {
    const unRoundedSum = array.reduce((sum, currentValue, i, array) => {
      if(i !== 0) {
        return sum + Math.abs(Math.abs(currentValue) - Math.abs(array[i - 1]))
      }

      return sum + Math.abs(currentValue)
    })
    return Math.round(unRoundedSum * 100) / 100
  }

  _updateState(xSum, ySum) {
    if (xSum > 15) {
      this._changeState(1)
      return
    }

    if (ySum > 7) {
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
    this._appendToArray(this._xArray, data.x)
    this._dataChangeEvent.x = this._sumArray(this._xArray)

    this._appendToArray(this._zArray, data.z)
    this._dataChangeEvent.z = this._sumArray(this._zArray)

    this._dataChangeEvent.pitch = data.pitch
    this._dataChangeEvent.roll = data.roll
    this._dataChangeEvent.heading = data.heading

    this.dispatchEvent(this._dataChangeEvent)
    this._updateState(this._dataChangeEvent.x, this._dataChangeEvent.z)
  }
}

export { MODeviceData }
