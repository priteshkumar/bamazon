var mysqlob = require("mysql");
var inquire = require("inquirer");

var dbConnection = mysqlob.createConnection({
  host: "127.0.0.1",
  port:3306,
  user: "root",
  password: "mavpks",
  database:"bamazon"
});


dbConnection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!" + " " + dbConnection.threadId );
  startApp();
  
});






/*
function postItem(product_name,department_name,price,stock_quantity){
    var values = [
    [item_name,category,starting_bid,highest_bid]
  ];
  var query = dbConnection.query(
    "INSERT INTO auctions (item_name, category,starting_bid,highest_bid) values ?", [values], function(err, res) {
      if(err) {
        console.log(err);
      }
      console.log(res);
      dbConnection.end();    
    });

  
  

}

*/


function checkForexit(){
  inquire.prompt([{
    name:"userchoice",
    type:"confirm",
    message:"Do you want to continue managing store?"
  }]).then(function(answers){
    //console.log(answers.userchoice);
    if(answers.userchoice === true){
      startApp();
    }
    else{
      console.log("exiting the bamazon store!!!");
      dbConnection.end();
    }
  });
}




function showProductInfo(lowInventory) {
  var sqlquery = null;
  console.log("show all the items in store");
  if(lowInventory === true){
    console.log("here are the low inventory product details");
    sqlquery = "select * from products where stock_quantity < 5";

  }
  else{
   console.log("Here are the products available in store\n");
    sqlquery = "select * from products";
  }

  dbConnection.query(sqlquery, function (err, result,fields) {
    if (err) throw err;

    for(var i=0;i < result.length;i++){
    console.log("Item_id: " + result[i].item_id + " || Product: " + result[i].product_name + 
                " || Department: " + result[i].department_name + " || Price: " + result[i].price + 
                " || Stock_Quantity: " + result[i].stock_quantity);
    
  }
   console.log("\n");
  checkForexit();
  });

}






function updateProductamount(product_name,quantity){
  //console.log(stockquantity + ": " + quantity);
  var stockquery = "select stock_quantity from products where?";
  dbConnection.query(stockquery, {product_name:product_name},
                     function (err, result) {
    if (err) throw err;
    var sqlquery = "update products set ? where ?";
    dbConnection.query(sqlquery, [{stock_quantity:result[0].stock_quantity + quantity},
                    {product_name:product_name}], function (err, result) {
    if (err) throw err;

    console.log(result);
    checkForexit();
  }); 
    
 });
  
}




function getProductlist(){

  var sqlquery = "select product_name from products";
  dbConnection.query(sqlquery, function (err, result) {
    if (err) throw err;

    var productList = [];
    for(var i=0;i < result.length;i++){
      productList.push(result[i].product_name);
    }
    //console.log(productList);
    addInventory(productList);
  
  });  

}





function addInventory(productlist){

  inquire.prompt([{
    name:"useroption",
    type:"list",
    message:"which item you want to add?",
    choices:productlist
  }]).then(function(answers){
      var product_name = answers.useroption;
      inquire.prompt([{
        name:"product_quantity",
        type:"input",
        message:"how many of the item " + product_name + " you want to add?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
  
      }]).then(function(answers){

        updateProductamount(product_name,parseInt(answers.product_quantity));
      });
  });
}




function addNewproduct(){
  console.log("add new product");
}




function startApp(){

   inquire.prompt([{
    name:"manageoptions",
    message:"select one of the options below",
    type:"list",    
    choices:["View products for sale",
             "View low inventory",
             "Add to inventory",
             "Add new product"]
   }]).then(function(answers){       
         console.log("check option");
         if(answers.manageoptions === "View products for sale"){
            console.log("show product info");
            showProductInfo(false);
         }
         else if(answers.manageoptions === "View low inventory"){
            showProductInfo(true);
         }
         else if(answers.manageoptions === "Add to inventory"){
            //addInventory();
            getProductlist();
         }
         else if(answers.manageoptions === "Add new product"){
            addNewproduct();
         }           
      
      });
       
   

}


//startApp();