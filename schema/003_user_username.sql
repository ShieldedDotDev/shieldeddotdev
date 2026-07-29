ALTER TABLE `users`
  ADD COLUMN `username` varchar(255) DEFAULT NULL COMMENT 'Optional username selected by the user' AFTER `login`;
