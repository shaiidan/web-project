const RentalHousingUnit = require("./RentalHousingUnit");
const { Connection, Request } = require("tedious");
const config = require("./dbconfig");
const Attraction = require("./Attraction");

module.exports = class RentalHousingUnits
{
    static deleteUnit(unit_id,callback) // delete unit -> change the status
    {
      let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) { connection.close(); console.error("Error sql in delete: " + err.message); return callback(false);}
        else {
          const request = new Request( 
            "UPDATE RentalHousingUnit SET UnitStatus = 'deleted' WHERE UnitId= " +unit_id,
            (err, rowCount) => {
              connection.close();
              if (err) { console.error("Error in delete: " + err.message);  return callback(false);}
              else {
                if(rowCount != 0) { return callback(true); }
                return callback(false); 
              }}); // close build request object 
            connection.execSql(request); 
          }}); // close build connection object
    }// end function deleteUnit

    // change status to unit. 
    //codeStatus = 0 -> the unit in the order process, codeStatus = 1 -> the unit is available
    static isChangeStatusForOrder(unit_id,codeStatus,callback)
    {
      var status = null;
      switch(codeStatus) {
        case 0: {status = 'Order process'; break;}
        case 1: {status = 'available'; break;}
        default: {status = null; break;}
      }
      if(status != null) {
        let connection = new Connection(config);
        connection.on("connect", err => {
          if (err) { connection.close(); console.error("Error sql in change status: " + err.message); return callback(false);}
          else {
              const request = new Request( 
                  "UPDATE RentalHousingUnit SET UnitStatus = '"+status+"' WHERE unitId= " +unit_id,
                (err, rowCount) => {
                  connection.close();
                  if (err) { console.error("Error sql in change status: " + err.message); return callback(false);}
                  else {
                    if(rowCount != 0) {return callback(true);}
                    return callback(false);
                  }}); // close build request object 
              connection.execSql(request);
          }}); // close build connection object
      }
      else { return callback(false); } // status = null
    } // end function isChangeStatusForOrder
    
    static updateUnit(unit, callback) // update the unit , unit - is the instance of RentalHousingUnit
    {
        if(unit instanceof RentalHousingUnit) {
          let connection = new Connection(config);       
            connection.on("connect", err => {
              if (err) { connection.close(); console.error("Error sql in update: " + err.message); return callback(false);}
              else {
                const request = new Request( 
                    `UPDATE RentalHousingUnit
                     SET pricePerMonth =` +unit.PricePerMonth +
                     ',MinRentalPeriod =  '+ unit.MinRentalPeriod +
                     ',MaxRentalPeriod =  '+ unit.MaxRentalPeriod +
                     ",pictures =  '"+ unit.Pictures +
                     "',descriptionApartment =  '"+ unit.DescriptionApartment +
                     "' WHERE unitid = " + unit.UnitID,
                  (err, rowCount) => { 
                    connection.close();
                    if (err) { console.error("Error sql in update: " + err.message); return callback(false);}
                    else {
                      if(rowCount != 0) { return callback(true); }
                      return callback(false); 
                    }});// close build request object 
                connection.execSql(request);
            }}); // close build connection object 
        }
        else { return callback(false); }
    } // end function updateUnit

    static addUnit(unit,attractions,callback) // add unit to DB, unit is instance of RentalHousingUnit
    {
      if(unit instanceof RentalHousingUnit && attractions instanceof Array){
        var add_attractions = "";
        for(var i=0; i< attractions.length; i++) { // for attractions
          if(attractions[i] instanceof Attraction) {
              add_attractions+= `INSERT into Attraction(attractionName,unitID,discount,distance,description,pictures)
              VALUES('`+attractions[i].NameAttraction+`',@DataID,`+ attractions[i].Discount +`,'`
               +attractions[i].DrivingDistance +`','`+attractions[i].Description+`','`+attractions[i].Pictures+ `')\n`;
            }
        }    
        let connection = new Connection(config);
        connection.on("connect", err => {
          if (err) { connection.close(); console.error("Error sql in add: " +err.message); return callback(false); }
          else{
              const query = `SET XACT_ABORT ON;
              BEGIN TRANSACTION
                 DECLARE @DataID int;  
                 insert into RentalHousingUnit(apartmentOwnerId,city,UnitAddress,pricePerMonth,unitTypes,
                 minRentalPeriod,maxRentalPeriod,pictures,numberOfrooms,descriptionApartment)
                 values (` + unit.ApartmentOwnerId + ",'" + unit.City + "','" + unit.Adderss +"',"+ unit.PricePerMonth +",'" + unit.UnitTypes + "'," +
                 unit.MinRentalPeriod + ',' + unit.MaxRentalPeriod + ",'" + unit.Pictures + "'," + unit.NumberOfRooms + ",'" + unit.DescriptionApartment + `')
                 SELECT @DataID = scope_identity();  ` + add_attractions +    
              `COMMIT`;
                const request =  new Request( query ,(err, rowCount) => {
                  connection.close();
                  if (err) { console.error("Error sql in add: " +err.message); return callback(false); }
                    else {
                      if(rowCount != 0) { return callback(true); }
                      return callback(false); 
                    }}); // close build request object
                connection.execSql(request);
            }}); // close build connection object
        }
        else { return callback(false);}
    }// end function addUnit
    
    static getAvailableUnits(start_date,end_date,min_period,filter_query,callback) // get units for students
    {
      let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) { connection.close(); console.error("Error sql in availabile units: " +err.message); return callback(false); }
        else {
          const request = new Request( 
          `select DISTINCT u.[unitId],u.[apartmentOwnerId],u.[publishingDate],u.[city],u.[UnitAddress],u.[pricePerMonth],u.[unitTypes]
          ,u.[minRentalPeriod],u.[maxRentalPeriod],u.[pictures],u.[UnitStatus],u.[numberOfrooms],u.[numberOftimes]
          ,u.[descriptionApartment],ow.[FullName],ow.[PhoneNumber]
          from [dbo].[RentalHousingUnit] u, [dbo].[ApartmentOwnerUser] ow
          where`+filter_query +` u.[apartmentOwnerId] = ow.ID and u.[UnitStatus] = 'available'and u.[minRentalPeriod] <= `+min_period+`
          and u.[maxRentalPeriod] >=`+min_period +`and unitId not in (select unitId from [dbo].[Order] o
            where o.[status] = 1 and (CAST('`+start_date+`' as date)  BETWEEN o.[startOrder] AND o.[endOrder]) or
            (CAST('`+end_date+`' as date)  BETWEEN o.[startOrder] AND o.[endOrder]))`,
            (err, rowCount,rows) => {
              connection.close();
              if (err) { console.error("Error sql in availabile units: " +err.message); return callback(false); }
              else {
              if(rowCount == 0) { return callback(null); } 
              return callback(RentalHousingUnits.buildUnitFromTable(rows));
            }}); // close build request object
        connection.execSql(request);
      }}); // close build connection object 
  } // end function getAvailableUnits

  static buildUnitFromTable(table)// build units from table
  {
    var units = [],pic,unitId,owner_id,city,address,number_of_rooms, price_per_month,unit_types,publishing_date,
    max_rental_period,min_rental_period,description_apartment,status, number_of_times,phone_number,full_name;
    table.forEach(element => {
      element.forEach(column =>{
        switch(column.metadata.colName) {
          case 'unitId': { unitId = column.value; break; }
          case 'apartmentOwnerId':{ owner_id = column.value; break; }
          case 'publishingDate':{ publishing_date = column.value; break; }
          case 'FullName': { full_name = column.value; break; }
          case 'phoneNumber':{ phone_number = column.value; break; } 
          case 'city': { city = column.value; break; }           
          case 'UnitAddress':{ address = column.value; break; }
          case 'pricePerMonth':{ price_per_month = column.value; break; } 
          case 'unitTypes':{ unit_types = column.value; break; }
          case 'UnitStatus':{ status = column.value; break; }
          case 'unitTypes': { unit_types = column.value; break; }
          case 'minRentalPeriod': { min_rental_period = column.value; break; }
          case 'maxRentalPeriod': { max_rental_period = column.value;break; }
          case 'numberOfrooms': { number_of_rooms = column.value; break; }
          case 'numberOftimes': { number_of_times = column.value; break; }
          case 'descriptionApartment': { description_apartment = column.value; break; }
          case 'pictures': { pic = column.value; break; }
        }// end of switch 
      }); // end of loop 
      var unit = new RentalHousingUnit(unitId,owner_id,city,address,number_of_rooms,price_per_month,
        unit_types,number_of_times,publishing_date,status,max_rental_period,min_rental_period,
        description_apartment,full_name,phone_number);
      unit.setPictures(pic);
      units.push(unit); 
    });
    return units; 
  } // end function buildUnitFromTable

  static getRentalHousingUnitsByOwnerId(owner_id,callback) //return RentalHousinguUnit object by owner id 
  {
    let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) { connection.close(); console.error("Error sql in unit by ownerId: " +err.message); return callback(false); }
        else {
        const request = new Request( 
          `SELECT * FROM RentalHousingUnit WHERE apartmentOwnerId =`+owner_id,
          (err, rowCount,rows) => {
            connection.close();
            if (err) {console.error("Error sql in unit by ownerId: " +err.message); return callback(false); } 
            else {
              if(rowCount == 0) { return callback(null); }
              return callback(RentalHousingUnits.buildUnitFromTable(rows));
            }}); // close build request object
        connection.execSql(request);
      }}); // close build connection object
  }// end function getRentalHousingUnitsByOwnerId

  static getRentalHousingUnitByUnitId(unit_id, callback) //return RentalHousinguUnit object by unit id
  {
    let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) { connection.close(); console.error("Error sql in unit by unitId: " +err.message); return callback(false); } 
        else {
        const request = new Request( 
          `SELECT * from RentalHousingUnit where UnitId =`+unit_id,
          (err, rowCount,rows) => {
            connection.close();
            if (err) { console.error("Error sql in unit by unitId: " +err.message); return callback(false); } 
            else {
              if(rowCount == 0) { return callback(null); }
              return callback(RentalHousingUnits.buildUnitFromTable(rows)[0]);
            }});// close build request object
        connection.execSql(request);
      }}); // close build connection object
  }// end function getRentalHousingUnitByUnitId
  
  static isUpdatePopularCount(unit_id,callback) // update the number of time to ordered
  {
    RentalHousingUnits.getRentalHousingUnitByUnitId(unit_id,function(result){
      if(result instanceof RentalHousingUnit){
        let connection = new Connection(config);       
            connection.on("connect", err => {
            if (err) { console.error("Error sql in update popular: " +err.message); connection.close(); return callback(false); } 
            else
            {
              const request = new Request( 
                `UPDATE RentalHousingUnit SET numberOfTimes =` + (result.NumberOfTimes + 1) + "WHERE unitid = " + result.UnitID,
                (err, rowCount) => {
                  connection.close();
                  if (err) { console.error("Error sql in update popular: " +err.message); return callback(false); } 
                  else {
                  if(rowCount != 0) { return callback(true); }
                  else { return callback(false); }
                }}); // close build request object
                connection.execSql(request);
            }}); // close build connection object
        }
      else { return callback(false); }
    }); // close the callback from function getRentalHousingUnitByUnitId
  }// end function isUpdatePopularCount 

  static getAttractions(callback) // get all attractions from DB
  {
    let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) { connection.close(); console.error("Error sql in get attractions: " +err.message); return callback(false); }
        else {
          const request = new Request( 
          `SELECT * from [dbo].[Attraction]`,
          (err, rowCount,rows) => {
            connection.close();
            if (err) { console.error("Error sql in get attractions: " +err.message); return callback(false); } 
            else {
              if(rowCount == 0) { return callback(null); } 
              var attractions = [];
              rows.forEach(element => {
                var unit_id,name_attraction,discount,driving_distance,description,pictures; 
                element.forEach(column =>{
                  switch(column.metadata.colName){
                    case 'attractionName': { name_attraction = column.value; break; }
                    case 'unitID': { unit_id = column.value; break; }
                    case 'discount': { discount = column.value; break; }
                    case 'distance': { driving_distance = column.value; break; }
                    case 'description': { description = column.value; break; }
                    case 'pictures': { pictures = column.value; break; }
                  }// end of switch
                });
                var attraction = new Attraction(name_attraction,unit_id,discount,driving_distance,description,pictures);
                attractions.push(attraction); 
              });
            return callback(attractions);
            }}); // close build request object
        connection.execSql(request);
      }}); // close build connection object
  } // end function getAttractions

  // get all attractions of the unit by unit id,if unit id is not exist so return null, if unit id is not type of int return false 
  static getAttractionsByUnitId(unit_id,callback)
  {
    let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) { connection.close(); console.error("Error sql in get arrations by unitId: " +err.message); return callback(false); } 
        else {
        const request = new Request( 
          `SELECT * from [dbo].[Attraction] where unitID = `+unit_id,
          (err, rowCount,rows) => {
            connection.close();
            if (err) { console.error("Error sql in get arrations by unitId: " +err.message); return callback(false); }    
            else {
              if(rowCount == 0) { return callback(null); }
              var attractions = [];
              rows.forEach(element => {
                var unit_id,name_attraction,discount,driving_distance,description,pictures; 
                element.forEach(column =>{
                  switch(column.metadata.colName){
                      case 'attractionName': { name_attraction = column.value; break; }
                      case 'unitID': { unit_id = column.value; break; }
                      case 'discount': { discount = column.value; break; }
                      case 'distance': { driving_distance = column.value; break; }
                      case 'description': { description = column.value; break; }
                      case 'pictures': { pictures = column.value; break; }
                    }// end of switch
                  });
                  var attraction = new Attraction(name_attraction,unit_id,discount,driving_distance,description,pictures);
                  attractions.push(attraction); 
              });
              return callback(attractions);
            }}); // close build request object
        connection.execSql(request);
      }}); // close build connection object
  }//end of function getAttationsByUnitId
} // end of class