{
    let x = 5; //number
    let b = "10";
}
//primitives
//primitives are immutable. It will throw out previous values.
{
    let person = {
        name: "noam",
        age: 25,
        favFood: "pizza",
        //method
        fun: function() {
            console.log("yay");
        }
    }
    person.fun
}
//objects

let grades = [100, 90, 90, 90];

(function() {
    //IIFE - Immediately invoked function avoids global variables
    var age = 5;
})();

{
    //block level restricts the varaible to the block, the var keyword defeats the purpose.
    let y = 10;

    var z = 100;
}