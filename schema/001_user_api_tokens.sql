CREATE TABLE `user_api_tokens` (
  `api_token_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier for a user API token',
  `user_id` int(10) unsigned NOT NULL COMMENT 'Owner user identifier',
  `description` varchar(255) NOT NULL COMMENT 'User-provided token description',
  `token_hash` binary(32) NOT NULL COMMENT 'SHA-256 hash of the API token',
  `stamp_created` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Time the API token was created',
  `stamp_last_used` timestamp NULL DEFAULT NULL COMMENT 'Time the API token was last used',
  PRIMARY KEY (`api_token_id`),
  UNIQUE KEY `unq_user_api_tokens_token_hash` (`token_hash`),
  KEY `idx_user_api_tokens_user_id` (`user_id`),
  CONSTRAINT `user_api_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
