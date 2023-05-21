#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include <Wire.h>
#include "MAX30100_PulseOximeter.h"

WiFiClientSecure  secured_client;
WebSocketsClient  webSocket;
PulseOximeter     pox;

const char* ssid     =  "Mohamed";
const char* password =  "mohamed123";

#define SERVER                  "172.20.10.5"
#define PORT                    3000
#define URL                     "/"
#define TempPin                 A0
#define REPORTING_PERIOD_MS     1000

// Variables for Heart Rate
uint32_t tsLastReport = 0;
int HeartRate ,SPO2;

// Variables for Temperature
int val;
float Temperature ;

void onBeatDetected() {
    Serial.println("♥ Beat!");
}

void setup() {

  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)   //Checks wifi connection
  {
    Serial.print(".");
    delay(500);
  }
  Serial.print("\nWiFi connected. IP address: ");
  Serial.println(WiFi.localIP());
  
//Connect to websocket server
  webSocket.begin(SERVER, PORT, URL);
  webSocket.onEvent(webSocketEvent);
  
//Check the sensor connection  
  if (!pox.begin()) {
        Serial.println("FAILED");
        for(;;);
    } else {
        Serial.println("SUCCESS");
    }

  // Configure sensor to use 7.6mA for LED drive
  pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);

  // Register a callback routine
  pox.setOnBeatDetectedCallback(onBeatDetected);
  
}

void loop() {
  webSocket.loop();
  getAllReadings();
}

void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("Disconnected from WebSocket server");
      break;
    case WStype_CONNECTED:
      Serial.println("Connected to WebSocket server");
      break;
  }
}

void sendValuesToServer() {
  StaticJsonDocument<256> jsonDocument;
  String jsonData;
  jsonDocument["value1"] = Temperature ;
  jsonDocument["value2"] = HeartRate;
  jsonDocument["value3"] = SPO2;
  serializeJson(jsonDocument, jsonData);    //Convert JSON object to string to send it to server
  webSocket.sendTXT(jsonData);
}

void getAllReadings() {
    // Read from the sensor
    pox.update();

    // Grab the updated heart rate and SpO2 levels
    if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
         HeartRate =pox.getHeartRate();
         SPO2= pox.getSpO2();
        Serial.print("Heart rate:");
        Serial.print(HeartRate);
        Serial.print("bpm / SpO2:");
        Serial.print(SPO2);
        Serial.println("%");
        getTempSensor();
        sendValuesToServer();
        tsLastReport = millis();
    }
    webSocket.loop();
}

void getTempSensor() {
  //LM35 average reading for human 37
  int val = analogRead(TempPin);
  Temperature= ( val / 1024.0) * 330;
  // = mv / 10;
  String Temp = "Temperature : " + String(Temperature) + " °C";
  Serial.println(Temp);
}
