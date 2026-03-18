const db = require('../database/db');

class ProductRepository {
  
  create(product) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO products (name, price, quantity, min_quantity, category) VALUES (?, ?, ?, ?, ?)`;
      db.run(sql, [product.name, product.price, product.quantity, product.min_quantity, product.category], function(err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, ...product });
      });
    });
  }

  findByID(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM products WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  findByName(name) {
    return new Promise((resolve, reject) => {
      // Query parametrizada: o valor substitui o '?' de forma segura,
      // escapando os caracteres especiais automaticamente.
      db.all(`SELECT * FROM products WHERE name = ?`, [name], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  updateQuantity(id, newQuantity) {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE products SET quantity = ? WHERE id = ?`, [newQuantity, id], (err) => {
        if (err) return reject(err);
        resolve(true);
      });
    });
  }

  listAll() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM products`, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
  

  deleteAll() {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM products`, [], (err) => {
        if (err) return reject(err);
        resolve(true);
      });
    });
  }
}

module.exports = new ProductRepository();