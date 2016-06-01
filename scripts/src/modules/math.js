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
    
    function mod (a, b){
        return a % b;
    }
    
    function curryOperation (operation) {
        return function (a, b) {
            return isUndefined(b) ? j.rpartial(operation, a) : operation(a, b);
        };
    }
    
    function range (a, b, interval){
        var min = isUndefined(b) ? 1 : a;
        var max = isUndefined(b) ? a : b;
        var offset = isUndefined(interval) ? 1 : interval;
        
        return j.recur(buildRange)(min, []);
        
        function buildRange (recur, value, output){
            return value > max ? output : recur(value + offset, j.concat(output, [value]));
        }
    }
    
    j.add = j.enforce('number, [number] => taggedUnion<function;number>', curryOperation(add));
    j.divide = j.enforce('number, [number] => taggedUnion<function;number>', curryOperation(divide));
    j.mod = j.enforce('number, [number] => taggedUnion<function;number>', curryOperation(mod));
    j.multiply = j.enforce('number, [number] => taggedUnion<function;number>', curryOperation(multiply));
    j.range = j.enforce('int, [int], [int] => array<int>', range);
    j.subtract = j.enforce('number, [number] => taggedUnion<function;number>', curryOperation(subtract));
    
})(jfp);