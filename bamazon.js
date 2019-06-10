var mysql = require("mysql")
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

var items = [];
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("connected as id " + connection.threadId);
    disProduct()
});


//Displays products 
function disProduct() {

    connection.query('SELECT * FROM Products', function (err, res) {

        for (var i = 0; i < res.length; i++) {
            items.push(
                [res[i].item_id,
                res[i].product_name,
                res[i].price,
                res[i].stock_quantity]
            )
        }
        console.log(items.toString());

        // inquire for products 
        inquirer.prompt([{
            // choose a product 
            name: "choice",
            type: "list",
            message: "What would you like to buy?",


            choices: function (value) {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].product_name);
                }
                return choiceArray;
            }
        }, {
            // Enter a quantity 
            name: "quantity",
            type: "input",
            message: "How many to buy?",

        }]).then(function (answer) {
            // 
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name == answer.choice) {
                    var chosenItem = res[i];
                    var selQuery = "SELECT * FROM products WHERE item_id = " + chosenItem
                    connection.query(selQuery, function (err, response) {
                        if (err) {
                            console.log("There was an error.");
                            
                        } else {

                            if (response.stock_quantity > quantity) {
                                console.log(`item in stock!`)
                                var balQuantity = response.stock_quantity - quantity
                                var price = quantity * response.price
                                var newSales = response.product_sales + price
                                var updateQuery = "UPDATE products SET stock_quantity = " + (productInfo.stock_quantity - quantity) + " WHERE item_id = " + item
                                connection.query(updateQuery, function (err, response) {
                                    if (err) {
                                        console.log("Quantity update failed.");
                                        
                                    } else {
                                        console.log("product quantity updated!");
                                    }
                                });
                            }
                        }
                    })
                }
            }
        };



