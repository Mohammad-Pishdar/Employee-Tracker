const mysql = require("mysql");
const inquirer = require("inquirer");
const columnify = require('columnify');
const employeeNames = ["None", "John Doe", "Mike Chan", "Ashley Rodriguez", "Kevin Tupik", "Malia Brown", "Sarah Lourd", "Tom Allen", "Tammer Galal"];

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

const appStart = () => {
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
    console.log(employeeNames);
    connection.query("SELECT employee.id, first_name, last_name, title, department, salary, manager_id FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            for (let j = 0; j < res.length; j++) {
                if (res[i].id === res[j].manager_id) {
                    res[j].manager = res[i].first_name + " " + res[i].last_name;
                }
                if (res[j].manager_id === null) {
                    res[j].manager = "NULL";
                }
            }
        }
        for (let i = 0; i < res.length; i++) {
            delete res[i].manager_id;
        }

        console.log("-----------------------------------");
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
        appStart();
        // })

    });

}

const showAllEmployeesByDepartment = () => {
    inquirer
        .prompt({
            name: "department",
            type: "list",
            message: "Choose the department you want to see the employees in",
            choices: [
                "Sales",
                "Engineering",
                "Finance",
                "Legal"
            ]
        }).then(answer => {
            connection.query("select first_name, last_name, department from employee inner join role on employee.role_id = role.id inner join department on role.department_id = department.id where department = " + "'" + answer.department + "'", function (err, res) {
                if (err) throw err;

                console.log("-----------------------------------");
                console.log(columnify(res, {
                    minWidth: 15,
                    config: {
                        id: {
                            maxWidth: 3
                        }
                    }
                }));
                console.log("-----------------------------------");
                appStart();

            });
        })


}

const showAllEmployeesByManager = () => {
    let managerNames = [];
    let managerIds = [];
    let manager_id;
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;

        for (let i = 0; i < res.length; i++) {
            for (let j = 0; j < res.length; j++) {
                if (res[i].id === res[j].manager_id && res[i].manager_id != null) {
                    managerNames.push(res[i].first_name + " " + res[i].last_name);
                    managerIds.push(res[i].id);
                }
            }
        }
        connection.query("SELECT * FROM employee where manager_id is null", function (err, res) {
            for (let i = 0; i < res.length; i++) {
                managerNames.push(res[i].first_name + " " + res[i].last_name);
                managerIds.push(res[i].id);
            }
            inquirer
                .prompt({
                    name: "manager",
                    type: "list",
                    message: "Choose the manager you want to see the employees under",
                    choices: managerNames
                }).then(answer => {
                    for (let i = 0; i < managerNames.length; i++) {
                        if (answer.manager === managerNames[i]) {
                            manager_id = managerIds[i];
                        }
                    }
                    connection.query("select first_name, last_name from employee where manager_id =" + manager_id, function (err, res) {
                        if (err) throw err;

                        console.log("-----------------------------------");
                        console.log(columnify(res, {
                            minWidth: 15,
                            config: {
                                id: {
                                    maxWidth: 3
                                }
                            }
                        }));
                        console.log("-----------------------------------");
                        appStart();
                    })
                })
        })
    });

};

const addEmployee = () => {
    let title;
    let salary;
    let department_id;
    let manager_id;
    let role_id;

    inquirer.prompt([{
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
        }])
        .then(answer => {
            employeeNames.push(answer.first_name + " " + answer.last_name);
            role_id = employeeNames.length++;

            for (let i = 0; i < employeeNames.length; i++) {
                if (employeeNames[i] === answer.manager) {
                    manager_id = i;
                }
                if (employeeNames[i] === "None") {
                    manager_id = null;
                }
            }


            switch (answer.role) {
                case "Sales Lead":
                    title = "Sales Lead";
                    salary = 100000;
                    department_id = 1;
                    department = "Sales";
                    break;

                case "Salesperson":
                    title = "Salesperson";
                    salary = 80000;
                    department_id = 1;
                    department = "Sales";
                    break;

                case "Lead Engineer":
                    title = "Lead Engineer";
                    salary = 150000;
                    department_id = 2;
                    department = "Engineering";
                    break;

                case "Software Engineer":
                    title = "Software Engineer";
                    salary = 120000;
                    department_id = 2;
                    department = "Engineering";
                    break;

                case "Account Manager":
                    title = "Account Manager";
                    salary = 140000;
                    department_id = 3;
                    department = "Finance";
                    break;

                case "Accountant":
                    title = "Accountant";
                    salary = 125000;
                    department_id = 3;
                    department = "Finance";
                    break;

                case "Legal Team Lead":
                    title = "Legal Team Lead";
                    salary = 250000;
                    department_id = 4;
                    department = "Legal";
                    break;

                case "Lawyer":
                    title = "Lawyer";
                    salary = 190000;
                    department_id = 4;
                    department = "Legal";
                    break;
            }
            connection.query(
                "INSERT INTO role SET ?", {
                    title: title,
                    salary: salary,
                    department_id: department_id,
                },
                err => {
                    if (err) throw err;
                    connection.query(
                        "INSERT INTO employee SET ?", {
                            first_name: answer.first_name,
                            last_name: answer.last_name,
                            role_id: role_id,
                            manager_id: manager_id
                        },
                        err => {
                            if (err) throw err;
                            appStart();
                        }
                    );
                }
            );
        })
}

const removeEmployee = () => {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;

        inquirer.prompt({
            name: "employee",
            type: "list",
            message: "Enter the full name of the employee you want to remove",
            choices: employeeNames
        }).then(answer => {
            if (answer.employee === "None") {
                appStart();
            } else {
                for (let i = 0; i < res.length; i++) {
                    if ((answer.employee).split(" ").shift() === res[i].first_name && (answer.employee).split(" ").pop() === res[i].last_name) {
                        connection.query(
                            "DELETE FROM employee WHERE id =" + res[i].id,
                            function (err, res) {
                                if (err) throw err;
                            }
                        )
                    }
                }
                appStart();
            }
        })
    })
}