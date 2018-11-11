
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
showitems();
setTimeout(firstprompt,1500);

        //function to ask for user's input on our bamazon database
        function firstprompt(){
                inquirer.prompt([{
                    type: "input",
                    name: "id",
                    message: "Type the ID of the product you would like to buy"
                },
                {
                    type: "input",
                    name: "units",
                    message: "how many units of the product would you like to buy?"
                }
                ]).then(function (response) {
                    var respId = response.id;
                    var respUnits = response.units;
                    checkunits(respId, respUnits);
                return respId, respUnits;
                })
            }
            //__________________________function ends____________________________

        //function to show all items from bamazon in a table
        function showitems(){
            
                connection.query("SELECT * FROM products", function (err, res) {
                    if (err) throw err;
                    var temp = Object.keys(res[0]);
                    var table = new Table({ head: temp });
                    
                    for (var i=0; i<res.length; i++){
                    table.push( [ res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity, res[i].product_sales] );
                    }
                    console.log(table.toString());           
                })
        
            }
            //_____________________function ends_______________________________

        //function to check if there is enough product in stock
            function checkunits(id,units){
                        var temp3= (parseInt(id)-1);
                
                connection.query("SELECT * FROM products", function (err, res) {
                    if (err) throw err;
                    if(res[temp3].stock_quantity<units){
                        console.log("Insuficient quantity in stock");
                        startover();
                    }else{
                        var subt2=units*res[temp3].price;
                        var instock = res[temp3].stock_quantity;                
                        updateDatabase(id,units,instock,subt2);
                    }


            })
        }
        //________________________function ends __________________________________

        //function to update database with purchase and show final console logs

        function updateDatabase(id,units,instock, subt2){
            console.log("units requested by user: "+units+ " units in stock: " +instock);
            var subt1= (instock-units);
            console.log("so total updated in stock: "+ subt1);
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                {
                    stock_quantity: subt1,
                    product_sales: subt2
                },
                {
                    item_id: id
                }
                ],function(err, res) {
                    console.log(res.affectedRows + " database updated!\n");
                    console.log("Your total cost of your purchase: $"+ subt2);
                    startover();
                });
        }
        
            function startover(){
                inquirer.prompt(
                    {
                    type: "list",
                    name: "choice",
                    message: "Would you like to continue shopping?",
                    choices: ["yes", "no"]
                    },
                ).then(function (response) {
                        if(response.choice==="yes"){
                            showitems();
                            setTimeout(firstprompt,1500);

                        }else{
                            console.log("Thanks for using Bamazon!");
                            connection.end();
                        }

            })
        }