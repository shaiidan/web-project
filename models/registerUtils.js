

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

class registerUtils {
  static checkEmailAndId(email, id,callback)
  {
    let connection = new Connection(config);
    connection.on("connect", err => {
        if (err) {
          console.error(err.message);
          connection.close();
          return false;
        } 
        else
        {
            const request = new Request( 
              `SELECT * FROM StudentUser, ApartmentOwnerUser WHERE ApartmentOwnerUser.EmailAddress=('${email}') OR ApartmentOwnerUser.ID=('${id}') OR StudentUser.EmailAddress=('${email}') OR StudentUser.ID=('${id}')`,
              (err, rowCount) => {
                if (err) {
                  console.error(err.message);
                  connection.close();
                  return false;
                } else {
                  console.log(`${rowCount} row(s) returned`);
                  connection.close();
                  return callback(rowCount);
                }
              }
            );
            connection.execSql(request);
        }
      });
}
}
module.exports = registerUtils;