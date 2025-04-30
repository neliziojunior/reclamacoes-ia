const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS reclamacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT,
        companhia TEXT,
        mensagem TEXT,
        arquivo TEXT,
        data DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

function salvarReclamacao(nome, email, companhia, mensagem, arquivo) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare("INSERT INTO reclamacoes (nome, email, companhia, mensagem, arquivo) VALUES (?, ?, ?, ?, ?)");
        stmt.run(nome, email, companhia, mensagem, arquivo, function(err) {
            if (err) reject(err);
            else resolve();
        });
        stmt.finalize();
    });
}

function listarReclamacoes() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM reclamacoes ORDER BY data DESC", (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

module.exports = { salvarReclamacao, listarReclamacoes };