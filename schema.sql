DROP DATABASE IF EXISTS company_DB;
CREATE database company_DB;

USE company_DB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  department VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL(7, 1),
  department_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 3),("Mike", "Chan", 2, 1),("Ashley", "Rodriquez", 3, null),("Kevin", "Tupik", 4, 3),("Malia", "Brown", 5, null),("Sarah", "Lourd", 6, null),("Tom", "Allen", 7, 6),("Tammer", "Galal", 8, 4);

INSERT INTO department (department)
VALUES ("Sales"),("sales"),("Engineering"),("Engineering"),("Finance"),("Legal"),("Legal"),("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),("Salesperson", 80000, 1),("Lead Engineer", 150000, 2),("Software Engineer", 120000, 2),("Accountant", 125000, 3), ("Leagl Team Lead", 250000, 4),("Lawyer", 190000, 4),("Software Engineer",120000, 2);

