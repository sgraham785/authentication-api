SET search_path = users;

CREATE TABLE oauth (
  id bigserial NOT NULL,
  uuid uuid PRIMARY KEY REFERENCES users.auth (uuid) MATCH FULL ON DELETE NO ACTION,
  provider text NOT NULL,
  access_token varchar(40) NOT NULL,
  refresh_token varchar(40) NOT NULL,
  expiry_date timestamp NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE oauth OWNER TO users_owner;

CREATE INDEX oauth_uuid_index ON users.oauth
USING btree
(
  uuid ASC NULLS LAST
);

ALTER TABLE users.oauth 
ALTER CONSTRAINT oauth_uuid_fkey
DEFERRABLE INITIALLY IMMEDIATE;