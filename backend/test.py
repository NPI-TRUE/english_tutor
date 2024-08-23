from llama_index.llms.ollama import Ollama

llm = Ollama(model="llama3.1:latest", request_timeout=120.0)

resp = llm.complete("Hello, how are you?")

print(type(resp.text))

print("done")