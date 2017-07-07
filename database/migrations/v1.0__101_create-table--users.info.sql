SET search_path = users;

CREATE TABLE info (
    id bigserial NOT NULL,
    uuid text PRIMARY KEY REFERENCES auth,
    first_name text,
    last_name text,
    preferred_username text,
    email_code text,
    email_verified boolean DEFAULT FALSE,
    avatar text,
    website text,
    gender text,
    birthdate date,
    timezone text,
    locale text,
    phone_number text,
    phone_number_code text,
    phone_number_verified boolean DEFAULT FALSE,
    street_address text,
    street_address2 text,
    locality text,
    region text,
    postal_code text,
    country text,
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE info OWNER TO users_owner;

CREATE INDEX info_uuid_index ON users.info
USING btree
(
  uuid ASC NULLS LAST
);

ALTER TABLE users.info ADD CONSTRAINT info_uuid_fkey FOREIGN KEY (uuid)
REFERENCES users.auth (uuid) MATCH FULL
DEFERRABLE INITIALLY IMMEDIATE
ON DELETE NO ACTION ON UPDATE NO ACTION;