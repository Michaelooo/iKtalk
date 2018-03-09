import io from 'socket.io-client'
import ss from 'socket.io-stream'

export default class LiveSocket {

  constructor({ server, host, port }) {
    this.server = server
    this.host = host
    this.port = port
    this.isConnected = false
  }

  connect(id) {
    return new Promise((resolve, reject) => {
      const { server, host, port } = this
      let connectTimer = setTimeout(reject, 10000)
      console.debug('connecting socket', id)
      this.connectionId = id
      const socket = this.socket = io(`${server}/${id}` || `http://${host}:${port}/${id}`)
      console.log('woxx',socket);
      socket.on('connect', () => {
        this.isConnected = true
        console.log('socket connected')
        socket.emit('login', { id })
        clearTimeout(connectTimer)
        resolve()
      })
      socket.on('error', reject)
    })
  }

  disconnect() {
    this.socket.emit('disconnect')
    this.socket.disconnect()
  }

  on(message, callback = ()=>{}) {
    this.socket.on(message, callback)
  }

  send(message) {
    if (this.isConnected) {
      this.socket.emit(message)
    }
  }

  upload(blob) {
    if (!this.isConnected) return
    let sr = ss.createStream()
    ss(this.socket).emit('upload', sr)
    let d = ss.createBlobReadStream(blob)
    d.pipe(sr)
    console.log('upload stream')
  }
}
