from flask import Flask, request, send_file
from flask_cors import CORS
import torch
from TTS.api import TTS
import time

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

@app.route('/')
def home():
    return "online"

@app.route('/api/v1/message', methods=['POST', "OPTIONS"]) 
def message():
    if request.method == "OPTIONS":
        return '', 200

    data = request.get_json()
    message = data["message"][:-1]

    from litellm import completion
    import os

    os.environ['GROQ_API_KEY'] = "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"
    response = completion(
        model="groq/llama3-8b-8192", 
        messages=[
        {"role": "user", "content": message}
    ],
    )

    model_response = response.choices[0].message.content

    print(model_response)

    return model_response

@app.route('/api/v1/audio', methods=['POST', "OPTIONS"])
def audio():
    if request.method == "OPTIONS":
        return '', 200

    data = request.get_json()
    message = data["message"]

    device = "cuda" if torch.cuda.is_available() else "cpu"

    # List available 🐸TTS models
    print(TTS().list_models())

    # Init TTS
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)

    # Text to speech to a file
    output_file = f"audio/output_{time.time()}.mp3"
    tts.tts_to_file(text=message, speaker_wav="female.wav", language="en", file_path=output_file)

    return send_file(output_file, as_attachment=True)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
