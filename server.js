const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { salvarReclamacao, listarReclamacoes } = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

app.post('/api/reclamacoes', upload.single('arquivo'), async (req, res) => {
    const { nome, email, companhia, mensagem } = req.body;
    const arquivo = req.file ? req.file.filename : null;

    if (!nome || !email || !companhia || !mensagem) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        await salvarReclamacao(nome, email, companhia, mensagem, arquivo);
        res.json({ mensagem: 'Reclamação registrada com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao salvar reclamação.' });
    }
});

app.get('/api/reclamacoes', async (req, res) => {
    try {
        const reclamacoes = await listarReclamacoes();
        res.json(reclamacoes);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar reclamações.' });
    }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));