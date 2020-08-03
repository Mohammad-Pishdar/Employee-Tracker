const mysql = require("mysql");
const inquirer = require("inquirer");
const columnify = require('columnify');

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
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.log(columnify(res));
        console.log("-----------------------------------");
    });
}