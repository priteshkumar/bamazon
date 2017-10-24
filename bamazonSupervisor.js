var mysqlob = require("mysql");
var inquire = require("inquirer");
var easytable = require("easy-table");

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
    message:"Do you want to continue supervising store?"
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




function showProductsalestats() {

  console.log("show product sales stats");
  var  sqlquery = "select departments.department_id,departments.department_name,departments.over_head_costs, \
                   sum(products.product_sales) as product_sales from departments \
                   inner join products on departments.department_name=products.department_name \
                   group by departments.department_id";
  
  dbConnection.query(sqlquery, function (err, result,fields) {
    if (err) throw err;

    var tbl = new easytable();

    for(var i=0;i < result.length;i++){
    var res = JSON.stringify(result[i]);   
    var resl = JSON.parse(res);
     tbl.cell("Department_id",resl.department_id);
     tbl.cell("Department_name",resl.department_name);
     tbl.cell("Over_head_costs",resl.over_head_costs);
     tbl.cell("Product_sales",resl.product_sales);
     tbl.cell("Total_profit",resl.product_sales - resl.over_head_costs,easytable.number(2));
     tbl.newRow();
  }
   //console.log("\n");
  console.log(tbl.toString());
  checkForexit();
  });

}




function startApp(){

   inquire.prompt([{
    name:"superviseoptions",
    message:"select one of the options below",
    type:"list",    
    choices:["View Product sales by department",
             "Create department"
            ]
   }]).then(function(answers){       
         console.log("check option");
         if(answers.superviseoptions === "View Product sales by department"){
            console.log("show product sales stats");
            showProductsalestats();
         }
         else if(answers.superviseoptions === "Create department"){
             console.log("add new department");
         }
                    
      
      });
       
   

}


//startApp();
