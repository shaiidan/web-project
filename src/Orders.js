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
  static getFilteredTable(apartmentOwnerId, startDate, endDate,location, numberOfRooms, fromPrice, unitTypes, orderNumber, callback){
     console.log(apartmentOwnerId, startDate, endDate,location, numberOfRooms, fromPrice, unitTypes, orderNumber);
      console.log("in getFilteredTable function");
    //   let connection = new Connection(config);
    //   connection.on("connect", err => {
    //     if (err) {
    //       console.error(err.message);
    //     } else {
    //     const request = new Request( 
    //         `SELECT a.orderNumber, a.unitID, b.unitTypes, b.city, b.numberOfrooms, a.startOrder, a.endOrder, a.totalPrice, s.FullName, s.EmailAddress
    //         FROM [dbo].[Order] AS a , RentalHousingUnit AS b, StudentUser as s
    //         WHERE a.unitID=b.unitId AND a.studentId = s.ID AND b.city = b.city AND a.apartmentOwnerId = ` + apartmentOwnerId,
    //       (err, rowCount,rows) => {
    //         if (err) {
    //           console.error(err.message);
    //           return callback(false);
    //         } 
    //         else {
    //           console.log(`${rowCount} row(s) returned`);
    //           connection.close();
    //           var orders =[];
    //           rows.forEach(element => {
    //             var orderNumber, unitID, unitTypes, city, numberOfrooms, startOrder, endOrder, totalPrice, FullName, EmailAddress;
    //             element.forEach(column =>{
    //               switch(column.metadata.colName)
    //               {
    //                 case 'orderNumber': 
    //                 {
    //                   orderNumber = column.value;
    //                   break;
    //                 }
    //                 case 'unitID': 
    //                 {
    //                   unitID = column.value;
    //                   break;
    //                 }
    //                 case 'unitTypes': 
    //                 {
    //                     unitTypes = column.value;
    //                   break;
    //                 }
    //                 case 'city': 
    //                 {
    //                     city = column.value;
    //                   break;
    //                 }
    //                 case 'numberOfrooms': 
    //                 {
    //                     numberOfrooms = column.value;
    //                   break;
    //                 }
    //                 case 'startOrder': 
    //                 {
    //                     startOrder = column.value;
    //                   break;
    //                 }
    //                 case 'endOrder': 
    //                 {
    //                     endOrder = column.value;
    //                   break;
    //                 }                    
    //                 case 'totalPrice': 
    //                 {
    //                     totalPrice = column.value;
    //                   break;
    //                 }    

    //                 case 'FullName': 
    //                 {
    //                   FullName = column.value;
    //                   break;
    //                 }       
                    
    //                 case 'EmailAddress': 
    //                 {
    //                   EmailAddress = column.value;
    //                   break;
    //                 }       
    //                 EmailAddress     
                              
    //               }// end of switch 
    //             });
    //               var order = new Order(orderNumber, unitID, unitTypes, city, numberOfrooms, startOrder, endOrder, totalPrice, FullName, EmailAddress);
    //               orders.push(order); 
    //           });
    //           return callback(orders);
    //         }
    //       }
    //     );
    //     connection.execSql(request);
    //   }
    // }); 
  }



  static getOrders(apartmentOwnerId,callback)
  {
      let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) {
          console.error(err.message);
        } else {
        const request = new Request( 
            `SELECT a.orderNumber, a.unitID, b.unitTypes, b.city, b.numberOfrooms, a.startOrder, a.endOrder, a.totalPrice, s.FullName, s.EmailAddress
            FROM [dbo].[Order] AS a , RentalHousingUnit AS b, StudentUser as s
            WHERE a.unitID=b.unitId AND a.studentId = s.ID AND a.apartmentOwnerId = ` + apartmentOwnerId,
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
                var orderNumber, unitID, unitTypes, city, numberOfrooms, startOrder, endOrder, totalPrice, FullName, EmailAddress;
                element.forEach(column =>{
                  switch(column.metadata.colName)
                  {
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
                        startOrder = column.value;
                      break;
                    }
                    case 'endOrder': 
                    {
                        endOrder = column.value;
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
                    EmailAddress     
                              
                  }// end of switch 
                });
                  var order = new Order(orderNumber, unitID, unitTypes, city, numberOfrooms, startOrder, endOrder, totalPrice, FullName, EmailAddress);
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