from llama_index.llms.ollama import Ollama
from llama_index.core.llms import ChatMessage

llm = Ollama(model="llama3.1:latest", request_timeout=120.0)

tmp = 'The answer must contain ONLY the rewritten sentence or the word "Correct"'

messages = [
    ChatMessage(
        role="system", content='I want you to act as a spoken English teacher and improver. Your task is to check the grammatical correctness of my sentence, if there are any mistakes rewrite my sentence in a correct form otherwise answer with "Correct"'
    ),
    ChatMessage(role="user", content="How are you?"),
]
resp = llm.stream_chat(messages)

ans = ""

for r in resp:
    ans += r.delta

print(ans)