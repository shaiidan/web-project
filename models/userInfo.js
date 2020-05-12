/* eslint-disable no-unused-vars */
const alert = require("alert-node");

const { Connection, Request } = require("tedious");
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
class User
{
    constructor(FullName, ID, EmailAddress, PhoneNumber)
    {
      console.log("IN CONSTRACTOR");
        this.ID = ID;
        this.PhoneNumber = PhoneNumber;
        this.FullName = FullName;
        this.EmailAddress = EmailAddress;
        console.log(ID);
    }

    static getStudentUserInfo(ID, callback){
        let connection = new Connection(config);
        connection.on("connect", err => {
            if (err) {
              console.error(err.message);
            } else {
                const request = new Request(
                    `SELECT ID, FullName, PhoneNumber, EmailAddress
                    FROM [dbo].[StudentUser]
                    WHERE ID ='`+ID+`'`,
                    (err, rowCount,rows) => {
                        if (err) {
                          console.error(err.message);
                          return callback(false);
                        } else {
                          console.log(`${rowCount} row(s) returned`);
                          var studentUserInfo= [];
                           rows.forEach(element => {
                            var  ID, PhoneNumber, FullName, EmailAddress;
                            element.forEach(column =>{
                              switch(column.metadata.colName)
                              {
                                case 'ID': 
                                {
                                    ID = column.value;
                                  break;
                                }       
                                
                                case 'PhoneNumber': 
                                {
                                    PhoneNumber = column.value;
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
                            var user = new User(FullName, ID, EmailAddress, PhoneNumber)
                            studentUserInfo.push(user);
                        });   
                        return callback(studentUserInfo);
                    }
                });

                connection.execSql(request);              
            }
         
        });
    }


    
    static updateStudentUserInfo(ID, FullName, PhoneNumber, callback){

      let connection = new Connection(config);
      connection.on("connect", err => {
          if (err) {
            console.error(err.message);
          } else {
              const request = new Request(
                  `UPDATE [dbo].[StudentUser]
                  SET FullName = '`+ FullName+`', PhoneNumber ='`+ PhoneNumber+`'
                  WHERE ID ='`+ID+`'`,
                  (err, rowCount) => {
                    if (err) {
                      console.error(err.message);
                      connection.close();
                      return callback(false);
                      
                    } else {
                      connection.close();
                      alert("Your details have been successfully updated.");
                      User.getStudentUserInfo(ID, callback);
                    }
                  }
                );
                connection.execSql(request);
            }
          });
        }
      

  static getapartmentOwnerUserrInfo(ID, callback){

    console.log(ID);
    let connection = new Connection(config);
    connection.on("connect", err => {
        if (err) {
          console.error(err.message);
        } else {
            const request = new Request(
                `SELECT ID, FullName, PhoneNumber, EmailAddress
                FROM [dbo].[ApartmentOwnerUser]
                WHERE ID ='`+ID+`'`,
                (err, rowCount,rows) => {
                    if (err) {
                      console.error(err.message);
                      return callback(false);
                    } else {
                      console.log(`${rowCount} row(s) returned`);
                      var apartmentOwnerUserInfo= [];
                        rows.forEach(element => {
                        var  ID, PhoneNumber, FullName, EmailAddress;
                        element.forEach(column =>{
                          switch(column.metadata.colName)
                          {
                            case 'ID': 
                            {
                                ID = column.value;
                              break;
                            }       
                            
                            case 'PhoneNumber': 
                            {
                                PhoneNumber = column.value;
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
                        console.log(ID, FullName, PhoneNumber, EmailAddress);
                        var user = new User(FullName, ID, EmailAddress, PhoneNumber)
                        apartmentOwnerUserInfo.push(user);
                    });   
                    return callback(apartmentOwnerUserInfo);
                }
            });

            connection.execSql(request);              
        }
      
    });
}



static updateapartmentOwnerUserInfo(ID, FullName, PhoneNumber, callback){

  let connection = new Connection(config);
  connection.on("connect", err => {
      if (err) {
        console.error(err.message);
      } else {
          const request = new Request(
              `UPDATE [dbo].[ApartmentOwnerUser]
              SET FullName = '`+ FullName+`', PhoneNumber ='`+ PhoneNumber+`'
              WHERE ID ='`+ID+`'`,
              (err, rowCount) => {
                if (err) {
                  console.error(err.message);
                  connection.close();
                  return callback(false);
                  
                } else {
                  connection.close();
                  alert("Your details have been successfully updated.");
                  User.getapartmentOwnerUserrInfo(ID, callback);
                }
              }
            );
            connection.execSql(request);
        }
      });
    }        
}
module.exports = User;