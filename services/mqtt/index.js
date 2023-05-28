const mqtt = require('mqtt');
const { saveMeasurement } = require('../../services/container')

const MQTT_URL = process.env.MQTT_SERVER_URL;
const MQTT_PORT = process.env.MQTT_SERVER_PORT;

const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;
const MQTT_CLIENT_NAME = process.env.MQTT_CLIENT_NAME;

const options = {
  host: MQTT_URL,
  port: MQTT_PORT,
  clean: true,
  connectTimeout: 4000,
  clientId: MQTT_CLIENT_NAME,
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  protocol: 'mqtts',
}

const initMqttConnection = () => {
  const client = mqtt.connect(options);

  client.on('connect',  () => {
    console.log('Mqtt Connected')
    // Subscribe to a topic
    client.subscribe('6468c3a61284f9cd85766208',  (err) => {
      if (!err) {
        // Publish a message to a topic
        // client.publish('test', 'Hello mqtt')
      }
    })
  });

  client.on('message', (topic, message) => {
    // message is Buffer
    console.log(message.toString())
    // TODO when it would be more than 1 type of message
    // it's necessary to define income message type
    const bookingId = 1;
    saveMeasurement(topic, JSON.parse(message.toString()), bookingId);
  });

  client.on('error', function (error) {
    console.error('Mqtt error', error)
  })

  client.on('offline', function () {
    console.log('Mqtt offline')
  })

  client.on('disconnect', function (packet) {
    console.log(packet)
    client.end();
    console.warn('MQTT CONNECTION FINISHED.');
  })

  client.on('close', function () {
    console.log('Mqtt disconnected')
  })

  client.on('reconnect', function () {
    console.log('Mqtt Reconnecting...')
  })
}

module.exports = initMqttConnection;
