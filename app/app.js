const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");


const app = express();
const db = require('./services/db');

app.use(express.static("static"));
app.set('view engine', 'pug');
app.set('views', './app/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// ROUTES

app.get("/", (req, res) => res.render("home"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.get("/about", (req, res) => res.render("about"));



// SONG LIST WITH FILTER
app.get("/songs", async (req, res) => {
  const { mood, genre } = req.query;
  let sql = "SELECT * FROM songs WHERE 1=1";
  const params = [];

  if (mood) {
    sql += " AND mood = ?";
    params.push(mood);
  }

  if (genre) {
    sql += " AND genre = ?";
    params.push(genre);
  }

  try {
    const songs = await db.query(sql, params);
    res.render("songs", { songs, selectedMood: mood, selectedGenre: genre });
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).send("Error fetching songs");
  }
});

app.get("/songs/:id", function(req, res) { 
  const songId = req.params.id;
  const sql = "SELECT * FROM songs WHERE id = ?";
  
  db.query(sql, [songId])
      .then(results => {
          if (results.length > 0) {
              res.render("song-details", { song: results[0] });
          } else {
              res.status(404).send("Song not found");
          }
      })
      .catch(err => {
          console.error("Database error:", err);
          res.status(500).send("Internal Server Error");
      });
});


// Songs CRUD
app.get("/new", (req, res) => {
  res.render("add-song");
});
app.post("/add-song", (req, res) => {
  // Access form data via req.body
  const { title, artist, genre, mood, album, year, duration, lyrics } = req.body;

  // For now, just log or simulate saving
  console.log("New Song Submitted:", { title, artist, genre, mood, album, year, duration, lyrics });

  // Redirect to song list or confirmation page
  res.redirect("/songs");
});


// 404
app.use((req, res) => {
  res.status(404).render("error", { url: req.originalUrl });
});

// SERVER
app.listen(3000, () => {
  console.log(`Server running at http://127.0.0.1:3000/`);
});
