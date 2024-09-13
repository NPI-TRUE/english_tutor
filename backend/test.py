prompt + " This is the user message: " + 


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
