# Health-Monitoring-Project

This is an IoT project designed for monitoring the heart rate, oxygen level and temperature of an individual. The system consists of a MAX30100 sensor for detecting heart rate and oxygen level and a LM35 sensor for measuring temperature. The readings from the sensors are sent to a server using WebSockets protocol.

### Components Required

- MAX30100 sensor
- LM35 sensor
- OLED screen
- NodeMcu board
- WebSocketsClient library
- MAX30105 library
- heartRate library
- ESP8266WiFi library
- ArduinoJson library

### Installation

1. Connect the MAX30100 and LM35 sensors to the Nodemcu board.
2. Install the required libraries (WebSocketsClient, MAX30100, heartRate, ESP8266WiFi, and ArduinoJson) in the Arduino IDE.
3. Open the code in the Arduino IDE and upload it to the board.

### Usage

1. Power on the Nodemcu board and connect it to Wi-Fi.
2. Place your index finger on the MAX30105 sensor with steady pressure.
3. The system will detect the heart rate, oxygen level and temperature and send the readings to the server using WebSockets protocol.
4. The server can be configured to display the readings on a dashboard or store them in a database for later analysis.

### Configuration

The following variables can be configured in the code:

- `ssid`: Your Wi-Fi network name.
- `password`: Your Wi-Fi networkpassword.
- `SERVER`: The IP address of the server.
- `PORT`: The port number of the server.
- `URL`: The URL of the server.
- `TempPin`: The pin number of the LM35 sensor.

### Circuit Diagram


![IOT(1)_bb](https://github.com/retrogradex/IOT_project_healthmonitoring/assets/107015185/a21b35d8-9282-4b90-a459-e89f60f59420)

### Web Design 


<<<<<<< Updated upstream

https://github.com/moekhodry11/Health-Monitoring-Project/assets/86708003/4a970ce3-bf14-4133-a1ae-b9da176040b6


=======
<img width="957" alt="Screenshot 2023-05-23 190006" src="https://github.com/alaawahba13/IOT_project_healthmonitoring/assets/101985923/caca05e9-2f8f-4f8d-91c2-1a04189a8df9">
>>>>>>> Stashed changes

![photo_2023-05-23_18-53-37](https://github.com/alaawahba13/IOT_project_healthmonitoring/assets/101985923/55b5ecbb-38b5-4448-8ae0-72ea581b2f48)

### Troubleshooting

If the MAX30100 sensor is not detected, check the wiring and power supply.

If the Wi-Fi connection fails, make sure that the Wi-Fi network name and password are correct.

If the server connection fails, check the IP address, port number, and URL of the server.

If the heart rate and temperature readings are not accurate, check the placement of the MAX30105 sensor and the calibration of the LM35 sensor.

### Authors
This code was developed by 
- [@Alaa Wahba](https://github.com/alaawahba13)
- [@Mohamed Abdullhaleam](https://github.com/Mohamedabdullhaleam)
- [@Mohamed Abdelzaher](https://github.com/Mohamed991-1) 
- [@Fareda Elsayed]( https://github.com/FaredaElsayed)
- [@Gehad Alaa ](https://github.com/Gehad799)
- [@Roaa Gawish ](https://github.com/roaagawish)
- [@Mohamed Khodary](https://github.com/moekhodry11)
- [@Hagar Tarek](https://github.com/Hager706)
- [@Islam Morgan](https://github.com/retrogradex)

Feel free to use and modify the code for your own purposes.
