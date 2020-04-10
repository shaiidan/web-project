var assert = require('assert');
const sorting = require("../src/sortarray");

describe("check if sorting",()=> {
    it("The array [3,1,40,10,2,7] will be [1,2,3,7,10,40] ",()=>{
        assert.deepEqual(sorting.soringArray([3,1,40,10,2,7]),[1,2,3,7,10,40]);
    });

    it("The array [100, 80, 30, 10] will be [10,30,80,100] ",()=>{
        assert.deepEqual(sorting.soringArray([100,80,30,10]),[10,30,80,100]);
    });

    it("The array with 1 length",()=>{
        assert.deepEqual(sorting.soringArray([1]),[1]);
    });

    it("The array is empty",()=>{
        assert.deepEqual(sorting.soringArray([]),[]);
    });
    
    it("The type is not array",()=>{
        assert.equal(sorting.soringArray("shai"),-1);
    });
    
});
