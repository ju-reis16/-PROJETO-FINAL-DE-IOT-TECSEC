const broker = "IP_DO_COMPUTADOR";
const porta = 9001;
const clientId = "Dashboard-" + Math.random().toString(16).substring(2);
const client = new Paho.MQTT.Client(
    broker,
    porta,
    clientId
);
