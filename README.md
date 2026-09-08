# ESP32 Drone Controller

A browser-based controller for an ESP32. The Flask application serves a touch-friendly control interface and relays control values to the ESP32 over a secure WebSocket connection.

## Project structure

```text
main.py                    Flask server and WebSocket relay
requirements.txt           Python dependencies
templates/main.html        Controller page
static/main.js             Pointer controls and HTTP payloads
static/main.css            Controller styling
esp32drone/esp32drone.ino  ESP32 Wi-Fi and motor-control firmware
```

## How it works

1. Open the controller page in a browser.
2. The browser sends control values as JSON with `POST /value`.
3. Flask forwards each value to the connected ESP32 through `/ws`.
4. The ESP32 converts the throttle and motor values to PWM output.

The browser currently sends this payload:

```json
{
  "o": 200,
  "jx": 0,
  "jy": 0,
  "t": 100,
  "b": 100
}
```

The relay sends values as separate messages in the form `keyvalue`, for example `o150` or `t40`.

## Key Engineering Concepts
- **Asynchronous IPC & Relay Protocol:** Bridges browser HTTP POST payloads to persistent WebSocket frames for low-latency hardware control.
- **Full-Stack Signal Flow:** Transmits touch/pointer UI inputs through Python/Flask endpoint handlers down to ESP32 GPIO PWM output pins.
- **Concurrency & State Management:** Evaluates process-global WebSocket client handles and single-worker server constraints (`Gevent` event loop).
- **Embedded Hardware Integration:** Converts serialized string commands into dynamic motor duty cycles via ESP32 timers and hardware actuators.

## Requirements

- Python 3.9 or newer
- An ESP32 board
- Arduino IDE or another ESP32-compatible Arduino toolchain
- A Wi-Fi network reachable by the ESP32
- Two motor drivers or compatible PWM-controlled loads

## Run the Flask controller locally

From the project directory, create and activate a virtual environment, then install the dependencies:

### Windows PowerShell

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Start the server:

```powershell
python main.py
```

Open <http://127.0.0.1:5000> in a browser.

For a production-style deployment, the included dependencies support Gunicorn with Gevent:

```powershell
gunicorn -k gevent -w 1 main:app
```

Use one worker because the application currently stores the single connected ESP32 WebSocket in a process-global variable.

## Configure and upload the ESP32 firmware

1. Install an ESP32 board package in the Arduino IDE.
2. Install the `WebSockets` library that provides `WebSocketsClient.h`.
3. Open `esp32drone/esp32drone.ino`.
4. Set `WIFI_SSID` and `WIFI_PASSWORD`.
5. Set `SERVER_IP` to the hostname of the deployed Flask server, or to the server's LAN address when testing locally.
6. Confirm `SERVER_PORT` and the WebSocket path `/ws` match the server.
7. Select the ESP32 board and upload the sketch.

The current firmware uses:

- GPIO 13 for the top motor output
- GPIO 4 for the bottom motor output
- Serial output at `115200` baud

Do not connect motors directly to ESP32 GPIO pins. Use suitable motor drivers, provide an independent motor power supply, and test with propellers removed.

## Controls

- Left vertical control: shared throttle value (`o`)
- Right circular control: joystick position (`jx`, `jy`)
- `TOP 1`: top motor value (`t`)
- `BOTTOM 2`: bottom motor value (`b`)

The right joystick resets to its center position when released. The motor sliders remain at their last position.

## Deployment notes

The browser script currently posts to:

```text
https://espdrone-render.onrender.com/value
```

If the Flask app is deployed at another address, update the URL in `static/main.js`. The ESP32 firmware must also use the same deployed host. Because the firmware calls `beginSSL`, the deployed endpoint must provide a valid TLS certificate.

## Architecture Constraints & Development Roadmap

- **Client Tracking:** the current backend is designed for only single connected device ,planned migration to multi-client.
- **Safety & Failsafes:** future iterations will introduce hardware heartbeat ping timeouts and emergency motor kill switches.

## License

No license has been specified for this project.