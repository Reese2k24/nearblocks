CREATE TABLE nodes (
  node_id TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  moniker TEXT,
  account_id TEXT,
  last_seen TIMESTAMP,
  last_height TEXT,
  agent_name TEXT,
  agent_version TEXT,
  agent_build TEXT,
  peer_count TEXT,
  is_validator boolean,
  last_hash TEXT,
  signature TEXT,
  status TEXT,
  latitude TEXT,
  longitude TEXT,
  city TEXT,
  bandwidth_download integer,
  bandwidth_upload integer,
  cpu_usage integer,
  memory_usage TEXT,
  boot_time_seconds DATE,
  block_production_tracking_delay integer,
  min_block_production_delay integer,
  max_block_production_delay integer,
  max_block_wait_delay integer,
   PRIMARY KEY (
    node_id
  )
);   
   