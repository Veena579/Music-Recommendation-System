const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();
const { body, validationResult } = require('express-validator');

const User = require('./models/users');
const db = require('./services/db');

// Middleware
app.use(express.static('static'));
app.set('view engine', 'pug');
app.set('views', './app/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Routes
app.get('/', (req, res) => res.render('home'));
app.get('/about', (req, res) => res.render('about'));
app.get('/login', (req, res) => res.render('login', { error: null }));
app.get('/register', (req, res) => res.render('register', { error: null }));

app.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('login', { error: errors.array()[0].msg });
    }
    try {
      const { email, password } = req.body; // Fix: Extract email and password from req.body
      const user = await User.findByEmail(email);
      if (!user) {
        return res.render('login', { error: 'Email not registered' });
      }

      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.render('login', { error: 'Incorrect Password' });
      }

      req.session.user = { id: user.id, username: user.username, email: user.email };
      res.redirect('/songs');
    } catch (error) {
      console.error('Login error:', error);
      res.render('login', { error: 'An error occurred. Please try again.' });
    }
  }
);

// Registration
app.post(
  '/submit',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('confirm-password')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('register', { error: errors.array()[0].msg });
    }

    const { username, email, password } = req.body;

    try {
      const user = await User.create({ username, email, password });
      req.session.user = { id: user.id, username: user.username, email: user.email };
      res.redirect('/login');
    } catch (error) {
      console.error('Registration error:', error);
      res.render('register', { error: error.message });
    }
  }
);

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// User Profile
app.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const history = await User.getMoodHistory(req.session.user.id);
    res.render('profile', { user: req.session.user, history });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.render('profile', { user: req.session.user, history: [], error: 'Error loading history' });
  }
});

app.use('/songs', express.static('static/songs'));

// Song List with Filter
app.get('/songs', isAuthenticated, async (req, res) => {
  const { mood, genre, search } = req.query;
  let sql = 'SELECT * FROM songs WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (title LIKE ? OR artist LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (mood) {
    sql += ' AND mood = ?';
    params.push(mood);
  }

  if (genre) {
    sql += ' AND genre = ?';
    params.push(genre);
  }

  try {
    const songs = await db.query(sql, params);
    if (req.session.user && (mood || genre)) {
      await User.saveMoodHistory(req.session.user.id, mood || 'Unknown', genre || 'Unknown');
    }
    res.render('songs', { songs, search, mood, genre });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).send('Error fetching songs');
  }
});

app.get('/songs/:id', isAuthenticated, async (req, res) => {
  const songId = req.params.id;
  const sql = 'SELECT * FROM songs WHERE id = ?';

  try {
    const results = await db.query(sql, [songId]);
    if (results.length > 0) {
      res.render('song-details', { song: results[0] });
    } else {
      res.status(404).send('Song not found');
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Songs CRUD
app.get('/new', isAuthenticated, (req, res) => {
  res.render('add-song');
});

app.post('/add-song', isAuthenticated, async (req, res) => {
  const { title, artist, genre, mood, album, year, duration, lyrics } = req.body;

  const sql = `
    INSERT INTO songs (title, artist, genre, mood, url, album, year, duration, lyrics)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    title,
    artist,
    genre,
    mood,
    `/songs/${title.replace(/\s+/g, '-').toLowerCase()}.mp3`, // Placeholder URL
    album || null,
    year || null,
    duration || null,
    lyrics || null,
  ];

  try {
    await db.query(sql, params);
    res.redirect('/songs');
  } catch (error) {
    console.error('Error adding song:', error);
    res.render('add-song', { error: 'Error adding song' });
  }
});

// Newsletter Subscription
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  try {
    const sql = 'INSERT INTO subscribers (email) VALUES (?)';
    await db.query(sql, [email]);
    res.redirect('/?message=Subscribed successfully');
  } catch (error) {
    console.error('Subscription error:', error);
    res.redirect('/?error=Subscription failed');
  }
});

// 404
app.use((req, res) => {
  res.status(404).render('error', { url: req.originalUrl });
});

// Server
app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});