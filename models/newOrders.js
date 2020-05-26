const newOrder = require("./newOrder")
const { Connection, Request } = require("tedious");
const config = require("./dbconfig");
const nodemailer = require('nodemailer');
class newOrders{  
  // update order status in DB, unit is instance of newOrder
 static updateOrderStatus(orderID, callback)
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
                  `DELETE FROM [Order]  WHERE[Order].[orderNumber] = ` +orderID+`and[Order].[status]= 0` ,
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
          `SELECT [StudentUser].[FullName] as stuFullName, [RentalHousingUnit].[unitId],[RentalHousingUnit].[city],[RentalHousingUnit].[UnitAddress],[Order].[startOrder],
          [Order].[endOrder],[Order].[totalTime], [Order].[totalPrice],[ApartmentOwnerUser].[FullName],[ApartmentOwnerUser].[PhoneNumber],[StudentUser].[ID]
          from [dbo].[Order]  join [dbo].[RentalHousingUnit]
          ON [Order].[orderNumber]=`+orderID+ `and [Order].[unitID]=[RentalHousingUnit].[unitId]
          JOIN [dbo].[StudentUser]
          ON [Order].[studentId]=[StudentUser].[ID]
          JOIN [dbo].[ApartmentOwnerUser]
          ON [Order].[unitID]=[RentalHousingUnit].[unitId] and [RentalHousingUnit].[apartmentOwnerId]=[ApartmentOwnerUser].[ID]`,
          (err, rowCount,rows) => {
            if (err) {
              console.error(err.message);
              return callback(false);
            } 
            else {
              connection.close();
              rows.forEach(element => {
                var studentFullName,unitCity,unitID,unitAddress,startOrder,endOrder,totalTime,totalPrice,ownerFullName,ownerPhoneNumber;
                element.forEach(column =>{
                  switch(column.metadata.colName)
                  {
                    case 'stuFullName': 
                    {
                      studentFullName = column.value;
                      break;
                    }
                    case 'unitId': 
                    {
                      unitID = column.value;
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
                    case 'FullName': 
                    {
                      ownerFullName = column.value;
                     
                      break;
                    }
                    case 'PhoneNumber': 
                    {
                      ownerPhoneNumber = column.value;
                      

                      break;
                    }
                    case 'ID': 
                    {
                      break;
                    }
                  }// end of switch 
                  });
                  var order1 = new newOrder(orderID,totalPrice,null,ownerFullName,ownerPhoneNumber,unitID,unitCity,unitAddress,studentFullName,null,startOrder,endOrder,totalTime,null,0,0,0);
                  return callback(order1);     
              });
            }
          }
        );
        connection.execSql(request);
      }
    }); 
  }
  static sendOwnerMail(orderID,callback)
  {
    {
      let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) {
          console.error(err.message);
          return callback(false);
        } else {
        const request = new Request( 
          `SELECT [ApartmentOwnerUser].[EmailAddress]
          FROM [RentalHousingUnit] JOIN [Order]
          ON [Order].[orderNumber]=`+orderID+ `AND [Order].[unitID]=[RentalHousingUnit].[unitId]
          JOIN [ApartmentOwnerUser]
          ON [ApartmentOwnerUser].[ID]=[RentalHousingUnit].apartmentOwnerId`,
          (err, rowCount,rows) => {
            if (err) {
              console.error(err.message);
              return callback(false);
            } 
            else {
              connection.close();
              rows.forEach(element => {
                var OwnerMail;
                element.forEach(column =>{
                  switch(column.metadata.colName)
                  {
                    case 'EmailAddress': 
                    {
                      OwnerMail = column.value;
                      let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        // port: 587,
                           // secure: false,
                        auth: {
                          user: 'samiroomgroup3@gmail.com',
                          pass: 'xnqkgdtufxhewjvb' 
                        }
                      });
                      
                        // send mail with defined transport object
                      let mailOptions = {
                        from: process.env.EMAIL_ADRESS, // sender address
                        to: OwnerMail,
                        subject: "you have a new reservation", // Subject line
                        text: "Hello you just got a new reservation, you can go to your home page and view order details.\n the order number is: "+orderID // plain text body
                      
                      };
                      
                      transporter.sendMail(mailOptions, function(err) {
                        if(err){
                          console.log(err);
                        } else{
                          console.log('email sent!');
                        }
                      });
              
                      break;
                    }
              };
              
            });
          });
        

          return callback(true);       
        }
              }    );
        connection.execSql(request);
      }
    }); 
 
  }
}

static sendStudentMail(orderID, studentID, city, UnitAddress, startOrder, endOrder, totalPrice, attr, callback)
{
  {
    var msg1 = "Congrats!!\n\nYou made a new reservation\n" + "Details - \n" + "Address -" + city + "," + UnitAddress + "\n" + "Rental period - "
    + startOrder.getDate() + "/" + (startOrder.getMonth()+1) + "/" + startOrder.getFullYear() + "   -   " + endOrder.getDate() + "/" + (endOrder.getMonth()+1) + "/" + endOrder.getFullYear() + "\n" + "at a total price of - " + totalPrice + "\n"
    var msg2 = "The attractions are:\n";
  
    let connection = new Connection(config);
    for(var i=0; i<attr.length;i++){
      msg2 +="Attraction number - " + i+1 + "\n" + "Attraction name - " + attr[i].NameAttraction + "\n" + "Discount - " + attr[i].Discount + "%" +"\n";
      
    }
    msg2+= "This is your attractions code: "+orderID+"\n";
    connection.on("connect", err => {
      if (err) {
        console.error(err.message);
        return callback(false);
      } else {
      const request = new Request( 
        `SELECT [StudentUser].[EmailAddress]
        FROM [StudentUser]
        WHERE [StudentUser].[ID]=`+studentID,
        (err, rowCount,rows) => {
          if (err) {
            console.error(err.message);
            return callback(false);
          } 
          else {
            
            connection.close();
            rows.forEach(element => {
              var StudentMail;
              element.forEach(column =>{
                switch(column.metadata.colName)
                {
                  case 'EmailAddress': 
                  {
                    StudentMail = column.value;
                    let transporter = nodemailer.createTransport({
                      service: 'gmail',
                      // port: 587,
                         // secure: false,
                      auth: {
                        user: 'samiroomgroup3@gmail.com',
                        pass: 'xnqkgdtufxhewjvb' 
                      }
                    });
                      // send mail with defined transport object
                    let mailOptions = {
                      from: process.env.EMAIL_ADRESS, // sender address
                      to: StudentMail,
                      subject: "you made a new reservation", // Subject line
                      text: msg1 + msg2
                    };
                    
                    transporter.sendMail(mailOptions, function(err) {
                      if(err){
                        console.log(err);
                      } else{
                        console.log('email sent!');
                      }
                    });
            
                    break;
                  }
            };
            
          });
        });
      

        return callback(true);       
      }
            }    );
      connection.execSql(request);
    }
  }); 

}
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
        var query =  `SET XACT_ABORT ON;
        BEGIN TRANSACTION
           DECLARE @DataID int;
           INSERT INTO [Order](unitID,apartmentOwnerId,studentId,totalPrice,startOrder,endOrder,totalTime,status)
           VALUES(`+ order.unitID+`,'`+order.apartmentOwnerId+`',
           '`+order.studentID+`',`+order.totalPrice+`,'`+order.startOrderDate+`',
           '`+order.endOrderDate+`',`+order.totalTime+`,0)
           SELECT @DataID = scope_identity();
           SELECT [Order].[orderNumber]
           from [order]
           where [Order].[orderNumber] = @DataID
        COMMIT`
          const request =  new Request( 
             query
            ,(err, rowCount,rows) => {
              if (err) {
                console.error(err.message);
                connection.close();
                return callback(false);
              } else {
                connection.close();
                if(rowCount != 0){
                  var order_number;
                  rows.forEach(element => {
                    element.forEach(column =>{
                      if(column.metadata.colName == 'orderNumber'){
                        order_number = column.value;
                      }
                    });
                  });
                  return callback(order_number);
                }
                else{
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

   
  
  static getUnitIDfromOrderID(orderId,callback)
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
            `SELECT [Order].[unitID]
            FROM [Order]
            WHERE [Order].[orderNumber] =`+orderId,
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
                return callback(number);
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
}

module.exports = newOrders;

