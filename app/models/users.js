const db = require('../services/db');
const bcrypt = require('bcryptjs');

// User Model
const User = {
  // Create a new user (for registration)
  async create({ username, email, password }) {
    try {
      // Validate inputs
      if (!username || !email || !password) {
        throw new Error('All fields are required');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email format');
      }

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

      // Return the newly created user
      return { id: result.insertId, username, email };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists');
      }
      throw new Error(error.message || 'Error creating user');
    }
  },

  // Find a user by email (for login)
  async findByEmail(email) {
    try {
      const sql = 'SELECT * FROM users WHERE email = ?';
      const users = await db.query(sql, [email]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw new Error('Error finding user: ' + error.message);
    }
  },

  // Verify password (for login)
  async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error('Error verifying password');
    }
  },

  // Find a user by ID (for session or profile)
  async findById(id) {
    try {
      const sql = 'SELECT id, username, email FROM users WHERE id = ?';
      const users = await db.query(sql, [id]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw new Error('Error finding user by ID: ' + error.message);
    }
  },

  // Save mood history (to track user mood/genre selections)
  async saveMoodHistory(userId, mood, genre) {
    try {
      const sql = `
        INSERT INTO mood_history (user_id, mood, genre, created_at)
        VALUES (?, ?, ?, NOW())
      `;
      await db.query(sql, [userId, mood, genre]);
      return true;
    } catch (error) {
      throw new Error('Error saving mood history: ' + error.message);
    }
  },

  // Get mood history for a user
  async getMoodHistory(userId) {
    try {
      const sql = `
        SELECT mood, genre, created_at
        FROM mood_history
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 10
      `;
      const history = await db.query(sql, [userId]);
      return history;
    } catch (error) {
      throw new Error('Error fetching mood history: ' + error.message);
    }
  }
};

module.exports = User;