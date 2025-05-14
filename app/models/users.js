const db = require('../services/db');
const bcrypt = require('bcryptjs');

// User Model
const User = {
  // Create a new user (for registration)
  async create({ username, email, password }) {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // SQL query to insert a new user
      const sql = `
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
      `;
      const params = [username, email, hashedPassword];

      // Execute the query
      const result = await db.query(sql, params);

      // Return the newly created user ID
      return { id: result.insertId, username, email };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists');
      }
      throw new Error('Error creating user: ' + error.message);
    }
  },

  // Find a user by email (for login)
  async findByEmail(email) {
    try {
      const sql = 'SELECT * FROM users WHERE email = ?';
      const users = await db.query(sql, [email]);

      // Return the first user found (or null if none)
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw new Error('Error finding user: ' + error.message);
    }
  },

  // Verify password (for login)
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // Find a user by ID (optional, for user profile or session)
  async findById(id) {
    try {
      const sql = 'SELECT id, username, email FROM users WHERE id = ?';
      const users = await db.query(sql, [id]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw new Error('Error finding user by ID: ' + error.message);
    }
  }
};

module.exports = User;