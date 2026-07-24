CREATE TABLE `user_api_tokens` (
  `api_token_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `description` varchar(255) NOT NULL,
  `token_hash` binary(32) NOT NULL,
  `stamp_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `stamp_last_used` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`api_token_id`),
  UNIQUE KEY `unq_user_api_tokens_token_hash` (`token_hash`),
  KEY `idx_user_api_tokens_user_id` (`user_id`),
  CONSTRAINT `user_api_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
