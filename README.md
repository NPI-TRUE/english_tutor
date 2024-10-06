## Set ollama:

Add add these two lines to the file `/etc/systemd/system/ollama.service`:

`Environment="OLLAMA_HOST=0.0.0.0"`<br><br>
`Environment="OLLAMA_ORIGINS=*"`

## Set GROQ_API_KEY

Set `GROQ_API_KEY` in `.env` link in `.env.example`

## Start programm

### Setup certs
On mobile, the use of the microphone is allowed only if there is an https connection, it is necessary to upload the certificates in the `certs` folder, in particular the key.pem and cert.pem files are required.

In particular, if you want to test locally without using a particular domain, you can create self-signed SSL certificates in this way:
```bash
cd english_tutor
```

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout $(pwd)/certs/key.pem \
    -out $(pwd)/certs/cert.pem \
    -subj "/C=FR/ST=/L=/O=Global Security/OU=IT Department/CN=example.com"
```

Replace $*$ with the version you want to use (e.g. x86, arm, etc..)
```bash
docker compose -f docker-compose.*.yaml up -d
```

## Groq
To use groq you need to create a `.env` file with the groq api inside like in the `.env.example` file