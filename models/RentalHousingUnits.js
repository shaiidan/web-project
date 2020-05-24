const RentalHousingUnit = require("./RentalHousingUnit");
const { Connection, Request } = require("tedious");
const config = require("./dbconfig");
const Attraction = require("./Attraction");

class RentalHousingUnits
{
    // delete unit -> change the status
    static deleteUnit(unit_id,callback)
    {
        let connection = new Connection(config);
        connection.on("connect", err => {
            if (err) {
              console.error("Error sql: " + err.message);
              connection.close();
              return callback(false);
            } 
            else
            {
                const request = new Request( 
                    "UPDATE RentalHousingUnit SET UnitStatus = 'deleted' WHERE UnitId= " +unit_id,
                  (err, rowCount) => {
                    if (err) {
                      console.error("Error sql: " +err.message);
                      connection.close();
                      return callback(false);
                    } else {
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
    // change status to unit. 
    // codeStatus = 0 -> the unit in the order process
    // codeStatus = 1 -> the unit is available
    static changeStatusForOrder(unit_id,codeStatus,callback)
    {
      var status = null;
      switch(codeStatus){
        case 0: {status = 'Order process'; break;}
        case 1: {status = 'available'; break;}
        default: {status = null; break;}
      }

      if(status != null)
      {
        let connection = new Connection(config);
        connection.on("connect", err => {
          if (err) {
            console.error("Error sql: " +err.message);
            connection.close();
            return callback(false);
          } 
          else
          {
              const request = new Request( 
                  "UPDATE RentalHousingUnit SET UnitStatus = '"+status+"' WHERE unitId= " +unit_id,
                (err, rowCount) => {
                  if (err) {
                    console.error("Error sql: "+ err.message);
                    connection.close();
                    return callback(false);
                  } else {
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
      else{
        return callback(false);
      }
    }

    // update the unit , unit - is the instance of RentalHousingUnit
    static updateUnit(unit, callback)
    {
        if(unit instanceof RentalHousingUnit)
        {
          let connection = new Connection(config);       
            connection.on("connect", err => {
            if (err) {
              console.error("Error sql: " +err.message);
              connection.close();
              return callback(false);
            } 
            else
            {
                const request = new Request( 
                    `UPDATE RentalHousingUnit
                     SET pricePerMonth =` +unit.PricePerMonth +
                     ',MinRentalPeriod =  '+ unit.MinRentalPeriod +
                     ',MaxRentalPeriod =  '+ unit.MaxRentalPeriod +
                     ",pictures =  '"+ unit.Pictures +
                     "',descriptionApartment =  '"+ unit.DescriptionApartment +
                     "' WHERE unitid = " + unit.UnitID,
                  (err, rowCount) => {
                    if (err) {
                      console.error("Error sql: " +err.message);
                      connection.close();
                      return callback(false);
                      
                    } else {
                      connection.close();
                      if(rowCount != 0){
                         return callback(true);
                      }
                      else{
                         return callback(false);
                      }
                    }}
                );
                connection.execSql(request);
            }
          });
        }
        else{
          return callback(false);
        }
    }

    // add unit to DB, unit is instance of RentalHousingUnit
    static addUnit(unit,attractions,callback)
    {
      if(unit instanceof RentalHousingUnit && attractions instanceof Array)
      {
        var add_attractions = "";
        for(var i=0; i< attractions.length; i++)
        {
          if(attractions[i] instanceof Attraction)
            {
              add_attractions+= `INSERT into Attraction(attractionName,unitID,discount,distance,description,pictures)
              VALUES('`+attractions[i].NameAttraction+`',@DataID,`+
              attractions[i].Discount +`,'` +attractions[i].DrivingDistance +`','`+attractions[i].Description+`',
              '`+attractions[i].Pictures+ `')\n`;
            }
        }    
        let connection = new Connection(config);
        connection.on("connect", err => {
          if (err) {
            console.error("Error sql: " +err.message);
            connection.close();
            return callback(false);
          } 
          else
          {
              const query = `SET XACT_ABORT ON;
              BEGIN TRANSACTION
                 DECLARE @DataID int;  
                 insert into RentalHousingUnit(apartmentOwnerId,city,UnitAddress,pricePerMonth,unitTypes,
                minRentalPeriod,maxRentalPeriod,pictures,numberOfrooms,descriptionApartment)
              values (` +
              unit.ApartmentOwnerId + ",'" + unit.City + "','"
              + unit.Adderss +"',"+ unit.PricePerMonth +",'" + unit.UnitTypes + "'," +
              unit.MinRentalPeriod + ',' + unit.MaxRentalPeriod + ",'" + unit.Pictures +
              "'," + unit.NumberOfRooms + ",'" + unit.DescriptionApartment + `')
              SELECT @DataID = scope_identity();  ` + add_attractions +    
              `COMMIT`;
                const request =  new Request( query ,(err, rowCount) => {
                    if (err) {
                      console.error("Error sql: " +err.message);
                      connection.close();
                      return callback(false);
                    } 
                    else {
                      connection.close();
                      if(rowCount != 0) {
                        return callback(true);
                      }
                      else {
                        return callback(false);
                      }
                    }}
                );
                connection.execSql(request);
            }
          });
        }
        else{
          return callback(false);
        }
    }
    //
    static getAvailableUnits(start_date,end_date,min_period,filter_query,callback)
    {
      let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) {
          connection.close();
          console.error("Error sql: " + err.message);
          return callback(false);
        } else {
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
            if (err) {
              connection.close();
              console.error("Error sql: " + err.message);
              return callback(false);
            } 
            else {
              connection.close();
              var units =[];
              rows.forEach(element => {
                var pic,unitId,owner_id,city,address,number_of_rooms, price_per_month,unit_types,publishing_date,
                max_rental_period,min_rental_period,description_apartment,status, number_of_times,phone_number,full_name;
                element.forEach(column =>{
                  switch(column.metadata.colName)
                  {
                    case 'unitId': 
                    {
                      unitId = column.value;
                      break;
                    }
                    case 'apartmentOwnerId': 
                    {
                      owner_id = column.value;
                      break;
                    }
                    case 'publishingDate': 
                    {
                      publishing_date = column.value;
                      break;
                    }
                    case 'FullName': 
                    {
                      full_name = column.value;
                      break;
                    }
                    case 'phoneNumber': 
                    {
                      phone_number = column.value;
                      break;
                    }
                      
                    case 'city': 
                    {
                      city = column.value;
                      break;
                    }
                    
                    case 'UnitAddress': 
                    {
                      address = column.value;
                      break;
                    }
                    case 'pricePerMonth': 
                    {
                      price_per_month = column.value;
                      break;
                    }
                    
                    case 'unitTypes': 
                    {
                      unit_types = column.value;
                      break;
                    }
            
                    case 'UnitStatus':
                      { 
                        status = column.value;
                        break;
                      }
                    case 'unitTypes': 
                    {
                      unit_types = column.value;
                      break;
                    }
                    
                    case 'minRentalPeriod': 
                    {
                      min_rental_period = column.value;
                      break;
                    }
                    case 'maxRentalPeriod': 
                    {
                      max_rental_period = column.value;
                      break;
                    }
                    case 'numberOfrooms': 
                    {
                      number_of_rooms = column.value;
                      break;
                    }
                    case 'numberOftimes': 
                    {
                      number_of_times = column.value;
                      break;
                    }
                    
                    case 'descriptionApartment': 
                    {
                      description_apartment = column.value;
                      break;
                    }
                    case 'pictures':
                    {
                      pic = column.value;
                      break;
                    }
                  }// end of switch 
                  });
                  var unit = new RentalHousingUnit(unitId,owner_id,city,address,number_of_rooms,price_per_month,
                    unit_types,number_of_times,publishing_date,status,max_rental_period,min_rental_period,
                    description_apartment,full_name,phone_number);
                    unit.setPictures(pic);
                    units.push(unit); 
              });
              return callback(units);
            }
          }
        );
        connection.execSql(request);
      }
    }); 
  }

  static getRentalHousingUnitsByOwnerId(owner_id,callback)
  {
    let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) {
          connection.close();
          console.error("Error sql: " +err.message);
          return callback(false);
        } else {
        const request = new Request( 
          `SELECT * FROM RentalHousingUnit WHERE apartmentOwnerId =`+owner_id,
          (err, rowCount,rows) => {
            if (err) {
              connection.close();
              console.error("Error sql: " +err.message);
              return callback(false);
            } 
            else {

              connection.close();
              if(rowCount == 0){
                return callback(null);
              }
              var units =[];
              rows.forEach(element => {
                var pic, unitId,owner_id,city,address,number_of_rooms, price_per_month,unit_types,publishing_date,
                max_rental_period,min_rental_period,description_apartment,status, number_of_times;
                element.forEach(column =>{
                  switch(column.metadata.colName)
                  {
                    case 'unitId': 
                    {
                      unitId = column.value;
                      break;
                    }
                    case 'apartmentOwnerId': 
                    {
                      owner_id = column.value;
                      break;
                    }
                    case 'publishingDate': 
                    {
                      publishing_date = column.value;
                      break;
                    }
                    case 'city': 
                    {
                      city = column.value;
                      break;
                    }
                    
                    case 'UnitAddress': 
                    {
                      address = column.value;
                      break;
                    }
                    case 'pricePerMonth': 
                    {
                      price_per_month = column.value;
                      break;
                    }
                    
                    case 'unitTypes': 
                    {
                      unit_types = column.value;
                      break;
                    }
            
                    case 'UnitStatus':
                      { 
                        status = column.value;
                        break;
                      }
                    case 'unitTypes': 
                    {
                      unit_types = column.value;
                      break;
                    }
                    
                    case 'minRentalPeriod': 
                    {
                      min_rental_period = column.value;
                      break;
                    }
                    case 'maxRentalPeriod': 
                    {
                      max_rental_period = column.value;
                      break;
                    }
                    case 'numberOfrooms': 
                    {
                      number_of_rooms = column.value;
                      break;
                    }
                    case 'numberOftimes': 
                    {
                      number_of_times = column.value;
                      break;
                    }
                    
                    case 'descriptionApartment': 
                    {
                      description_apartment = column.value;
                      break;
                    }

                    case 'pictures':
                    {
                      pic = column.value;
                      break;
                    }
                  }// end of switch 
                  });
                  var unit = new RentalHousingUnit(unitId,owner_id,city,address,number_of_rooms,price_per_month,
                    unit_types,number_of_times,publishing_date,status,max_rental_period,min_rental_period,description_apartment,null,null);
                    unit.setPictures(pic);
                    units.push(unit); 
              });
              return callback(units);
            }
          }
        );
        connection.execSql(request);
      }
    }); 
  }

  static getRentalHousingUnitByUnitId(unit_id, callback)
  {
    let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) {
          connection.close();
          console.error("Error sql: " +err.message);
          return callback(false);
        } else {
        const request = new Request( 
          `SELECT * from RentalHousingUnit where UnitId =`+unit_id,
          (err, rowCount,rows) => {
            if (err) {
              connection.close();
              console.error("Error sql: " +err.message);
              return callback(false);
            } 
            else {
              connection.close();
              if(rowCount == 0)
                 return callback(null);
              var unit;
              rows.forEach(element => {
                var pic, unitId,owner_id,city,address,number_of_rooms, price_per_month,unit_types,publishing_date,
                max_rental_period,min_rental_period,description_apartment,status, number_of_times;
                element.forEach(column =>{
                  switch(column.metadata.colName)
                  {
                    case 'unitId': 
                    {
                      unitId = column.value;
                      break;
                    }
                    case 'apartmentOwnerId': 
                    {
                      owner_id = column.value;
                      break;
                    }
                    case 'publishingDate': 
                    {
                      publishing_date = column.value;
                      break;
                    }
                    case 'city': 
                    {
                      city = column.value;
                      break;
                    }
                    
                    case 'UnitAddress': 
                    {
                      address = column.value;
                      break;
                    }
                    case 'pricePerMonth': 
                    {
                      price_per_month = column.value;
                      break;
                    }
                    
                    case 'unitTypes': 
                    {
                      unit_types = column.value;
                      break;
                    }
            
                    case 'UnitStatus':
                      { 
                        status = column.value;
                        break;
                      }
                    case 'unitTypes': 
                    {
                      unit_types = column.value;
                      break;
                    }
                    
                    case 'minRentalPeriod': 
                    {
                      min_rental_period = column.value;
                      break;
                    }
                    case 'maxRentalPeriod': 
                    {
                      max_rental_period = column.value;
                      break;
                    }
                    case 'numberOfrooms': 
                    {
                      number_of_rooms = column.value;
                      break;
                    }
                    case 'numberOftimes': 
                    {
                      number_of_times = column.value;
                      break;
                    }
                    
                    case 'descriptionApartment': 
                    {
                      description_apartment = column.value;
                      break;
                    }
                    case 'pictures':
                    {
                      pic = column.value;
                      break;
                    }
                  }// end of switch 
                  });
                  unit = new RentalHousingUnit(unitId,owner_id,city,address,number_of_rooms,price_per_month,
                    unit_types,number_of_times,publishing_date,status,max_rental_period,min_rental_period,
                    description_apartment,null,null); 
                    unit.setPictures(pic);
              });
              return callback(unit);
            }
          }
        );
        connection.execSql(request);
      }
    });
  }

  // update the number of time to ordered
  static updatePopularCount(unit_id,callback)
  {
    RentalHousingUnits.getRentalHousingUnitByUnitId(unit_id,function(result){
      if(result instanceof RentalHousingUnit){
        let connection = new Connection(config);       
            connection.on("connect", err => {
            if (err) {
              console.error("Error sql: " +err.message);
              connection.close();
              return callback(false);
            } 
            else
            {
              var query =`UPDATE RentalHousingUnit
              SET numberOfTimes =` + (result.NumberOfTimes + 1) +
              "WHERE unitid = " + result.UnitID; 
                const request = new Request( 
                    query,
                  (err, rowCount) => {
                    if (err) {
                      console.error("Error sql: " +err.message);
                      connection.close();
                      return callback(false);
                      
                    } else {
                      connection.close();
                      if(rowCount != 0){
                         return callback(true);
                      }
                      else{
                         return callback(false);
                      }
                    }}
                );
                connection.execSql(request);
            }
          });
        }
        else{
          return callback(false);
        }
      });
  }

  static getAttractions(callback)
  {
    let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) {
          connection.close();
          console.error("Error sql: " +err.message);
          return callback(false);
        } else {
        const request = new Request( 
          `SELECT * from [dbo].[Attraction]`,
          (err, rowCount,rows) => {
            if (err) {
              connection.close();
              console.error("Error sql: " +err.message);
              return callback(false);
            } 
            else {
              connection.close();
              if(rowCount == 0)
                 return callback(null);
              var attractions = [];
              rows.forEach(element => {
                var unit_id,name_attraction,discount,driving_distance,description,pictures; 
                element.forEach(column =>{
                  switch(column.metadata.colName)
                  {
                    case 'attractionName': 
                    {
                      name_attraction = column.value;
                      break;
                    }
                    case 'unitID': 
                    {
                      unit_id = column.value;
                      break;
                    }
                    case 'discount': 
                    {
                      discount = column.value;
                      break;
                    }
                    case 'distance': 
                    {
                      driving_distance = column.value;
                      break;
                    }
                    
                    case 'description': 
                    {
                      description = column.value;
                      break;
                    }
                    case 'pictures': 
                    {
                      pictures = column.value;
                      break;
                    }
                    
                  }// end of switch
                  });
                  var attraction = new Attraction(name_attraction,unit_id,discount,driving_distance,description,pictures);
                  attractions.push(attraction); 
              });
              return callback(attractions);
            }
          }
        );
        connection.execSql(request);
      }
    });
  }

  // get all attractions of the unit by unit id, 
  //if unit id is not exist so return null, if unit id is not type of int return false 
  static getAttractionsByUnitId(unit_id,callback)
  {
    let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) {
          connection.close();
          console.error("Error sql: " +err.message);
          return callback(false);
        } else {
        const request = new Request( 
          `SELECT * from [dbo].[Attraction] where unitID = `+unit_id,
          (err, rowCount,rows) => {
            if (err) {
              connection.close();
              console.error("Error sql: " +err.message);
              return callback(false);
            } 
            else {
              connection.close();
              if(rowCount == 0)
                 return callback(null);
              var attractions = [];
              rows.forEach(element => {
                var unit_id,name_attraction,discount,driving_distance,description,pictures; 
                element.forEach(column =>{
                  switch(column.metadata.colName)
                  {
                    case 'attractionName': 
                    {
                      name_attraction = column.value;
                      break;
                    }
                    case 'unitID': 
                    {
                      unit_id = column.value;
                      break;
                    }
                    case 'discount': 
                    {
                      discount = column.value;
                      break;
                    }
                    case 'distance': 
                    {
                      driving_distance = column.value;
                      break;
                    }
                    
                    case 'description': 
                    {
                      description = column.value;
                      break;
                    }
                    case 'pictures': 
                    {
                      pictures = column.value;
                      break;
                    }
                    
                  }// end of switch
                  });
                  var attraction = new Attraction(name_attraction,unit_id,discount,driving_distance,description,pictures);
                  attractions.push(attraction); 
              });
              return callback(attractions);
            }
          }
        );
        connection.execSql(request);
      }
    });
  }
} // end of class

module.exports = RentalHousingUnits;