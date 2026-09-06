from flask import Flask,render_template,request, jsonify
from flask_sock import Sock
import time

import json

app = Flask(__name__, template_folder="templates", static_folder="static")
sock = Sock(app)

connected_client = None


@sock.route("/ws")
def websocket(ws):
    global connected_client

    connected_client = ws

    print("ESP32 connected!")

    try:
        while True:
            message = ws.receive()

            if message is None:
                break

            print("ESP32:", message)

    except Exception as e:
        print("Connection error:", e)

    finally:
        connected_client = None
        print("ESP32 disconnected!")

@app.route("/")
def home():
    return render_template("main.html")


@app.route("/value",methods=["POST"])
def val():
    data=request.get_json()

    # print(data["value"])

    # if connected_client:
    #     connected_client.send(f"{data["o"]},{data["jx"]},{data["jy"]},{data["m1"]},{data["m2"]}")

    for i,k in enumerate(data.items()):
        connected_client.send(f"{k[0]}{k[1]}")

    return jsonify({
        "ok":"ok"
    })

if __name__ == "__main__":
    app.run(debug=True)