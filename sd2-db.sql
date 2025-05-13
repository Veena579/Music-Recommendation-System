-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Oct 30, 2022 at 09:54 AM
-- Server version: 8.0.24
-- PHP Version: 7.4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Songs Table
CREATE TABLE songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    mood VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL
);

-- Mood History Table
CREATE TABLE mood_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    mood VARCHAR(100),
    genre VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert Sample Users
INSERT INTO users (username, email, password_hash) VALUES
('john_doe', 'john@example.com', 'hashed_password1'),
('jane_smith', 'jane@example.com', 'hashed_password2');

-- Insert Sample Songs
INSERT INTO songs (title, artist, genre, mood, url) VALUES
('Happy', 'Pharrell Williams', 'Pop', 'Happy', 'https://example.com/happy.mp3'),
('Someone Like You', 'Adele', 'Pop', 'Sad', 'https://example.com/someone_like_you.mp3'),
('Bohemian Rhapsody', 'Queen', 'Rock', 'Energetic', 'https://example.com/bohemian_rhapsody.mp3'),
('Clair de Lune', 'Debussy', 'Classical', 'Calm', 'https://example.com/clair_de_lune.mp3');

INSERT INTO mood_history (user_id, mood, genre) VALUES
(1, 'Happy', 'Pop'),
(2, 'Sad', 'Pop'),
(1, 'Energetic', 'Rock');
