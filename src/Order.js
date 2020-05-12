class Order
{

    constructor(order_number, unit_id, unit_type, city, number_of_rooms, start_order, end_order, total_price, full_name, email_address, number_of_times )
    {
        this.orderNumber = order_number;
        this.unitID = unit_id;
        this.unitType = unit_type;
        this.city = city;
        this.numberOfRooms = number_of_rooms;
        this.startOrder = start_order;
        this.endOrder = end_order;
        this.totalPrice = total_price;
        this.FullName = full_name;
        this.EmailAddress = email_address;
        this.numberOfTimes = number_of_times;
    }
    
}
module.exports = Order;