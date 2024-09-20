# Usa un'immagine di base di Node.js
FROM node:20

# Imposta la directory di lavoro
WORKDIR /app

# Installa le dipendenze
RUN npm install bun
RUN npm install

# Copia il resto del codice dell'applicazione
COPY . .

RUN npx bun run build

# Espone la porta su cui l'applicazione sarà in ascolto
EXPOSE 5173

# Comando per avviare l'applicazione
CMD ["node", "server.js"]