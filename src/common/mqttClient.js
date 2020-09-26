import mqtt from 'mqtt'
const options = {
  connectTimeout: 40000,
  clientId: 'mqtitId-Home',
  username: 'admin',
  password: 'password',
  clean: true
}
const mqttClient = {}
mqttClient.client = mqtt.connect('ws://127.0.0.1:61623', options)
mqttClient.client.on('connect', (e) => {
  console.log("连接成功！！！")
  mqttClient.client.subscribe('test1', { qos: 0 }, (error) => {
    if (!error) {
      console.log('订阅成功')
    } else {
      console.log('订阅失败')
    }
  })
})
mqttClient.msg = ""
mqttClient.client.on('message', (topic, message) => {
  console.log('收到来自', topic, '的消息', message.toString())
  mqttClient.msg = message.toString()
})

export default mqttClient

