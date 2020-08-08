const mysql = require("mysql");
const inquirer = require("inquirer");
const columnify = require('columnify');
let listOfAvailableRoles = [];

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

    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;

        listOfAvailableRoles = res.slice();

    })

    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View Total Utilised Budget of a Department",
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

                case "View Total Utilised Budget of a Department":
                    viewTotalUtilisedBudgetOfDepartment();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

const showAllEmployees = () => {

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

    let managersNames = [];
    let managerIds = [];

    connection.query("SELECT id, first_name, last_name, manager_id FROM company_db.employee", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            if (res[i].manager_id === null) {
                managersNames.push(`${res[i].first_name} ${res[i].last_name}`)
                managerIds.push(res[i].id);
            };
        }
        for (let i = 0; i < res.length; i++) {
            for (let j = 0; j < res.length; j++) {
                if (res[i].id === res[j].manager_id && res[i].manager_id != null) {
                    managersNames.push(`${res[i].first_name} ${res[i].last_name}`);
                    managerIds.push(res[i].id);
                }
            }
        }

        //Removing duplicates
        managersNames = [...new Set(managersNames)];
        managerIds = [...new Set(managerIds)];

        inquirer
            .prompt({
                name: "manager",
                type: "list",
                message: "Choose the manager you want to see the employees under",
                choices: managersNames
            }).then(answer => {
                for (let i = 0; i < managersNames.length; i++) {
                    if (answer.manager === managersNames[i]) {
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

}

const addEmployee = () => {
    let department_id;
    let manager_id;
    let role_id;
    let employeeNames = [];
    let availableRoleTitles = [];

    listOfAvailableRoles.forEach(role => {
        availableRoleTitles.push(role.title);
    })

    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            employeeNames[i] = `${res[i].first_name} ${res[i].last_name}`;
        }
        employeeNames.push('None');
    })

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
            choices: availableRoleTitles
        }, {
            name: "manager",
            type: "list",
            message: "Who is the employee's manager?",
            choices: employeeNames
        }])
        .then(answer => {

            employeeNames[role_id] = `${answer.first_name} ${answer.last_name}`;

            for (let i = 0; i < employeeNames.length; i++) {
                if (employeeNames[i] === answer.manager && employeeNames[i] !== "None") {
                    manager_id = i + 1;
                    break;
                } else if (answer.manager === "None") {
                    manager_id = null;
                    break;
                }
            }

            listOfAvailableRoles.forEach(role => {
                if (answer.role === role.title) {
                    role_id = role.id;
                }
            })

            switch (department_id) {
                case 1:
                    department = "Sales";
                    break;

                case 2:
                    department = "Engineering";
                    break;

                case 3:
                    department = "Finance";
                    break;

                case 4:
                    department = "Legal";
                    break;
            }

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

        })
}

const removeEmployee = () => {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        const employeeNames = res.map(employee => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }
        })
        inquirer.prompt({
            name: "employee",
            type: "list",
            message: "Enter the full name of the employee you want to remove",
            choices: employeeNames
        }).then(answer => {
            if (answer.employee === "None") {
                appStart();
            } else {
                connection.query(
                    "DELETE FROM employee WHERE id = ?",
                    answer.employee,
                    function (err, res) {
                        if (err) throw err;
                    }
                )
                appStart();
            }
        })
    })
}

const updateEmployeeRole = () => {
    let listOfEmployees = [];
    let listOfCurrentRoles = [];

    listOfAvailableRoles.forEach(role => {
        listOfCurrentRoles.push(role.title);
    })

    connection.query("SELECT id, first_name, last_name FROM employee", function (err, res) {
        if (err) throw err;
        res.forEach(employee => {
            listOfEmployees.push({
                fullName: `${employee.first_name} ${employee.last_name}`,
                id: employee.id
            });
        });
        let employeesFullNames = [];
        listOfEmployees.forEach(employee => {
            employeesFullNames.push(employee.fullName);
        })
        const questions = [{
            name: "employee",
            type: "list",
            message: "Choose the employee you want to update his/her role",
            choices: employeesFullNames
        }, {
            name: "role",
            type: "rawlist",
            message: "Choose a role to assign to the employee",
            choices: listOfCurrentRoles
        }];

        inquirer.prompt(questions).then(answer => {

            let roleID;
            let employeeID;

            listOfAvailableRoles.forEach(role => {
                if (answer.role === role.title) {
                    roleID = role.id;
                }
            })

            listOfEmployees.forEach(employee => {
                if (answer.employee === employee.fullName) {
                    employeeID = employee.id;
                }
            })

            connection.query(
                "UPDATE employee SET ? WHERE ?",
                [{
                        role_id: roleID
                    },
                    {
                        id: employeeID
                    }
                ],
                appStart()
            )

        })
    })
}

const updateEmployeeManager = () => {
    let listOfEmployeesFullNames = [];
    let listOfEmployeeObjects = [];

    connection.query("SELECT id, first_name, last_name, manager_id FROM employee", function (err, res) {
        if (err) throw err;
        res.forEach(employee => {
            listOfEmployeesFullNames.push(
                `${employee.first_name} ${employee.last_name}`);
            listOfEmployeeObjects.push({
                fullName: `${employee.first_name} ${employee.last_name}`,
                id: employee.id
            });
        });
        console.log(listOfEmployeeObjects);
        const questions = [{
            name: "employee",
            type: "list",
            message: "Choose the employee you want to update the manager for",
            choices: listOfEmployeesFullNames
        }, {
            name: "manager",
            type: "rawlist",
            message: "Choose a manager to assign to your chosen employee",
            choices: listOfEmployeesFullNames
        }];

        inquirer.prompt(questions).then(answer => {
            let employeeID;
            let managerID;

            listOfEmployeeObjects.forEach(employee => {
                if (answer.employee === employee.fullName) {
                    employeeID = employee.id;
                }
            })

            listOfEmployeeObjects.forEach(employee => {
                if (answer.manager === employee.fullName) {
                    managerID = employee.id;
                }
            })

            connection.query(
                "UPDATE employee SET ? WHERE ?",
                [{
                        manager_id: managerID,
                    },
                    {
                        id: employeeID
                    }
                ],
                appStart()
            )
        })
    })
}

const viewAllRoles = () => {

    let avilabaleRolesIDsAndTitles = [];

    listOfAvailableRoles.forEach(role => {
        avilabaleRolesIDsAndTitles.push({
            ID: role.id,
            Title: role.title
        });
    })

    console.log("-----------------------------------");
    console.log(columnify(avilabaleRolesIDsAndTitles, {
        minWidth: 15,
        config: {
            id: {
                maxWidth: 3
            },
            title: {
                minWidth: 20
            }
        }
    }));
    console.log("-----------------------------------");
    appStart();
}

const addRole = () => {

    const questions = [{
        name: "roleTitle",
        type: "input",
        message: "Plese enter the title for the new role you want to add"
    }, {
        name: "salary",
        type: "input",
        message: "Please enter the amount of salary considered for that role",
    }, {
        name: "departmentID",
        type: "rawlist",
        message: "What department this role belongs to?",
        choices: ["Sales", "Engineering", "Finance", "Legal"]
    }];

    inquirer.prompt(questions).then(answer => {

        let departmentID;

        switch (answer.departmentID) {
            case "Sales":
                departmentID = 1;
                break;

            case "Engineering":
                departmentID = 2;
                break;

            case "Finance":
                departmentID = 3;
                break;

            case "Legal":
                departmentID = 4;
                break;
        }

        listOfAvailableRoles.push({
            title: answer.roleTitle,
            salary: answer.salary,
            department_id: departmentID,
            id: listOfAvailableRoles.length + 1
        })

        let sql = `INSERT INTO role 
            (
                title, salary, department_id
            )
            VALUES
            (
                ?, ?, ?
            )`;

        connection.query(sql, [answer.roleTitle, answer.salary, departmentID], function (err, res) {
            if (err) throw err;
            appStart();
        })
    })
}

const removeRole = () => {

    let avilabaleRoleTitles = [];
    let roleID;

    listOfAvailableRoles.forEach(role => {
        avilabaleRoleTitles.push(role.title);
    })

    const questions = [{
        name: "role",
        type: "rawlist",
        message: "Which one of these roles you want to remove from the database?",
        choices: avilabaleRoleTitles
    }]

    inquirer.prompt(questions).then(answer => {
        listOfAvailableRoles.forEach(role => {
            if (answer.role === role.title) {
                roleID = role.id;
            }
        })
        connection.query("select first_name, last_name, title, department from employee inner join role on employee.role_id = role.id inner join department on role.department_id = department.id where role_id = ?", [roleID], function (err, res) {
            if (err) throw err;

            //Checking to see if the returned response is empty or not. If it's not empty, so the role is in use and cannot be deleted. Otherwise, the role will be deleted.
            if (res.length) {
                console.log("***************************************************");
                console.log("You cannot remove the roles as long as they are assigned to employees. Please update the role of employees and try again.");
                console.log("***************************************************");
                appStart();
            } else {
                listOfAvailableRoles.forEach(role => {
                    if (answer.role === role.title) {
                        connection.query(
                            "DELETE FROM role WHERE title = ?",
                            answer.role,
                            function (err, res) {
                                if (err) throw err;
                                appStart();
                            }
                        )
                    }
                })
            }
        })

    })
}

const viewTotalUtilisedBudgetOfDepartment = () => {
    inquirer
        .prompt({
            name: "department",
            type: "list",
            message: "Choose the department you want to see the total salary budget for:",
            choices: [
                "Sales",
                "Engineering",
                "Finance",
                "Legal"
            ]
        }).then(answer => {
            connection.query("select department, sum(salary) from employee inner join role on employee.role_id = role.id inner join department on role.department_id = department.id where department =" + "'" + answer.department + "'",
                function (err, res) {
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