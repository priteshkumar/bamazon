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
  
  showProductInfo();
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

  
  

}*/




function checkForexit(){
  inquire.prompt([{
    name:"userchoice",
    type:"confirm",
    message:"Do you want to continue shopping"
  }]).then(function(answers){
    //console.log(answers.userchoice);
    if(answers.userchoice === true){
      showProductInfo();
    }
    else{
      console.log("exiting the bamazon store!!!");
      dbConnection.end();
    }
  });
}




function showProductInfo() {
  console.log("Here are the products available in store\n");
  var sqlquery = "select item_id,product_name,department_name,price from products";
  dbConnection.query(sqlquery, function (err, result,fields) {
    if (err) throw err;

    for(var i=0;i < result.length;i++){
    console.log("Item_id: " + result[i].item_id + " || Product: " + result[i].product_name + 
                " || Department: " + result[i].department_name + " || Price: " + result[i].price);
    
  }
   console.log("\n");
   startApp();
  });

}





function updateProductamount(product_id,stockquantity,price,quantity){
  //console.log(stockquantity + ": " + quantity);
  var sqlquery = "update products set ? where ?";
  dbConnection.query(sqlquery, [{stock_quantity:stockquantity - quantity},
                    {item_id:product_id}], function (err, result) {
    if (err) throw err;

    //console.log(result);
    console.log("Your total purchase amount is: " + price * quantity + "$" + "\n");
    console.log("Have a nice time ahead\n");
    checkForexit();
 });

}




function validateProductamount(product_id,quantity){
  var sqlquery = "select price,stock_quantity from products where ?";
  dbConnection.query(sqlquery, {item_id:product_id}, function (err, result) {
    if (err) throw err;

    //console.log("user demand: " + quantity);
    for(var i=0;i < result.length;i++){
      //console.log(result[i].stock_quantity);
      if(result[i].stock_quantity < quantity){
       console.log("\nSorry , store doesnt have required quantity of the product !!!\n");
       checkForexit();
      }
      else{
        console.log("fulfilling user order!!!");
        updateProductamount(product_id,result[i].stock_quantity,result[i].price,quantity);
      }
  }

 });

}


function startApp(){

   inquire.prompt([{
    name:"productid",
    type:"input",
    message:"Select product id which you want to buy",
    validate: function(value) {
          if (isNaN(value) === false && value >=1 && value <= 10) {
            return true;
          }
          return false;
        }
 
   }]).then(function(answers){       
    
          var productid = parseInt(answers.productid);
          inquire.prompt([{
            name:"quantity",
            type:"input",
            message:"How many of the product with id " + answers.productid + " you want to buy?",
            validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
         }
   
        }]).then(function(answers){
        //     console.log("validate user demand");
             validateProductamount(productid,parseInt(answers.quantity));
               
          });           
      
       });
       
   

}


