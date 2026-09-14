const broker = "IP_DO_COMPUTADOR";
const porta = 9001;
const clientId = "Dashboard-" + Math.random().toString(16).substring(2);
const client = new Paho.MQTT.Client(
    broker,
    porta,
    clientId
); 
const status = document.getElementById("mqtt-status"); 
const statusDot = document.getElementById("status-dot");
const temperatura = document.getElementById("temperatura");
const umidade = document.getElementById("umidade");
const qualidadeAr = document.getElementById("qualidade-ar");

client.onConnectionLost = function () {
    status.textContent = "● Desconectado";
    statusDot.className = "status-dot desconectado";
};

client.onMessageArrived = function (message) {
    const topico = message.destinationName;
    const valor = message.payloadString;
    if (topico === "aulas/professortupi/temperatura") {
        temperatura.textContent = Number(valor).toFixed(1) + " °C";
    }
    if (topico === "aulas/professortupi/umidade") {
        umidade.textContent = Number(valor).toFixed(1) + " %";
    }
    if (topico === "aulas/professortupi/qualidade_ar") {
        qualidadeAr.textContent = valor;
    }
};

function conectarMQTT() {
    client.connect({
        useSSL: false,
        onSuccess: function () {
            status.textContent = "● Conectado";
            statusDot.className = "status-dot conectado";
            client.subscribe(
                "aulas/professortupi/temperatura"
            );
            client.subscribe(
                "aulas/professortupi/umidade"
            );
            client.subscribe(
                "aulas/professortupi/qualidade_ar"
            );
            console.log("Dashboard conectado ao MQTT");
        },
         onFailure: function (erro) {
            console.error("Erro MQTT:", erro);
            status.textContent = "● Desconectado";
            statusDot.className = "status-dot desconectado";
            setTimeout(conectarMQTT, 3000);
        }
    });
}
conectarMQTT();