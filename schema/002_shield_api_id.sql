ALTER TABLE `shields`
  ADD COLUMN `api_id` varchar(64) DEFAULT NULL AFTER `public_id`,
  ADD UNIQUE KEY `unq_shields_user_api_id` (`user_id`, `api_id`);
