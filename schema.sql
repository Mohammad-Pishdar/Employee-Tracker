DROP DATABASE IF EXISTS company_DB;
CREATE database company_DB;

USE top_songsDB;

CREATE TABLE department (
  id INT NOT NULL,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL,
  title VARCHAR(30),
  salary DECIMAL(7, 1),
  department_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

