#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include <Wire.h>
#include "MAX30100_PulseOximeter.h"
#include "Adafruit_GFX.h"
#include "OakOLED.h"

WiFiClientSecure  secured_client;
WebSocketsClient  webSocket;
PulseOximeter     pox;
OakOLED           oled;

const char* ssid     =  "Mohamed";
const char* password =  "mohamed123";

#define SERVER                  "172.20.10.8"
#define PORT                    3000
#define URL                     "/"
#define TempPin                 A0
#define REPORTING_PERIOD_MS     1000

// Variables for Heart Rate
uint32_t tsLastReport = 0;
int HeartRate , SPO2;

// Variables for Temperature
int val;
float Temperature ;

const unsigned char bitmap [] PROGMEM =
{
  0x00, 0x00, 0x00, 0x00, 0x01, 0x80, 0x18, 0x00, 0x0f, 0xe0, 0x7f, 0x00, 0x3f, 0xf9, 0xff, 0xc0,
  0x7f, 0xf9, 0xff, 0xc0, 0x7f, 0xff, 0xff, 0xe0, 0x7f, 0xff, 0xff, 0xe0, 0xff, 0xff, 0xff, 0xf0,
  0xff, 0xf7, 0xff, 0xf0, 0xff, 0xe7, 0xff, 0xf0, 0xff, 0xe7, 0xff, 0xf0, 0x7f, 0xdb, 0xff, 0xe0,
  0x7f, 0x9b, 0xff, 0xe0, 0x00, 0x3b, 0xc0, 0x00, 0x3f, 0xf9, 0x9f, 0xc0, 0x3f, 0xfd, 0xbf, 0xc0,
  0x1f, 0xfd, 0xbf, 0x80, 0x0f, 0xfd, 0x7f, 0x00, 0x07, 0xfe, 0x7e, 0x00, 0x03, 0xfe, 0xfc, 0x00,
  0x01, 0xff, 0xf8, 0x00, 0x00, 0xff, 0xf0, 0x00, 0x00, 0x7f, 0xe0, 0x00, 0x00, 0x3f, 0xc0, 0x00,
  0x00, 0x0f, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};


void onBeatDetected() {
  Serial.println("♥ Beat!");
  if ((SPO2 > 0) && (HeartRate > 0)) {
    sendValuesToServer();
    oled.drawBitmap( 60, 20, bitmap, 28, 28, 1);
    oled.display();
  }
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

  oled.begin();
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(1);
  oled.setCursor(0, 0);

  oled.println("Initializing pulse oximeter..");
  oled.display();
  Serial.print("Initializing pulse oximeter..");
  //Check the sensor connection
  if (!pox.begin()) {
    oled.clearDisplay();
    oled.setTextSize(1);
    oled.setTextColor(1);
    oled.setCursor(0, 0);
    oled.println("FAILED");
    oled.display();
    Serial.println("FAILED");
    for (;;);
  } else {
    Serial.println("SUCCESS");
    oled.clearDisplay();
    oled.setTextSize(1);
    oled.setTextColor(1);
    oled.setCursor(0, 0);
    oled.println("SUCCESS");
    oled.display();
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
    HeartRate = pox.getHeartRate();
    SPO2 = pox.getSpO2();
    Serial.print("Heart rate:");
    Serial.print(HeartRate);
    Serial.print("bpm / SpO2:");
    Serial.print(SPO2);
    Serial.println("%");

    getTempSensor();

    oled.clearDisplay();
    oled.setTextSize(2);
    oled.setTextColor(1);
    oled.setCursor(0, 16);
    oled.println(HeartRate);
    
    oled.setTextSize(2);
    oled.setTextColor(1);
    oled.setCursor(0, 0);
    oled.println("Heart BPM");

    oled.setTextSize(2);
    oled.setTextColor(1);
    oled.setCursor(0, 30);
    oled.println("Spo2");

    oled.setTextSize(2);
    oled.setTextColor(1);
    oled.setCursor(0, 45);
    oled.println(SPO2);
    oled.display();

    tsLastReport = millis();
  }
  webSocket.loop();
}

void getTempSensor() {
  //LM35 average reading for human 37
  int val = analogRead(TempPin);
  Temperature = ( val / 1024.0) * 330;
  String Temp = "Temperature : " + String(Temperature) + " °C";
  Serial.println(Temp);
}
