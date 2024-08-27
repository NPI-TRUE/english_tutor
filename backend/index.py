from flask import Flask, request, send_file
from flask_cors import CORS
import torch
from TTS.api import TTS
import time
import os
import requests
from llama_index.llms.ollama import Ollama
from dotenv import load_dotenv
from litellm import completion
import os
from llama_index.core.llms import ChatMessage

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "online"

@app.route('/api/v1/message', methods=['POST', "OPTIONS"]) 
def message():
    if request.method == "OPTIONS":
        return '', 200

    data = request.get_json()
    message = data["message"].strip()
    model_type= data["model_type"]

    if (model_type == "groq"):
        os.environ['GROQ_API_KEY'] = os.getenv('GROQ_API_KEY')
        response = completion(
            model="groq/llama3-8b-8192", 
            messages=[
            {"role": "user", "content": message}
        ],
        )

        model_response = response.choices[0].message.content

        print(model_response)

        return model_response
    
    
    message = data["message"].strip()

    llm = Ollama(model=model_type, request_timeout=120.0)

    resp = llm.complete(message)

    print(resp.text)

    return resp.text


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

        print(model_response)

        return model_response
    
    llm = Ollama(model=model_type, request_timeout=120.0)

    tmp = 'The answer must contain ONLY the rewritten sentence or the word "Correct"'

    print(message)

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
    

@app.route('/api/v1/audio', methods=['POST', "OPTIONS"])
def audio():
    if request.method == "OPTIONS":
        return '', 200

    # Crea la cartella audio se non esiste già
    if not os.path.exists('audio'):
        os.makedirs('audio')

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
