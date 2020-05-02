const { Connection, Request } = require("tedious");
const dbConfig = require ('./dbconfig');

config.options.trustServerCertificate = true;



module.exports = function checkEmailAndId(email, id){

    const connection = new Connection(dbConfig);
    connection.connect();

    connection.on("connect", err => {
        if (err) {
          console.error(err.message);
        } else {
          queryDatabase();
        }
      });
      
    function queryDatabase() {
        console.log("Reading rows from the Table...");
        
        // Read all rows from table
        const request = new Request( 
          `SELECT * FROM StudentUser, ApartmentOwnerUser WHERE ApartmentOwnerUser.EmailAddress=('${email}') OR ApartmentOwnerUser.ID=('${id}') OR StudentUser.EmailAddress=('${email}') OR StudentUser.ID=('${id}')`,
          (err, rowCount) => {
            if (err) {
              console.error(err.message);
            } else {
              console.log(`${rowCount} row(s) returned`);
              
              if(rowCount != 0){
                return false;
                }
            }
          } 
        )    
        connection.execSql(request);
    }
    

    return true;
}