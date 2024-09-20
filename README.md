## Set ollama:

Add add these two lines to the file ```/etc/systemd/system/ollama.service```:

``` Environment="OLLAMA_HOST=0.0.0.0" ```
``` Environment="OLLAMA_ORIGINS=*" ```

## Set GROQ_API_KEY

Set GROQ_API_KEY in .env file in backend folder

## Start programm

On linux:
```export MY_IP=$(hostname -I | awk '{print $1}') && sudo -E docker compose up```

On macos:
```export MY_IP=$(ipconfig getifaddr en0) && sudo -E docker compose up```
