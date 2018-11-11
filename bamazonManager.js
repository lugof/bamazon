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
        choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product", "Exit"]
    }
   ).then(function (response) {
    switch (response.menu){
        case "View products for sale":
        showitems();
        setTimeout(managerPrompt,1500);
        break;

        case "Exit":
        console.log("Manager session Finished!");
        connection.end();
        break;
        
        case "View low inventory":
        lowInventory();
        setTimeout(managerPrompt,1500);
        break;

        case "Add to inventory":
        selectItems();
        break;
        
        case "Add new product":
        addProduct();
        break;
    }
})
}

function showitems(){
            
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var temp = Object.keys(res[0]);
        var table = new Table({ head: temp });
        
        for (var i=0; i<res.length; i++){
        table.push( [ res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity] );
        }
        console.log(table.toString());           
    })

}

function lowInventory(){

    connection.query("SELECT * FROM products WHERE stock_quantity<5", function (err, res) {
        if (err) throw err;
        var temp = Object.keys(res[0]);
        var table = new Table({ head: temp });
        
        for (var i=0; i<res.length; i++){
        table.push( [ res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity] );
        }
        console.log(table.toString());       
        return;    
    })
}

function selectItems(){
    inquirer.prompt([{
        type: "input",
        name: "id",
        message: "Type the ID of the product you would like to add inventory"
    },
    {
        type: "input",
        name: "units",
        message: "how many units of the product would you like to add?"
    }
    ]).then(function (response) {
        var respId = response.id;
        var respUnits = response.units;
       addInventory( respId, respUnits);
    })}


       function addInventory(respId,respUnits){
        connection.query(
                `UPDATE products SET stock_quantity = stock_quantity + ${respUnits}  WHERE ?`,
                  {
                    item_id: respId
                  }
                ,
            function(err, res) {
              console.log(res.affectedRows + " database updated!\n");
                setTimeout(managerPrompt,1500);
            }
          );
          
    }


    function addProduct(){
        inquirer.prompt([{
            type: "input",
            name: "name",
            message: "Type the product name: "
        },
        {
            type: "input",
            name: "department",
            message: "type the department which this product belongs: "
        },
        {
            type: "input",
            name: "price",
            message: "type the price per unit of this product: "
        },
        {
            type: "input",
            name: "stock",
            message: "type the stock quantity you are adding to inventory: "
        }
        ]).then(function (res) {
          


           updateNewproduct( res.name, res.department,res.price, res.stock);
        })
    }


    function updateNewproduct(name,dep,price,stock){
        connection.query(
            "INSERT INTO products SET ?",
            {
              product_name: name,
              department_name: dep,
              price: price,
              stock_quantity: stock

            },
            function(err, res) {
              console.log(res.affectedRows + " product inserted!\n");
              // Call updateProduct AFTER the INSERT completes
              setTimeout(managerPrompt,1500);
            }
          );

    }