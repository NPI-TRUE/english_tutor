# Usa un'immagine di base di Node.js
FROM node:20

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package.json package-lock.json ./

# Installa le dipendenze
RUN npm install bun
RUN npm install

# Copia il resto del codice dell'applicazione
COPY . .

# Espone la porta su cui l'applicazione sarà in ascolto
EXPOSE 5173

# Comando per avviare l'applicazione
CMD ["npx", "bun", "run", "dev"]