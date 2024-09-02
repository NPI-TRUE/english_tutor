import whisper

model = whisper.load_model("base")
result = model.transcribe("female.wav")
print(result["text"])