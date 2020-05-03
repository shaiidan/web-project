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


function queryDatabase(callback) {
  console.log("Reading rows from the Table...");
  //var data = [];
  const connection = new Connection(config);

  // Attempt to connect and execute queries if connection goes through
  connection.on("connect", err => {
    if (err) {
      console.error(err.message);
    } else {
       // Read all rows from table
    const request = new Request( 
      `SELECT *
      FROM RentalHousingUnit`,
      (err, rowCount,rows) => {
        if (err) {
          console.error(err.message);
          return callback(false);
        } else {
          console.log(`${rowCount} row(s) returned`);
          connection.close();
          return callback(rows);
        }
      }
    );
    connection.execSql(request);
      
    }
  }); 
}

queryDatabase(function(result){
  
});