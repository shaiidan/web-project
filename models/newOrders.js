const newOrder = require("./newOrder")
const { Connection, Request } = require("tedious");
const condig = require("./dbconfig");

class newOrders{  
  // update order status in DB, unit is instance of newOrder
 static updateOrderStatus(orderID, callback)
  {
    var positive = 1;
        let connection = new Connection(config);       
          connection.on("connect", err => {
          if (err) {
            console.error(err.message);
            connection.close();
            return callback(false);
          } 
          else
          {
              const request = new Request( 
                  `UPDATE [Order]
                  SET [Order].[status]=1
                  WHERE [Order].[orderNumber]=` + orderID,
                (err, rowCount) => {
                  if (err) {
                    console.error(err.message);
                    connection.close();
                    return callback(false);
                    
                  } else {
                    connection.close();
                    if(rowCount != 0){
                      return callback(true);
                    } else{
                      return callback(false);
                    }
                  }
                }
              );
              connection.execSql(request);
          }
        });
      }
 
  static getNextOrderId(callback)
  {
      let connection = new Connection(config);       
        connection.on("connect", err => {
        if (err) {
          console.error(err.message);
          connection.close();
          return callback(false);
        } 
        else
        { 
            const request = new Request( 
                `SELECT IDENT_CURRENT('[dbo].[Order]')`,
              (err, rowCount,rows) => {
                if (err) {
                  console.error(err.message);
                  connection.close();
                  return callback(false);
                  
                } else {
                  connection.close();
                  if(rowCount != 0){
                    var number;
                    rows.forEach(e =>{
                      e.forEach(column =>{
                        number = column.value;
                      });
                    });
                    return callback(number+1);
                  } else{
                    return callback(false);
                  }
                }
              }
            );
            connection.execSql(request);
        }
      });   
  }

  static deleteOrder(orderID,callback)
    {
        let connection = new Connection(config);
        connection.on("connect", err => {
            if (err) {
              console.error(err.message);
              connection.close();
              return callback(false);
            } 
            else
            {
                const request = new Request( 
                    "DELETE FROM [Order]  WHERE[Order].[orderNumber] = " +orderID,
                  (err, rowCount) => {
                    if (err) {
                      console.error(err.message);
                      connection.close();
                      return  callback(false);
                    } else if (rowCount==0) {
                      console.log(`order with order number that you try to delete is now exist`);
                      connection.close();
                    }
                  }
                );
                connection.execSql(request);
            }
          });
          return callback(true);
    }
   static getOrder(orderID,callback)
    {
      let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) {
          console.error(err.message);
          return callback(false);
        } else {
        const request = new Request( 
          `SELECT [StudentUser].[FullName], [RentalHousingUnit].[unitId],[RentalHousingUnit].[UnitAddress],[Order].[startOrder],
          [Order].[endOrder],[Order].[totalTime], [Order].[totalPrice]
          from [dbo].[Order]  join [dbo].[RentalHousingUnit]
          ON [Order].[orderNumber]=`+orderID+ `and [Order].[unitID]=[RentalHousingUnit].[unitId]
          JOIN [dbo].[StudentUser]
          ON [Order].[studentId]=[StudentUser].[ID]`,
          (err, rowCount,rows) => {
            if (err) {
              console.error(err.message);
              return callback(false);
            } 
            else {
              connection.close();
              rows.forEach(element => {
                var studentFullName,unitCity,unitAddress,startOrder,endOrder,totalTime,totalPrice;
                element.forEach(column =>{
                  switch(column.metadata.colName)
                  {
                    case 'FullName': 
                    {
                      studentFullName = column.value;
                      break;
                    }
                    case 'city': 
                    {
                      unitCity = column.value;
                      break;
                    }
                    case 'UnitAddress': 
                    {
                      unitAddress = column.value;
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
                    
                    case 'totalTime': 
                    {
                      totalTime = column.value;
                      break;
                    }
                    
                    case 'totalPrice': 
                    {
                      totalPrice = column.value;
                      break;
                    }
                  }// end of switch 
                  });
                  var order1 = new newOrder(orderID,totalPrice,null,null,unitCity,unitAddress,studentFullName,null,startOrder,endOrder,totalPrice,null,0,0,0);
                  return callback(order1);     
              });
            }
          }
        );
        connection.execSql(request);
      }
    }); 
  }
  static addOrder(order,callback)
  {
    if (order instanceof newOrder)
    {
      let connection = new Connection(config);
      connection.on("connect", err => {
      if (err) {
        console.error(err.message);
        connection.close();
        return callback(false);
      } 
      else
      {
        var query =  `INSERT INTO [Order](unitID,apartmentOwnerId,studentId,totalPrice,startOrder,endOrder,totalTime,status)
        VALUES(` +
        order.unitID + ",'"
        + order.apartmentOwnerId +"','"+ order.studentID +"'," + order.totalPrice + ",'" +
        order.startOrderDate + "','" + order.endOrderDate + "'," + order.totalTime +
        "," + 0 + ")";
          const request =  new Request( 
             query
            ,(err, rowCount) => {
              if (err) {
                console.error(err.message);
                connection.close();
                return callback(false);
              } else {
                connection.close();
                if(rowCount != 0){
                  return callback(true);
                } else{
                  return callback(false);
                }
              }
            }
          );
          connection.execSql(request);
      }
    });
  }
  else{
    return callback(false);
  }
    }
   
  }

module.exports = newOrders;