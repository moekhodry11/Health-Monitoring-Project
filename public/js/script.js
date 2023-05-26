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

  let previousMinute = null;
  circularProgress1 = document.getElementById("chr");
  progressValue1 = document.getElementById("hr");
  let progressStartValue1 = 0,    
  progressEndValue1 = 150;   

  circularProgress2 = document.getElementById("cspo2");
  progressValue2 = document.getElementById("spo2");
  let progressStartValue2 = 0,    
  progressEndValue2 = 100;  

  var HOST = location.origin.replace(/^http/, 'ws');
	var ws = new WebSocket(HOST); 

  var Temperature, HeartRate, SPO2;
  ws.onopen=function(){
    console.log('Connected to server')
  }

  ws.onmessage=function(event){
    const data = JSON.parse(event.data);
     Temperature = data.value1;
     HeartRate = data.value2;
     SPO2 = data.value3;
 
    console.log(Temperature);
    console.log(HeartRate);
    console.log(SPO2);

    progressStartValue1 = parseInt(HeartRate);
    progressStartValue2 = parseInt(SPO2);
    gaugeTemp.value = Temperature ;
  

 
    chart.data.labels.push(new Date().toLocaleTimeString());
    chart.data.datasets[0].data.push(parseFloat(HeartRate));
    chart.update();
   
    checkMinute()
 
  }
    
  function checkValues() {
    if (parseInt(Temperature) >= 37 || parseInt(HeartRate) >= 120 || parseInt(HeartRate) <60 || parseInt(SPO2) >= 100 || parseInt(SPO2) < 80)  {
      sendTelegramMessage("Warning!!! , Temperature is : "+ Temperature +" , Heart rate is : "+HeartRate +" , Oxygen level is : "+ SPO2 );
    }
  }
  
  function checkMinute() {
    const now = new Date();
    const currentMinute = now.getMinutes();
  
    if (currentMinute !== previousMinute) {
      checkValues()
      previousMinute = currentMinute; 
    }
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

  let progress1 = setInterval(() => {  
    progressValue1.textContent = `${progressStartValue1}`
    circularProgress1.style.background = `conic-gradient(#021042 ${progressStartValue1 * 2.4}deg, #ededed 0deg)` 
  });

  let progress2 = setInterval(() => {  
    progressValue2.textContent = `${progressStartValue2}%`
    circularProgress2.style.background = `conic-gradient(#021042 ${progressStartValue2 * 3.6}deg, #ededed 0deg)` 
  });