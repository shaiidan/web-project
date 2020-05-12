const { Connection, Request } = require("tedious");
const config = require("./dbconfig");

class registerUtils
{
  static checkEmailAndId(email, id, callback)
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
                  `SELECT * FROM StudentUser, ApartmentOwnerUser WHERE ApartmentOwnerUser.EmailAddress=('${email}') OR ApartmentOwnerUser.ID=('${id}') OR StudentUser.EmailAddress=('${email}') OR StudentUser.ID=('${id}')`,
                  (err, rowCount) => {
                    if (err) {
                      console.error(err.message);
                      connection.close();
                      return callback(false);
                    } else {
                      connection.close();
                      console.log(`${rowCount} row(s) returned`);
                      if(rowCount === 0)
                        return callback(true);
                      else
                        return callback(false);
                    }}
                );
                connection.execSql(request);
            }
          });
  }
  static updateExp(email, exp, callback)
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
                `UPDATE StudentUser SET Exp = ('${exp}')  WHERE EmailAddress=('${email}')`,
                (err, rowCount) => {
                  if (err) {
                    console.error(err.message);
                    connection.close();
                    return callback(false);
                  } else {
                    connection.close();
                    console.log(`${rowCount} row(s) returned`);
                    if(rowCount === 1)
                      return callback(true);
                    else
                      return callback(false);
                  }}
              );
              connection.execSql(request);
          }
        });
}

  static addStudent(email, id, phone, name, password, validation, callback)
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
    const request =  new Request( 
      `INSERT INTO StudentUser VALUES ('${id}', '${name}', '${phone}', '${email}', '${password}','${validation}','1/1/1900')`,
      (err, rowCount) => {
        if (err) {
          console.error(err.message);
          connection.close();
          return callback(false);
          } 
          else {
          connection.close();
          if(rowCount != 0)
            return callback(true);
          else
            return callback(false);
                    }}
              );
              connection.execSql(request);
            }
   });
  }
      static addOwner(id, full_name, email, password, phone, callback){

        let connection = new Connection(config);
        connection.on("connect", err => {
        if (err) {
            console.error(err.message);
            connection.close();
            return callback(false);
            } 
        else
       {
        const request =  new Request( 
          `INSERT INTO ApartmentOwnerUser VALUES ('${id}', '${full_name}', '${email}', '${password}', '${phone}')`,
          (err, rowCount) => {
            if (err) {
              console.error(err.message);
              connection.close();
              return callback(false);
              } 
              else {
              connection.close();
              if(rowCount != 0)
                return callback(true);
              else
                return callback(false);
                        }}
                  );
                  connection.execSql(request);
              }
            });
          }
static checkEmail(email, callback)
{
  const connection1 = new Connection(config);
  connection1.on("connect", err => {
      if (err) {
        console.error(err.message);
        connection1.close();
        return false;
      } 
      else
      {
          const request1 = new Request( 
            `SELECT * FROM StudentUser, ApartmentOwnerUser WHERE ApartmentOwnerUser.EmailAddress=('${email}') OR StudentUser.EmailAddress=('${email}')`,
            (err, rowCount) => {
              if (err) {
                console.error(err.message);
                connection.close();
                return false;
              } else {
                console.log(`${rowCount} row(s) returned`);
                connection1.close();
                return callback(rowCount);
              }
            }
          );
          request1.on("row", columns => {
            columns.forEach(column => {
              console.log("%s\t%s", column.metadata.colName, column.value);
            });
          });
          connection1.execSql(request1);
      }
    });
}
static updatePassword(email, password)
{
  const connection3 = new Connection(config);
  connection3.on("connect", err => {
      if (err) {
        console.error(err.message);
        connection3.close();
        return false;
      } 
      else
      {
          const request3 = new Request( 
            `SELECT * FROM StudentUser WHERE EmailAddress=('${email}')`,
            (err, rowCount) => {
              if (err) {
                console.error(err.message);
                connection3.close();
                return false;
              } else {
                console.log(`${rowCount} row(s) returned`);
                if(rowCount == 0){
                  let connection5 = new Connection(config);
                  connection5.on("connect", err => {
                if (err) {
                  console.error(err.message);
                  connection5.close();
                  return false;
                } 
                else
              {
                const request5 = new Request( 
                `UPDATE ApartmentOwnerUser SET Password=('${password}') WHERE EmailAddress=('${email}')`,
                (err) => {
                if (err) {
                console.error(err.message);
                connection5.close();
                return false;
              } else {
                console.log(`Password updated`);
              }
            }
          );
          connection5.execSql(request5);
      }
    });
                }
                else{
                  const connection4 = new Connection(config);
                  connection4.on("connect", err => {
                      if (err) {
                        console.error(err.message);
                        connection4.close();
                        return false;
                      } 
                      else
                      {
                          const request4 = new Request( 
                            `UPDATE StudentUser SET Password=('${password}') WHERE EmailAddress=('${email}')`,
                            (err) => {
                              if (err) {
                                console.error(err.message);
                                connection4.close();
                                return false;
                              } else {
                                console.log(`password updated`);
                              }
                            }
                          );
                          connection4.execSql(request4);
                      }
                    });
                }
                connection3.close();
              }
            }
          );
          connection3.execSql(request3);
      }
    });
}
}
module.exports = registerUtils;

