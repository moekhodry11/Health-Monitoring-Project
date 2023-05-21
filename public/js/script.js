// Create Temperature Gauge
var gaugeTemp = new LinearGauge({
  renderTo: 'temperature',
  width: 120,
  height: 400,
  units: "Temperature C",
  minValue: 0,
  startAngle: 90,
  ticksAngle: 180,
  maxValue: 40,
  colorValueBoxRect: "#049faa",
  colorValueBoxRectEnd: "#049faa",
  colorValueBoxBackground: "#f1fbfc",
  valueDec: 2,
  valueInt: 2,
  majorTicks: [
      "0",
      "5",
      "10",
      "15",
      "20",
      "25",
      "30",
      "35",
      "40"
  ],
  minorTicks: 4,
  strokeTicks: true,
  highlights: [
      {
          "from": 30,
          "to": 40,
          "color": "rgba(200, 50, 50, .75)"
      }
  ],
  colorPlate: "#fff",
  colorBarProgress: "#CC2936",
  colorBarProgressEnd: "#049faa",
  borderShadowWidth: 0,
  borders: false,
  needleType: "arrow",
  needleWidth: 2,
  needleCircleSize: 7,
  needleCircleOuter: true,
  needleCircleInner: false,
  animationDuration: 1500,
  animationRule: "linear",
  barWidth: 10,
}).draw();
  
// Create Heart Rate Gauge
var gaugeHR = new RadialGauge({
  renderTo: 'HeartRate',
  width: 300,
  height: 300,
  units: "BPM ",
  minValue: 0,
  maxValue: 160,
  colorValueBoxRect: "#049faa",
  colorValueBoxRectEnd: "#049faa",
  colorValueBoxBackground: "#f1fbfc",
  valueInt: 2,
 
  
  strokeTicks: true,
  highlights: [
      {
          "from": 120,
          "to": 160,
          "color": "#03C0C1"
      }
  ],
  colorPlate: "#fff",
  borderShadowWidth: 0,
  borders: false,
  needleType: "",
  colorNeedle: "#007F80",
  colorNeedleEnd: "#007F80",
  needleWidth: 2,
  needleCircleSize: 3,
  colorNeedleCircleOuter: "#007F80",
  needleCircleOuter: true,
  needleCircleInner: false,
  animationDuration: 1500,
  animationRule: "linear"
}).draw();

// Create SP02 Gauge
var gaugeSP02 = new RadialGauge({
  renderTo: 'oxygen',
  width: 300,
  height: 300,
  units: "SP02 (%)",
  minValue: 0,
  maxValue: 100,
  colorValueBoxRect: "#049faa",
  colorValueBoxRectEnd: "#049faa",
  colorValueBoxBackground: "#f1fbfc",
  valueInt: 2,
  majorTicks: [
      "0",
      "10",
      "20",
      "30",
      "40",
      "50",
      "60",
      "70",
      "80",
      "90",
      "100"

  ],
  minorTicks: 4,
  strokeTicks: true,
  highlights: [
      {
          "from": 0,
          "to": 80,
          "color": "#03C0C1"
      }
  ],
  colorPlate: "#fff",
  borderShadowWidth: 0,
  borders: false,
  needleType: "line",
  colorNeedle: "#007F80",
  colorNeedleEnd: "#007F80",
  needleWidth: 2,
  needleCircleSize: 3,
  colorNeedleCircleOuter: "#007F80",
  needleCircleOuter: true,
  needleCircleInner: false,
  animationDuration: 1500,
  animationRule: "linear"
}).draw();

src="https://cdn.jsdelivr.net/npm/chart.js@3.4.1/dist/chart.min.js"
const chart = new Chart(document.getElementById('chart'), {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Sensor Data',
          data: [],
          fill: false,
          borderColor: 'black',
          borderWidth: 0.5,
          tension: 0,
          pointRadius: 0, 
          pointHoverRadius: 1,
        },
      ],
    },
  });


  var HOST = location.origin.replace(/^http/, 'ws');
	var ws = new WebSocket(HOST); //#A

  ws.onopen=function(){
    console.log('Connected to server')
  }

  ws.onmessage=function(event){
    const data = JSON.parse(event.data);
    const Temperature = data.value1;
    const HeartRate = data.value2;
    const SPO2 = data.value3;
 
    console.log(Temperature);
    console.log(HeartRate);
    console.log(SPO2);
   
    gaugeTemp.value = Temperature;
    gaugeHR.value = HeartRate;
    gaugeSP02.value = SPO2; 

 
    chart.data.labels.push(new Date().toLocaleTimeString());
    chart.data.datasets[0].data.push(parseFloat(HeartRate));
    chart.update();
 
    function checkTemp() {
      if (parseInt(Temperature) >= 40) {
        sendTelegramMessage("Warning!!! , Temberature is : "+ Temperature +" , Heart rate is : "+HeartRate);
      }
    }
 
  progressBar1.addEventListener("input", checkTemp());
  }
 
  function sendTelegramMessage(message) {
    const telegramBotToken = "6140302269:AAG5rMISL5xamoIG5dnJcDuaJOK9qt1vWQU";
    const chatId = "819635862";
    const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatId}&text=${message}`;
       
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to send message");
        }
      })
      .catch(error => {
        console.error(error);
      });
  } 
