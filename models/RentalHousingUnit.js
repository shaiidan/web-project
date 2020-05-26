
class RentalHousingUnit
{
    #unitID;
    #city;
    #adderss;
    #publishingDate;
    #numberOfRooms;
    #status;
    #pricePerMonth;
    #maxRentalPeriod;
    #minRentalPeriod;
    #apartemntOwnerID;
    #apartemntOwnerFullName;
    #apartemntOwnerPhone;
    #pictures;
    #unitTypes;
    #descriptionApartemnt;
    #numberOfTime;
 

    constructor(unit_id,owner_id,city,address,number_of_rooms, price_per_month,unit_types, number_of_times,publishing_date,
        status,max_rental_period,min_rental_period,description_apartemnt,full_name,phone_number)
    {
        this.#unitID = unit_id;
        this.#apartemntOwnerID = owner_id;
        this.#apartemntOwnerFullName = full_name;
        this.#apartemntOwnerPhone = phone_number;
        this.#city = city;
        this.#adderss = address;
        this.#numberOfRooms = number_of_rooms;
        this.#numberOfTime = number_of_times;
        this.#pricePerMonth = price_per_month;
        this.#unitTypes = unit_types;
        this.#publishingDate = publishing_date;
        this.#status = status;
        this.#minRentalPeriod = min_rental_period;
        this.#maxRentalPeriod = max_rental_period;
        this.#pictures = null;
        this.#descriptionApartemnt = description_apartemnt;
    }

    get UnitID()
    {
        return this.#unitID;
    }

    get City()
    {
        return this.#city;
    }

    get Adderss()
    {
        return this.#adderss;
    }

    get PublishingDate()
    {
        return this.#publishingDate;
    }

    get NumberOfRooms()
    {
        return this.#numberOfRooms;
    }

    get Status()
    {
        return this.#status;
    }

    get PricePerMonth()
    {
        return this.#pricePerMonth;
    }

    get MinRentalPeriod()
    {
        return this.#minRentalPeriod;
    }

    get MaxRentalPeriod()
    {
        return this.#maxRentalPeriod;
    }

    get NumberOfTimes()
    {
        return this.#numberOfTime;
    }

    get ApartmentOwnerId()
    {
        return this.#apartemntOwnerID;
    }

    get ApartmentOwnerFullName()
    {
        return this.#apartemntOwnerFullName;
    }

    get ApartmentOwnerPhone()
    {
        return this.#apartemntOwnerPhone;
    }

    get Pictures()
    {
        return this.#pictures;
    }

    get UnitTypes()
    {
        return this.#unitTypes;
    }

    get DescriptionApartment()
    {
        return this.#descriptionApartemnt;
    }

    setStatus(status)
    {
        if(typeof status !== 'undefined')
        {
            this.#status = statusp; 
            return true;
        }
        return false;
    }

    setPictures(pic){

        if(typeof pic !== 'undefined'){
            this.#pictures = pic;
            return true;
        }
        return false;
    }
}

module.exports = RentalHousingUnit;
