const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Cria o arquivo 'papelaria.db' na raiz do projeto
const dbPath = path.resolve(__dirname, '../../papelaria.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar no SQLite:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Inicializa a tabela
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      min_quantity INTEGER NOT NULL,
      category TEXT
    )
  `);
});

module.exports = db;