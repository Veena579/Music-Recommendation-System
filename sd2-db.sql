CREATE TABLE `mood_history` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `mood` varchar(100) DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `songs`
--

CREATE TABLE `songs` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `genre` varchar(100) NOT NULL,
  `mood` varchar(100) NOT NULL,
  `url` varchar(500) NOT NULL,
  `album` varchar(255) DEFAULT NULL,
  `year` int DEFAULT NULL,
  `duration` varchar(10) DEFAULT NULL,
  `lyrics` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `songs`
--

INSERT INTO `songs` (`id`, `title`, `artist`, `genre`, `mood`, `url`, `album`, `year`, `duration`, `lyrics`) VALUES
(1, 'Happy', 'Pharrell Williams', 'Pop', 'Happy', '/songs/1.mp3', 'G I R L', 2013, '3:53', 'It might seem crazy what I’m about to say...'),
(2, 'Someone Like You', 'Adele', 'jazz', 'Sad', '/songs/2.mp3', '21', 2011, '4:45', 'Never mind, I’ll find someone like you...'),
(3, 'Bohemian Rhapsody', 'Queen', 'Rock', 'Energetic', '/songs/3.mp3', 'A Night at the Opera', 1975, '5:55', 'Is this the real life? Is this just fantasy?...'),
(4, 'Clair de Lune', 'Debussy', 'Classical', 'Calm', '/songs/5.mp3', 'Suite Bergamasque', 1905, '5:00', 'Instrumental'),
(5, 'Shape of You', 'Ed Sheeran', 'Pop', 'Energetic', '/songs/4.mp3', 'Divide', 2017, '3:53', 'The club isn’t the best place to find a lover...'),
(6, 'Imagine', 'John Lennon', 'Rock', 'Calm', '/songs/6.mp3', 'Imagine', 1971, '3:01', 'Imagine there’s no heaven...'),
(7, 'Thinking Out Loud', 'Ed Sheeran', 'Pop', 'Romantic', '/songs/7.mp3', 'x', 2014, '4:41', 'When your legs don’t work like they used to before...'),
(8, 'River Flows in You', 'Yiruma', 'Classical', 'Calm', '/songs/8.mp3', 'First Love', 2001, '3:30', 'Instrumental'),
(9, 'Don’t Stop Believin’', 'Journey', 'Rock', 'Energetic', '/songs/1.mp3', 'Escape', 1981, '4:10', 'Just a small town girl, living in a lonely world...'),
(10, 'All of Me', 'John Legend', 'Jazz', 'Romantic', '/songs/4.mp3', 'Love in the Future', 2013, '4:29', 'What would I do without your smart mouth...');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'Veena', 'veena57921@gmail.com', '$2b$10$IFlXSKBG6AgYDrgdYWE2w.WMiZGwG.X/rLdP6rdgRNpo.HBnfT6ze');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mood_history`
--
ALTER TABLE `mood_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `songs`
--
ALTER TABLE `songs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mood_history`
--
ALTER TABLE `mood_history`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `songs`
--
ALTER TABLE `songs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `mood_history`
--
ALTER TABLE `mood_history`
  ADD CONSTRAINT `mood_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;
