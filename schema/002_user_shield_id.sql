ALTER TABLE `shields`
  ADD COLUMN `user_shield_id` varchar(64) DEFAULT NULL AFTER `public_id`,
  ADD UNIQUE KEY `unq_shields_user_shield_id` (`user_id`, `user_shield_id`);
