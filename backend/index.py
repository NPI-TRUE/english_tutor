from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import torch
import os
from llama_index.llms.ollama import Ollama
from dotenv import load_dotenv
from litellm import completion
import os
from llama_index.core.llms import ChatMessage
import uuid
import whisper
from gtts import gTTS
import requests
import json

### from TTS.api import TTS

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/v1/home', methods=['GET'])
def home():
    return "online"

@app.route('/api/v1/message', methods=['POST', "OPTIONS"]) 
def message():
    if request.method == "OPTIONS":
        return '', 200

    data = request.get_json()
    message = data["message"].strip()
    model_type= data["model_type"]
    msg = data["chatHistory"]

    prompt = "I want you to act as a spoken English teacher and improver. I will speak to you in English and you will reply to me in English to practice my spoken English. I want you to keep your reply neat, limiting the reply to 100 words. I want you to ask me a question in your reply. Now let's start practicing, you could ask me a question first."

    if (model_type == "groq"):
        os.environ['GROQ_API_KEY'] = os.getenv('GROQ_API_KEY')

        msg.append({"role": "system", "content": prompt})
        msg.append({"role": "user", "content": message})

        response = completion(
            model="groq/llama3-8b-8192", 
            messages=msg,
        )

        model_response = response.choices[0].message.content

        return model_response
    
    llm = Ollama(model=model_type, request_timeout=120.0, base_url=os.getenv('host_ollama'))

    messages = []

    for m in msg:
        messages.append(ChatMessage(role=m["role"], content=m["content"]))

    messages.append(ChatMessage(role="system", content=prompt))
    messages.append(ChatMessage(role="user", content=message))

    resp = llm.stream_chat(messages)

    ans = ""

    for r in resp:
        ans += r.delta

    return ans

@app.route('/api/v1/getOllamaTags', methods=['POST', "OPTIONS", "GET"])
def get_ollama_tags():
    if request.method == "OPTIONS":
        return '', 200

    host_ollama = os.getenv('host_ollama')

    model_name = []

    try:
        response = requests.get(f"{host_ollama}/api/tags")
        response.raise_for_status()  # Verifica se la richiesta ha avuto successo
        data = response.text
        data = json.loads(data)
    except requests.exceptions.RequestException as e:
        return str(e), 500  # Restituisce l'errore come stringa con codice di stato 500

    print(data)

    for model in data["models"]:
        print(model)
        model_name.append(model["name"])

    print(model_name)

    return jsonify({"tags": model_name})

    

@app.route('/api/v1/message/check', methods=['POST', "OPTIONS"]) 
def message_check():
    if request.method == "OPTIONS":
        return '', 200
    
    prompt = 'I want you to act as a spoken English teacher and improver. The answer must contain ONLY the rewritten sentence or the word "Correct". Your task is to check the grammatical correctness of my sentence, if there are any mistakes or the sentence is not structured in proper English rewrite my sentence in a correct form otherwise answer with "Correct", this is the sentence to analyze: '
    
    data = request.get_json()
    message = data["message"].strip()
    model_type= data["model_type"]

    msg = prompt + message

    if (model_type == "groq"):
        os.environ['GROQ_API_KEY'] = os.getenv('GROQ_API_KEY')
        response = completion(
            model="groq/gemma2-9b-it", 
            messages=[
            {"role": "user", "content": msg}
        ],
        )

        model_response = response.choices[0].message.content

        return model_response
    
    llm = Ollama(model=model_type, request_timeout=120.0, base_url=os.getenv('host_ollama'))

    messages = [
        ChatMessage(
        role="system", content='I want you to act as a spoken English teacher and improver. Your task is to check the grammatical correctness of my sentence, if there are any mistakes rewrite my sentence in a correct form otherwise answer with "Correct"'
        ),
        ChatMessage(role="user", content=message),
    ]
    resp = llm.stream_chat(messages)

    ans = ""

    for r in resp:
        ans += r.delta

    return ans


@app.route('/api/v1/uploads', methods=['POST', "OPTIONS"])
def uploads():
    if request.method == "OPTIONS":
        return jsonify({"options": "ok"}), 200
    
    # Crea la cartella audio se non esiste già
    if not os.path.exists('user_audio'):
        os.makedirs('user_audio')
    
    file = request.files['file']

    # Controlla se il file ha un nome valido
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    

    file_name = uuid.uuid4().hex + ".wav"
    audio_path = os.path.join("user_audio", file_name)
    file.save(audio_path)
    
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)

    os.remove(audio_path)

    return jsonify({"transcription": result["text"]}), 200
    

### Problems due to conflicts between dependency versions
"""
@app.route('/api/v1/audio', methods=['POST', "OPTIONS"])
def audio():
    if request.method == "OPTIONS":
        return '', 200

    # Crea la cartella audio se non esiste già
    if not os.path.exists('ai_audio'):
        os.makedirs('ai_audio')

    data = request.get_json()
    message = data["message"]

    device = "cuda" if torch.cuda.is_available() else "cpu"

    # List available 🐸TTS models
    print(TTS().list_models())

    # Init TTS
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)

    # Text to speech to a file
    output_file = f"ai_audio/output_{uuid.uuid4()}.mp3"
    tts.tts_to_file(text=message, speaker_wav="female.wav", language="en", file_path=output_file)

    return send_file(output_file, as_attachment=True)
"""

@app.route('/api/v1/audio/fast', methods=['POST', "OPTIONS"])
def audio_fast():
    if request.method == "OPTIONS":
        return '', 200

    # Crea la cartella audio se non esiste già
    if not os.path.exists('ai_audio'):
        os.makedirs('ai_audio')

    data = request.get_json()
    message = data["message"]

    tts = gTTS(message)

    output_file = f"ai_audio/output_{uuid.uuid4()}.mp3"

    tts.save(output_file)

    return send_file(output_file, as_attachment=True)

if __name__ == '__main__':
    app.run(port=7123, host="0.0.0.0")
