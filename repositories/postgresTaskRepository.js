const { Pool } = require('pg');

class PostgresTaskRepository {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
  }

  // Initialize table
  async init() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE
      );
    `);
  }

  // Contract Methods matching In-Memory interface
  async getAll() {
    const result = await this.pool.query('SELECT * FROM tasks');
    return result.rows;
  }

  async getById(id) {
    const result = await this.pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(title, completed = false) {
    const result = await this.pool.query(
      'INSERT INTO tasks (title, completed) VALUES ($1, $2) RETURNING *',
      [title, completed]
    );
    return result.rows[0];
  }

  async update(id, title, completed = false) {
    const result = await this.pool.query(
      'UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING *',
      [title, completed, id]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await this.pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = PostgresTaskRepository;