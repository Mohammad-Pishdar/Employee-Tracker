const mysql = require("mysql");
const inquirer = require("inquirer");
const columnify = require('columnify');
let employeeNames = [];

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123Zangemadreseh",
    database: "company_DB"
});

connection.connect(err => {
    if (err) throw err;
    appStart();
});

appStart = () => {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View All Employees By Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "View All Roles",
                "Add Role",
                "Remove Role",
                "exit"
            ]
        }).then(answer => {
            switch (answer.action) {
                case "View All Employees":
                    showAllEmployees();
                    break;

                case "View All Employees By Department":
                    showAllEmployeesByDepartment();
                    break;

                case "View All Employees By Manager":
                    showAllEmployeesByManager();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Remove Employee":
                    removeEmployee();
                    break;

                case "Update Employee Role":
                    updateEmployeeRole();
                    break;

                case "Update Employee Manager":
                    updateEmployeeManager();
                    break;

                case "View All Roles":
                    viewAllRoles();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Remove Role":
                    removeRole();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

const showAllEmployees = () => {
    connection.query("SELECT employee.id, first_name, last_name, title, department, salary FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id", function (err, res) {
        if (err) throw err;
        connection.query("SELECT * FROM employee", function (error, response) {
            if (error) throw error;
            for (let i = 0; i < response.length; i++) {
                if (response[i].manager_id === null) {
                    res[i].manager = "NULL"
                } else {
                    res[i].manager = res[response[i].manager_id - 1].first_name + " " + res[response[i].manager_id - 1].last_name;
                }
            }
            console.log(columnify(res, {
                minWidth: 15,
                config: {
                    id: {
                        maxWidth: 3
                    },
                    title: {
                        minWidth: 20
                    },
                    salary: {
                        minWidth: 10
                    }
                }
            }));
            console.log("-----------------------------------");
        })

    });
}

const addEmployee = () => {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;

        for (let i = 0; i < res.length; i++) {
            employeeNames.push(res[i].first_name + " " + res[i].last_name);
        }
        employeeNames.push("None");
    })

    inquirer
        .prompt([{
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?"
        }, {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?"
        }, {
            name: "role",
            type: "list",
            message: "What is the employee's role?",
            choices: [
                "Sales Lead",
                "Salesperson",
                "Lead Engineer",
                "Software Engineer",
                "Account Manager",
                "Accountant",
                "Legal Team Lead",
                "Lawyer"
            ]
        }, {
            name: "manager",
            type: "list",
            message: "Who is the employee's manager?",
            choices: employeeNames
        }]).then(answer => {
            console.log(answer);
        });
}