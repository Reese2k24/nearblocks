ALTER TABLE blocks
ADD COLUMN IF NOT EXISTS block_json JSONB NULL;

ALTER TABLE receipts
ADD COLUMN IF NOT EXISTS public_key TEXT NULL;

ALTER TABLE execution_outcomes
ADD COLUMN IF NOT EXISTS logs JSONB NULL;
