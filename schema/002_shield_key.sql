ALTER TABLE `shields`
  ADD COLUMN `shield_key` varchar(64) DEFAULT NULL COMMENT 'Optional user-defined key for API lookup' AFTER `public_id`,
  ADD UNIQUE KEY `unq_shields_shield_key` (`user_id`, `shield_key`);
