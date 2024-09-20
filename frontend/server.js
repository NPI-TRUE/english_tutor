import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// __dirname non è disponibile in moduli ES6, quindi devi usare questa soluzione
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve i file statici dalla directory build
app.use(express.static(path.join(__dirname, 'dist')));

// Per ogni route, serve il file index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Imposta la porta su cui il server ascolta
const port = 5173;
app.listen(port, () => {
  console.log(`Server in esecuzione sulla porta ${port}`);
});