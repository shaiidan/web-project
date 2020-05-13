/* eslint-disable no-unused-vars */
const { Connection, Request } = require("tedious");
const Order = require("./Order")
// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "samiroom", 
      password: "Lucas2020"
    },
    type: "default"
  },
  server: "samiroom.database.windows.net", 
  options: {
    database: "samiroomDB",
    encrypt: true,
    enableArithAbort: true,
    rowCollectionOnRequestCompletion:true,
    trustServerCertificate: true,
  }
};
class Orders
{
  static getFilteredTable(apartmentOwnerId, startDate, endDate, location, numberOfRooms, fromPrice, unitTypes, orderNumber, callback){
    var months = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12" ]; 
    
    
    if(location == "' '")
      location='b.city';  

    if(fromPrice == " ")  
      fromPrice= parseFloat(0);
    
    if(orderNumber == " ")  
      orderNumber='a.orderNumber';   
      
    if(unitTypes == "' '")  
      unitTypes ='b.unitTypes';
    
    if(startDate=="''")
      startDate= "'1990-10-01'";  
   
    if(endDate=="''")
      endDate= "'2050-01-01'";   
    
    console.log('startDate:' +startDate+  ', endDate:' +endDate);

      let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) {
          console.error(err.message);
        } else {
    
        const request = new Request( 
            `SELECT a.orderNumber, a.unitID, b.unitTypes, b.city, b.numberOfrooms, a.startOrder, a.endOrder, a.totalPrice, s.FullName, s.EmailAddress, c.count
            FROM [dbo].[Order] AS a , RentalHousingUnit AS b, StudentUser as s, (SELECT unitID, count(*) as count
                                                                                FROM [dbo].[Order] 
                                                                                GROUP BY unitID) AS c
            WHERE a.unitID = c.unitID AND a.status=1 AND b.numberOfrooms >= `+numberOfRooms+` 
             AND a.unitID=b.unitId AND a.totalPrice  >= `+fromPrice+` 
            AND b.city = `+location+`  AND b.unitTypes = `+unitTypes+` AND a.studentId = s.ID 
            AND a.orderNumber = `+orderNumber+` AND
            (a.startOrder>=` +startDate+ `AND a.endOrder <= ` +endDate+`) AND a.apartmentOwnerId = ` + apartmentOwnerId,
          (err, rowCount,rows) => {
            if (err) {
              console.error(err.message);
              return callback(false);
            } 
            else {
              console.log(`${rowCount} row(s) returned`);
              connection.close();
              var orders =[];
              rows.forEach(element => {
                var orderNumber, unitID, unitTypes, city, numberOfrooms, startOrder, endOrder, totalPrice, FullName, EmailAddress, numberOfTimes , totalIncome;
                element.forEach(column =>{
                  switch(column.metadata.colName)
                  {
                    case 'count': 
                    {
                      numberOfTimes = column.value;
                      break;
                    }
                    case 'orderNumber': 
                    {
                      orderNumber = column.value;
                      break;
                    }
                    case 'unitID': 
                    {
                      unitID = column.value;
                      break;
                    }
                    case 'unitTypes': 
                    {
                      unitTypes = column.value;
                      break;
                    }
                    case 'city': 
                    {
                      city = column.value;
                      break;
                    }
                    case 'numberOfrooms': 
                    {
                      numberOfrooms = column.value;
                      break;
                    }
                    case 'startOrder': 
                    {
                      startOrder =  String(column.value.getDate()+'/'+months[column.value.getMonth()]+'/'+ column.value.getFullYear()) ;                
                      break;
                    }
                    case 'endOrder': 
                    {
                      endOrder = String(column.value.getDate()+'/'+months[column.value.getMonth()]+'/'+ column.value.getFullYear());
                      break;
                    }                      
                    case 'totalPrice': 
                    {
                      totalPrice = column.value;
                      break;
                    }    

                    case 'FullName': 
                    {
                      FullName = column.value;
                      break;
                    }       
                    
                    case 'EmailAddress': 
                    {
                      EmailAddress = column.value;
                      break;
                    }                                     
                  }// end of switch 
                });
                console.log(numberOfTimes);
                var order = new Order(orderNumber, unitID, unitTypes, city, numberOfrooms, startOrder, endOrder, totalPrice, FullName, EmailAddress, numberOfTimes);
                  orders.push(order); 
              });
              return callback(orders);
            }
          });
        connection.execSql(request);
      }
    }); 
  }



  static getOrders(apartmentOwnerId,callback)
  {
    console.log("in get orders");
      let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) {
          console.error(err.message);
        } else {
        const request = new Request( 
            `SELECT a.orderNumber, a.unitID, b.unitTypes, b.city, b.numberOfrooms, a.startOrder, a.endOrder, a.totalPrice, s.FullName, s.EmailAddress, c.count
            FROM [dbo].[Order] AS a, RentalHousingUnit AS b, StudentUser as s, (SELECT unitID, count(*) as count
                                                                                  FROM [dbo].[Order] 
                                                                                  GROUP BY unitID) AS c
            WHERE a.unitID = c.unitID AND a.status=1 AND a.unitID=b.unitId AND a.studentId = s.ID AND a.apartmentOwnerId = ` + apartmentOwnerId,
          (err, rowCount,rows) => {
            if (err) {
              console.error(err.message);
              return callback(false);
            } 
            else {
              console.log(`${rowCount} row(s) returned`);
              connection.close();
              var orders =[];
              rows.forEach(element => {
                var months = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12" ];
                var orderNumber, unitID, unitTypes, city, numberOfrooms, startOrder, endOrder, totalPrice, FullName, EmailAddress, numberOfTimes, totalIncome;
                element.forEach(column =>{
                  switch(column.metadata.colName)
                  {
                    case 'count': 
                    {
                      numberOfTimes = column.value;
                      break;
                    }
                    case 'orderNumber': 
                    {
                      orderNumber = column.value;
                      break;
                    }
                    case 'unitID': 
                    {
                      unitID = column.value;
                      break;
                    }
                    case 'unitTypes': 
                    {
                        unitTypes = column.value;
                      break;
                    }
                    case 'city': 
                    {
                        city = column.value;
                      break;
                    }
                    case 'numberOfrooms': 
                    {
                        numberOfrooms = column.value;
                      break;
                    }
                    case 'startOrder': 
                    {
                        startOrder =  String(column.value.getDate()+'/'+months[column.value.getMonth()]+'/'+ column.value.getFullYear()) ;

                      break;
                    }
                    case 'endOrder': 
                    {
                      endOrder = String(column.value.getDate()+'/'+months[column.value.getMonth()]+'/'+ column.value.getFullYear());
                      break;
                    }                    
                    case 'totalPrice': 
                    {
                        totalPrice = column.value;
                        totalIncome += totalPrice; 
                      break;
                    }    

                    case 'FullName': 
                    {
                      FullName = column.value;
                      break;
                    }       
                    
                    case 'EmailAddress': 
                    {
                      EmailAddress = column.value;
                      break;
                    }                                     
                  }// end of switch 
                });

                  var order = new Order(orderNumber, unitID, unitTypes, city, numberOfrooms, startOrder, endOrder, totalPrice, FullName, EmailAddress, numberOfTimes);
                  orders.push(order); 
              });
              return callback(orders);
            }
          }
        );
        connection.execSql(request);
      }
    }); 
  }
} // end of class

module.exports = Orders;
