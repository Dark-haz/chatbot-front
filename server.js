import express from 'express';
import cors from 'cors';
import path from 'path'; 
import { fileURLToPath } from 'url';

// Simulate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
const port = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'dist')));
app.use('/assets', express.static(path.resolve(__dirname, 'dist/assets')));


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});



app.listen(port, "0.0.0.0" , () => {
  console.log(`Server running on port ${port}`);
});

