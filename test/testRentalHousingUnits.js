var assert = require('assert');
const units = require('../models/RentalHousingUnits');
const unit = require('../models/RentalHousingUnit');
const Atrraction = require('../models/Attraction');
const Attraction = require('../models/Attraction');

//check function of units class

//function deleteUnit
describe("check delete unit",()=> {
    it("unit_id is not intager! send string",()=>{
        units.deleteUnit("shaiii",function(result) {
            assert.deepEqual(result,false);
        })
    });
    it("unit_id is not intager! send null",()=>{
        units.deleteUnit(null,function(result) {
            assert.deepEqual(result,false);
        })
    });
    
    it("unit_id is not intager! send list",()=>{
        units.deleteUnit([1,2,3],function(result) {
            assert.deepEqual(result,false);
        })
    });
});

// function changeUnitForOrder
describe("Check change status for order",()=> {
    it("unit_id is not intager! send string",()=>{
        units.isChangeStatusForOrder("string",0,function(result){
            assert.deepEqual(result,false);
        })
    });
    it("unit_id is not intager! send null",()=>{
        units.isChangeStatusForOrder(null,0,function(result){
            assert.deepEqual(result,false);
        })
    });
    
    it("code status is null",()=>{
        units.isChangeStatusForOrder(1,null,function(result){
            assert.deepEqual(result,false);
        })
    });
});

// check function updateUnit
describe("Check update unit",()=> {
    it("unit is not unit class! send string",()=>{
        units.updateUnit("shai",function (result) {
            assert.deepEqual(result,false);
        })
    });
    it("unit is not unit class! send null",()=>{
        units.updateUnit(null,function (result) {
            assert.deepEqual(result,false);
        })
    });
    
    it("unit is unit class, but send nulls",()=>{
        units.updateUnit(new unit(null,null,null,null,null
            ,null,null,null,null,null,null,null,null,null,null,null),function (result) {
            assert.deepEqual(result,false);
        })
    });
});

// check funtion addUnit

describe("Check add unit",()=> {
    it("unit is not unit class! send string",()=>{
        units.addUnit("shaii",null,function(result){
            assert.deepEqual(result,false);
        })     
    });
    
    it("unit is not unit class! send list",()=>{
        units.addUnit([1,2,3],null,function(result){
            assert.deepEqual(result,false);
        })     
    });
    
    it("unit is not unit class! send null",()=>{
        units.addUnit(null,null,function(result){
            assert.deepEqual(result,false);
        })     
    });
    
    it("unit is unit class, but send nulls",()=>{
        units.addUnit(new unit(null,null,null,null,null
            ,null,null,null,null,null,null,null,null,null,null,null),null,function (result) {
            assert.deepEqual(result,false);
        })
    });
}); 

//check function getAvaiableUnits
describe("Check get avaiable units",()=> {
    it("send paramters null",()=>{
        units.getAvailableUnits(null,null,null,null,function(result){
            assert.deepEqual(result,false);
        })     
    });
    it("send all paramters are string",()=>{
        units.getAvailableUnits("shai","shai","shai","shai",function(result){
            assert.deepEqual(result,false);
        })     
    });
    
    it("send all paramters are int",()=>{
        units.getAvailableUnits(1,2,3,4,function(result){
            assert.deepEqual(result,false);
        })     
    });
});

// check function getRentalHousingUnitsByOwnerId
describe("Check get rentaul housing units by owner id",()=> {
    it("owner Id is null, so the result is",()=>{
        units.getRentalHousingUnitsByOwnerId(null,function(result){
            assert.deepEqual(result,null);
        })
    });
    it("owner Id is string",()=>{
        units.getRentalHousingUnitsByOwnerId("shai",function(result){
            assert.deepEqual(result,false);
        })
    });
    
    it("owner Id is list",()=>{
        units.getRentalHousingUnitsByOwnerId([1,2,3],function(result){
            assert.deepEqual(result,false);
        })
    });
});

// check function getRentalHousingUnitsByUnitId
describe("Check get rentaul housing units by unit id",()=> {
    it("unit Id is null, so the result is",()=>{
        units.getRentalHousingUnitByUnitId(null,function(result){
            assert.deepEqual(result,null);
        })
    });   
    it("unit Id is string",()=>{
        units.getRentalHousingUnitByUnitId("shai",function(result){
            assert.deepEqual(result,false);
        })
    });
    
    it("unit Id is list",()=>{
        units.getRentalHousingUnitByUnitId([1,2,3],function(result){
            assert.deepEqual(result,false);
        })
    });
});

// check function updatePipoularCount
describe("Check update popular field",()=> {
    it("unit is not unit class! send string",()=>{
        units.isUpdatePopularCount("shai",function (result) {
            assert.deepEqual(result,false);
        })
    });
    it("unit is not unit class! send null",()=>{
        units.isUpdatePopularCount(null,function (result) {
            assert.deepEqual(result,false);
        })
    });
    
    it("unit is unit class, but send nulls",()=>{
        units.isUpdatePopularCount(new unit(null,null,null,null,null
            ,null,null,null,null,null,null,null,null,null,null,null),function (result) {
            assert.deepEqual(result,false);
        })
    });
});

// check getAttractionsByUnitId
describe("Check get attractions by unit id",()=> {
    it("unit id is string, so return false",()=>{
        units.getAttractionsByUnitId("shai",function (result) {
            assert.deepEqual(result,false);
        });
    });
    it("unit id is null, so return null",()=>{
        units.getAttractionsByUnitId(null,function (result) {
            assert.deepEqual(result,null);
        });
    });
    it("unit id = -1 ,not exist, so return null",()=>{
        units.getAttractionsByUnitId(-1,function (result) {
            assert.deepEqual(result,null);
        });
    });
    it("unit id is list, so return false",()=>{
        units.getAttractionsByUnitId([1,2,3,4],function (result) {
            assert.deepEqual(result,false);
        });
    });
});

// check Attration object
describe("check Attraction object",()=> {
    var attration = new Attraction("Park",123,50,"Up to 5 minutes","good location",null);
    it("check get name",()=>{
        assert.deepEqual("Park",attration.NameAttraction);
    });
    it("check get unit id",()=>{
        assert.deepEqual(123,attration.UnitId);
    });
    it("check get discount",()=>{
        assert.deepEqual(50,attration.Discount);
    });
    it("check get driving distance",()=>{
        assert.deepEqual("Up to 5 minutes",attration.DrivingDistance);
    });
    it("check get description",()=>{
        assert.deepEqual("good location",attration.Description);
    });
    it("check get pictures",()=>{
        assert.deepEqual(null,attration.Pictures);
    });
   
    it("check set discount",()=>{
        attration.setDiscount(40);
        assert.deepEqual(40,attration.Discount);
    });
    it("check set driving distance",()=>{
        attration.setDrivingDistance("Up to 15 minutes");
        assert.deepEqual("Up to 15 minutes",attration.DrivingDistance);
    });
    it("check set description",()=>{
        attration.setDescription("good place");
        assert.deepEqual("good place",attration.Description);
    });
    it("check set pictures",()=>{
        attration.setPictures("");
        assert.deepEqual("",attration.Pictures);
    });
});

