-- database
DROP DATABASE IF EXISTS daily_scrum;

CREATE DATABASE daily_scrum
  WITH OWNER = daily_scrum_database_owner
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
     -- for Linux
       -- LC_COLLATE = 'en_US.UTF-8'
       -- LC_CTYPE = 'en_US.UTF-8'
     -- for Windows
       -- LC_COLLATE = 'English_United States.1252'
       -- LC_CTYPE = 'English_United States.1252'
       CONNECTION LIMIT = -1;


-- connect to db
\c daily_scrum;

-- time zone setup
SET timezone TO 'UTC';
SET TIME ZONE 'America/Los_Angeles';

-- schema
DROP SCHEMA IF EXISTS users;

CREATE SCHEMA users
  AUTHORIZATION users_owner;

GRANT ALL ON SCHEMA users TO users_owner;
GRANT USAGE ON SCHEMA users TO users_appuser;
GRANT USAGE ON SCHEMA users TO users_readonly;
