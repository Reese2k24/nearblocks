ALTER TABLE blocks
ADD COLUMN IF NOT EXISTS block_bytea BYTEA NULL;