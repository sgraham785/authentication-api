SET search_path = users;

CREATE TABLE auth (
  uuid uuid NOT NULL PRIMARY KEY,
  email text NOT NULL UNIQUE CHECK (length(email) > 0),
  password text NOT NULL CHECK (length(password) > 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uuid_pkey PRIMARY KEY (uuid)

);

ALTER TABLE auth OWNER TO users_owner;

CREATE INDEX auth_uuid_index ON users.auth
USING btree
(
  uuid ASC NULLS LAST
);
