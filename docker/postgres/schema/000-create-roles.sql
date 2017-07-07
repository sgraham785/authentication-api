-- This file contains all the commands to create the database and schema roles

-- database owner group
DROP ROLE IF EXISTS profiles_database_owner;

CREATE ROLE profiles_database_owner;

-- schema owner group
DROP ROLE IF EXISTS users_owner;

CREATE ROLE users_owner
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;

-- schema user group
DROP ROLE IF EXISTS users_user;

CREATE ROLE users_user
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;

-- schema read only group
DROP ROLE IF EXISTS users_readonly;

CREATE ROLE users_readonly
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;


-- app owner role
DROP ROLE IF EXISTS users_app_owner;

CREATE ROLE users_app_owner LOGIN
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
ALTER ROLE users_app_owner
  SET search_path = users;
GRANT users_owner TO users_app_owner;

-- app user role
DROP ROLE IF EXISTS users_app_user;

CREATE ROLE users_app_user LOGIN
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
ALTER ROLE users_app_user
  SET search_path = users;
ALTER ROLE users_app_user
  SET bytea_output = 'escape';
GRANT users_user TO users_app_user;

-- app readonly role
DROP ROLE IF EXISTS users_app_readonly;

CREATE ROLE users_app_readonly LOGIN
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
ALTER ROLE users_app_readonly
  SET search_path = users;
GRANT users_readonly TO users_app_readonly;
