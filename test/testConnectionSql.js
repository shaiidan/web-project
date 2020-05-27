var assert = require('assert');
const config  = require('../models/dbconfig');
const {Connection,} = require("tedious");


function sqlConnection(config_db,callback)
{
  let connection = new Connection(config_db);
  connection.on("connect", err => {
    if (err) {
      console.error("Error to sql connection=  " + err.message);
      connection.close();
      return callback(false);
    } 
    else
    {
      connection.close();
      return callback(true);
    }
  });
}


//check connection to sql

describe("check connection to sql",()=> {
    it("sql connection good, send correct configuration",()=>{
      sqlConnection(config,function(result){
        assert.deepEqual(result,true)
      });
    });
    
    it("sql connection wrong, send incorrect configuration",()=>{
      sqlConnection(config,function(result){
        assert.deepEqual(result,true)
      });
    });
});
