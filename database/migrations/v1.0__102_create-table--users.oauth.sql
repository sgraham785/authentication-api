SET search_path = users;

CREATE TABLE oauth(
  id bigserial NOT NULL PRIMARY KEY,
  uuid uuid REFERENCES auth,
  provider text NOT NULL,
  access_token varchar(40) NOT NULL,
  refresh_token varchar(40) NOT NULL,
  expiry_date datetime NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uuid_pkey PRIMARY KEY (uuid)

);

ALTER TABLE oauth OWNER TO users_owner;

CREATE INDEX oauth_uuid_index ON users.oauth
USING btree
(
  uuid ASC NULLS LAST
);

ALTER TABLE users.oauth ADD CONSTRAINT oauth_uuid_fkey FOREIGN KEY (uuid)
REFERENCES users.auth (uuid) MATCH FULL
DEFERRABLE INITIALLY IMMEDIATE
ON DELETE NO ACTION ON UPDATE NO ACTION;