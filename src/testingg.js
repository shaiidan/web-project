const mysql = require('mysql')

const config = {
    host: 'samiroom.database.windows.net', 
    user: 'samiroom',
    password: 'Lucas2020',
    database: 'samiroomDB',
    encrypt: true,
    enableArithAbort: true
};

const connection = mysql.createConnection(config);

function get_info(callback){

    var sql = "SELECT * from RentalHousingUnit";

    connection.query(sql, function(err, results, fields){
          if (err){ 
            console.log(err.message);
            return callback(false);
          }
          return callback(results);
  });
  connection.end();
};

//usage

var stuff_i_want = '';

get_info(function(result){
  stuff_i_want = result;
  console.log(stuff_i_want);
});

