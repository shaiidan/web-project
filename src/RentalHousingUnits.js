const RentalHousingUnit = require("./RentalHousingUnit")
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
class RentalHousingUnits
{
    // delete unit -> change the status
    static deleteUnit(unit_id)
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
                    "UPDATE RentalHousingUnit SET UnitStatus = 'unavailable' WHERE unitid = " +unit_id,
                  (err, rowCount) => {
                    if (err) {
                      console.error(err.message);
                      connection.close();
                      return false;
                    } else {
                      console.log(`${rowCount} row(s) returned`);
                      connection.close();
                    }
                  }
                );
                connection.execSql(request);
            }
          });
          return true;
    }

    // update the unit , unit - is the instance of RentalHousingUnit
    static updateUnit(unit)
    {
        let connection = new Connection(config);
        if(unit instanceof RentalHousingUnit)
        {
            
            connection.on("connect", err => {
            if (err) {
              console.error(err.message);
              connection.close();
              return false;
            } 
            else
            {
                const request = new Request( 
                    `UPDATE RentalHousingUnit
                     SET pricePerMonth =` +unit.PricePerMonth() +
                     ',MinRentalPeriod =  '+ unit.MinRentalPeriod +
                     ',MaxRentalPeriod =  '+ unit.MaxRentalPeriod +
                     ",pictures =  '"+ unit.Pictures +
                     "',descriptionApartment =  '"+ unit.MaxRentalPeriod +
                     "'WHERE unitid = " + unit.UnitID,
                  (err, rowCount) => {
                    if (err) {
                      console.error(err.message);
                      connection.close();
                      
                    } else {
                      console.log(`${rowCount} row(s) returned`);
                      connection.close();
                    }
                  }
                );
                connection.execSql(request);
            }
          });
          return true; 
        }
        return false;
    }

    // add unit to DB, unit is instance of RentalHousingUnit
    static addUnit(unit)
    {
        let connection = new Connection(config);
        if(unit instanceof RentalHousingUnit)
        {
            const connection = new Connection(config);
            connection.on("connect", err => {
            if (err) {
              console.error(err.message);
              connection.close();
              return false;
            } 
            else
            {
                const request =  new Request( 
                    `insert into RentalHousingUnit(apartmentOwnerId,city,UnitAddress,pricePerMonth,unitTypes,minRentalPeriod,maxRentalPeriod,pictures,numberOfrooms,descriptionApartment)
                    values (` +
                    unit.ApartmentOwnerId + ",'" + unit.City + "','"
                    + unit.Adderss +"',"+ unit.PricePerMonth +",'" + unit.UnitTypes + "'," +
                    unit.MinRentalPeriod + ',' + unit.MaxRentalPeriod + ",'" + unit.Pictures +
                    "'," + unit.NumberOfRooms + ",'" + unit.DescriptionApartment + "')"
                  ,(err, rowCount) => {
                    if (err) {
                      console.error(err.message);
                      connection.close();
                      return false;
                    } else {
                      console.log(`${rowCount} row(s) returned`);
                      connection.close();
                      
                    }
                  }
                );
                connection.execSql(request);
            }
          });
        }
        return false;
    }
    //
    static getAvailableUnits(start_date,end_date,min_period,callback)
    {
      let connection = new Connection(config);
      connection.on("connect", err => {
        if (err) {
          console.error(err.message);
        } else {
        const request = new Request( 
          `select DISTINCT u.[unitId],u.[apartmentOwnerId],u.[publishingDate],u.[city],u.[UnitAddress],u.[pricePerMonth],u.[unitTypes]
          ,u.[minRentalPeriod],u.[maxRentalPeriod],u.[pictures],u.[UnitStatus],u.[numberOfrooms],u.[numberOftimes]
          ,u.[descriptionApartment],ow.[FullName],ow.[PhoneNumber]
    from [dbo].[RentalHousingUnit] u, [dbo].[ApartmentOwnerUser] ow
    where u.[apartmentOwnerId] = ow.ID and u.[UnitStatus] = 'available'and u.[minRentalPeriod] = `+min_period+` 
    and unitId not in (select unitId from [dbo].[Order] o
    where  (CAST('`+start_date+`' as date)  BETWEEN o.[startOrder] AND o.[endOrder]) or
        (CAST('`+end_date+`' as date)  BETWEEN o.[startOrder] AND o.[endOrder]))`,
          (err, rowCount,rows) => {
            if (err) {
              console.error(err.message);
              return callback(false);
            } 
            else {
              console.log(`${rowCount} row(s) returned`);
              connection.close();
              var units =[];
              rows.forEach(element => {
                var unitId,owner_id,city,address,number_of_rooms, price_per_month,unit_types,publishing_date,
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
                  }// end of switch 
                  });
                  var unit = new RentalHousingUnit(unitId,owner_id,city,address,number_of_rooms,price_per_month,
                    unit_types,number_of_times,publishing_date,status,max_rental_period,min_rental_period,
                    description_apartment,full_name,phone_number);
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
} // end of class

module.exports = RentalHousingUnits;

