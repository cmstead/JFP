(function (j) {
    'use strict';
    
    var isUndefined = j.isTypeOf('undefined');
    
    function add (a, b){
        return a + b;
    }
    
    function subtract (a, b){
        return a - b;
    }
    
    function multiply (a, b){
        return a * b;
    }
    
    function divide (a, b){
        return a / b;
    }
    
    function curryOperation (operation) {
        return function (a, b) {
            return isUndefined(b) ? j.partial(operation, a) : operation(a, b);
        };
    }
    
    j.add = j.enforce('number, [number] => taggedUnion<function;number>', curryOperation(add));
    j.subtract = j.enforce('number, [number] => taggedUnion<function;number>', curryOperation(subtract));
    j.multiply = j.enforce('number, [number] => taggedUnion<function;number>', curryOperation(multiply));
    j.divide = j.enforce('number, [number] => taggedUnion<function;number>', curryOperation(divide));
    
})(jfp);