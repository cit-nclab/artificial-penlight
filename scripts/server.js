class MOServer extends EventTarget {
  connect() {
    const host = 'wss://mso5-ws-s.herokuapp.com/'
    this._ws = new WebSocket(host)

    const messageEvent = new CustomEvent('message')
    this._ws.onmessage = (event) => {
      messageEvent.data = event.data
      this.dispatchEvent(messageEvent)
    }

    return true
  }

  send(data) {
    this._ws.send(data)
  }
}

export { MOServer }
