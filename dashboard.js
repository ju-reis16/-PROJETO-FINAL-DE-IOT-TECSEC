const broker = "10.136.42.67";
const porta = 9001;

const clientId = "Dashboard-" + Math.random().toString(16).substring(2);

const client = new Paho.Client(
    broker,
    porta,
    clientId
);

const status = document.getElementById("status-mqtt");
const pontoStatus = document.getElementById("ponto-status");

const temperatura = document.getElementById("temperatura");
const umidade = document.getElementById("umidade");
const qualidadeAr = document.getElementById("qualidade-ar");

const alertaTemperatura = document.getElementById("alerta-temperatura");
const alertaUmidade = document.getElementById("alerta-umidade");
const alertaAr = document.getElementById("alerta-ar");

const indicadorTemperatura = document.getElementById("indicador-temperatura");
const indicadorUmidade = document.getElementById("indicador-umidade");
const indicadorAr = document.getElementById("indicador-ar");

const textoAlertaTemperatura = document.getElementById("texto-alerta-temperatura");
const textoAlertaUmidade = document.getElementById("texto-alerta-umidade");
const textoAlertaAr = document.getElementById("texto-alerta-ar");

const cardTemperatura = temperatura.closest(".sensor-card");
const cardUmidade = umidade.closest(".sensor-card");
const cardAr = qualidadeAr.closest(".sensor-card");

client.onConnectionLost = function (resposta) {
    console.error("Conexão perdida:", resposta.errorMessage);

    status.textContent = "Desconectado";
    pontoStatus.className = "status-dot desconectado";
};

client.onMessageArrived = function (mensagem) {
    const topico = mensagem.destinationName;
    const valor = mensagem.payloadString;

    console.log("Mensagem recebida:", topico, valor);

    if (topico === "aulas/professortupi/temperatura") {
        const valorTemperatura = Number(valor);

        temperatura.textContent = valorTemperatura.toFixed(1);

        if (valorTemperatura > 28) {
            alertaTemperatura.textContent = "Alerta";
            alertaTemperatura.className = "alert-badge alerta";

            indicadorTemperatura.className = "indicator alerta";
            textoAlertaTemperatura.textContent = "Acima do limite";

            cardTemperatura.classList.add("alerta");
        } else {
            alertaTemperatura.textContent = "Normal";
            alertaTemperatura.className = "alert-badge normal";

            indicadorTemperatura.className = "indicator normal";
            textoAlertaTemperatura.textContent = "Dentro do limite";

            cardTemperatura.classList.remove("alerta");
        }
    }

    if (topico === "aulas/professortupi/umidade") {
        const valorUmidade = Number(valor);

        umidade.textContent = valorUmidade.toFixed(1);

        if (valorUmidade > 56) {
            alertaUmidade.textContent = "Alerta";
            alertaUmidade.className = "alert-badge alerta";

            indicadorUmidade.className = "indicator alerta";
            textoAlertaUmidade.textContent = "Acima do limite";

            cardUmidade.classList.add("alerta");
        } else {
            alertaUmidade.textContent = "Normal";
            alertaUmidade.className = "alert-badge normal";

            indicadorUmidade.className = "indicator normal";
            textoAlertaUmidade.textContent = "Dentro do limite";

            cardUmidade.classList.remove("alerta");
        }
    }

    if (topico === "aulas/professortupi/qualidade_ar") {
        const valorAr = Number(valor);

        qualidadeAr.textContent = valorAr;

        if (valorAr > 200) {
            alertaAr.textContent = "Alerta";
            alertaAr.className = "alert-badge alerta";

            indicadorAr.className = "indicator alerta";
            textoAlertaAr.textContent = "Acima do limite";

            cardAr.classList.add("alerta");
        } else {
            alertaAr.textContent = "Normal";
            alertaAr.className = "alert-badge normal";

            indicadorAr.className = "indicator normal";
            textoAlertaAr.textContent = "Dentro do limite";

            cardAr.classList.remove("alerta");
        }
    }
};

function conectarMQTT() {
    console.log("Tentando conectar ao MQTT...");

    client.connect({
        useSSL: false,

        onSuccess: function () {
            console.log("Dashboard conectado ao MQTT!");

            status.textContent = "Conectado";
            pontoStatus.className = "status-dot conectado";

            client.subscribe("aulas/professortupi/temperatura");
            client.subscribe("aulas/professortupi/umidade");
            client.subscribe("aulas/professortupi/qualidade_ar");

            console.log("Inscrito nos tópicos MQTT.");
        },

        onFailure: function (erro) {
            console.error("Erro MQTT:", erro);

            status.textContent = "Desconectado";
            pontoStatus.className = "status-dot desconectado";

            setTimeout(conectarMQTT, 3000);
        }
    });
}

conectarMQTT();