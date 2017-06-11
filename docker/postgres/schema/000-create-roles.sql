-- This file contains all the commands to create the database and schema roles

-- database owner group
DROP ROLE IF EXISTS daily_scrum_database_owner;

CREATE ROLE daily_scrum_database_owner;

-- schema owner group
DROP ROLE IF EXISTS users_owner;

CREATE ROLE users_owner
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;

-- schema user group
DROP ROLE IF EXISTS users_appuser;

CREATE ROLE users_appuser
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;

-- schema read only group
DROP ROLE IF EXISTS users_readonly;

CREATE ROLE users_readonly
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;


-- login roles

DROP ROLE IF EXISTS users_usersuser_user;

CREATE ROLE users_usersuser_user LOGIN
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
ALTER ROLE users_usersuser_user
  SET search_path = users;
ALTER ROLE users_usersuser_user
  SET bytea_output = 'escape';
GRANT users_usersuser TO users_usersuser_user;

DROP ROLE IF EXISTS users_owner_user;

CREATE ROLE users_owner_user LOGIN
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
ALTER ROLE users_owner_user
  SET search_path = users;
GRANT users_owner TO users_owner_user;

DROP ROLE IF EXISTS users_readonly_user;

CREATE ROLE users_readonly_user LOGIN
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
ALTER ROLE users_readonly_user
  SET search_path = users;
GRANT users_readonly TO users_readonly_user;
