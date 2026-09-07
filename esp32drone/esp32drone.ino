#include <WiFi.h>
#include <WebSocketsClient.h>

const char* WIFI_SSID = "";
const char* WIFI_PASSWORD = "";

const char* SERVER_IP = "espdrone-render.onrender.com";
const int SERVER_PORT = 443;

WebSocketsClient webSocket;

int iv,fv;

int tcv;

int initial_t=0;
int initial_b=0;

// pin 4 bottom two

// pin 13 top one

void setup()
{
    Serial.begin(115200);

    // pinMode(2, OUTPUT);

    pinMode(4,OUTPUT);
    pinMode(13,OUTPUT);

    // pinMode(32,OUTPUT);

    // Connect to WiFi
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.println("Connecting to WiFi...");
    }

    Serial.println("WiFi connected");
    Serial.println(WiFi.localIP());

    // Connect to Flask WebSocket
    webSocket.beginSSL(
        SERVER_IP,
        SERVER_PORT,
        "/ws"
    );

    webSocket.onEvent([](WStype_t type, uint8_t* payload, size_t length)
    {
        if (type == WStype_CONNECTED)
        {
            Serial.println("Connected to Flask!");
            webSocket.sendTXT("ESP32 ONLINE");
        }

        if (type == WStype_DISCONNECTED)
        {
            Serial.println("Disconnected!");
        }

        if (type == WStype_TEXT)
        {

            String a=(char*)payload;

            Serial.println(a);

            if (a[0]=='o'){

                iv=200-a.substring(1,a.length()).toInt();

                // fv=(initial_o + iv/200.0)*255.0;

                analogWrite(13,((initial_t + iv)/200.0)*255.0);
                analogWrite(4,((initial_b + iv)/200.0)*255.0);

                Serial.println(((initial_t + iv)/200.0)*255.0);

            }

            else if(a[0]=='t'){

                tcv=100-a.substring(1,a.length()).toInt();

                initial_t=-tcv;

                // Serial.println(a.substring(1,a.length()).toInt());

                // Serial.println((initial_t));

                analogWrite(13,((initial_t + iv)/200.0)*255.0);
                analogWrite(4,((initial_b + iv)/200.0)*255.0);
            }

            // int b;

            // for (int i=0;i<a.length();i++){
            //     if (a[i]==','){
            //         b=-a.substring(0,i).toInt();
            //         break;
            //     }
            // }

            // int v=(b/100.0)*255.0;

            // Serial.println(v);


            // if (v>0){
            //     analogWrite(4,v);
            //     analogWrite(13,v);
            // }
        }
    });

    webSocket.setReconnectInterval(5000);
}

void loop()
{
    // Keep the WebSocket connection alive
    webSocket.loop();
}