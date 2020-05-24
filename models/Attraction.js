
class Attraction
{
    #name_attraction;
    #unit_id;
    #discount;
    #driving_distance;
    #description;
    #pictures; 

    constructor(name_attraction,unit_id,discount, driving_distance,description,pictures)
    {
        this.#name_attraction = name_attraction;
        this.#unit_id = unit_id;
        this.#discount = discount;
        this.#driving_distance = driving_distance;
        this.#description = description;
        this.#pictures = pictures;
    }

    get NameAttraction()
    {
        return this.#name_attraction;
    }

    get UnitId()
    {
        return this.#unit_id;
    }

    get Discount()
    {
        return this.#discount;
    }

    get DrivingDistance()
    {
        return this.#driving_distance;
    }

    get Description()
    {
        return this.#description;
    }

    get Pictures()
    {
        return this.#pictures;
    }

    setDiscount(discount)
    {
        if(typeof discount !== 'undefined' ){
            this.#discount = discount;
            return true;
        }
        return false;
    }

    
    setDrivingDistance(driving_distance)
    {
        if(typeof driving_distance !== 'undefined' ){
            this.#driving_distance = driving_distance;
            return true;
        }
        return false;
    }

    setDescription(description)
    {
        if(typeof description !== 'undefined' ){
            this.#description = description;
            return true;
        }
        return false;
    }

    setPictures(pictures)
    {
        if(typeof pictures !== 'undefined' ){
            this.#pictures = pictures;
            return true;
        }
        return false;
    }
}

module.exports = Attraction;