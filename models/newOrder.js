class newOrder
{
    #orderID;
    #totalPrice;
    #apartmentOwnerId;
    #ownerName;
    #ownerPhone
    #unitID;
    #unitCity;
    #unitAdress;
    #studentName;
    #studentID;
    #startOrderDate;
    #endOrderDate;
    #totalTime;
    #status;
    #creditCardNumber;
    #cvvNumber;
    #expiryCreditCard;

    constructor(orderId,totalPrice,apartmentOwnerId,ownername,OwnerPhone,unitID, unitCity, unitAdress, studentName,studentID, startOrderDate, endOrderDate,totalTime,status, creditCardNumber,cvvNumber, expiryCreditCard )
    {
        this.#orderID = orderId;
        this.#totalPrice=totalPrice;
        this.#apartmentOwnerId=apartmentOwnerId;
        this.#ownerName=ownername;
        this.#ownerPhone=OwnerPhone;
        this.#unitID=unitID;
        this.#unitCity = unitCity;
        this.#unitAdress = unitAdress;
        this.#studentName = studentName;
        this.#studentID=studentID;
        this.#startOrderDate = startOrderDate;
        this.#endOrderDate = endOrderDate;
        this.#totalTime = totalTime;
        this.#status=status;
        this.#creditCardNumber = creditCardNumber;
        this.#cvvNumber = cvvNumber;
        this.#expiryCreditCard=expiryCreditCard;
        
    }

    get orderID()
    {
        return this.#orderID;
    }
    get startOrderDate()
    {
        return this.#startOrderDate;
    }
    get endOrderDate()
    {
        return this.#endOrderDate;
    }
    get totalPrice()
    {
        return this.#totalPrice;
    }
    get unitCity()
    {
        return this.#unitCity;
    }
    get unitAdress()
    {
        return this.#unitAdress;
    }
    get totalTime()
    {
        return this.#totalTime;
    }
    get studentID()
    {
        return this.#studentID
    }
    get unitID()
    {
        return this.#unitID;
    }
    get studentName()
    {
        return this.#studentName;
    }

    get apartmentOwnerId()
    {
        return this.#apartmentOwnerId;
    }
    get ownerName()
    {
        return this.#ownerName;
    }
    get ownerPhone()
    {
        return this.#ownerPhone;
    }
    get status()
    {
        return this.#status;
    }
}
module.exports = newOrder;