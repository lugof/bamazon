var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table3');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});
connection.connect();
managerPrompt();

function managerPrompt(){

    inquirer.prompt({
        type: "list",
        name: "menu",
        message: "Select one of the manager options: ",
        choices: ["View products sales by department", "Create new department"]
    }
   ).then(function (response) {


   })
}