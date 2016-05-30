(function (j) {
    'use strict';

    function identity (value){
        return value;
    }

    function always (value){
        return identity.bind(null, value);
    }
    
    function either(typeStr) {
        var checkType = j.isTypeOf(typeStr);

        return function (defaultValue) {
            return function (value) {
                return checkType(value) ? value : defaultValue;
            };
        };
    }

    function maybe(typeStr) {
        return either(typeStr)(j.nil);
    }

    function concat (valuesa, valuesb) {
        var result = valuesa.slice(0);
        
        for(var i = 0; i < valuesb.length; i++) {
            result.push(valuesb[i]);
        }
        
        return result;
    }

    function cons (value, values){
        return j.isTypeOf('undefined')(value) ? values : concat([value], values);
    }

    function slice (start){
        return function (valueSet, end) {
            return Array.prototype.slice.apply(valueSet, cons(start, cons(end, j.nil)));
        };
    }
    
    function apply(fn, args) {
        return fn.apply(null, args);
    }
    
    function partial(direction) {
        var isLeft = direction === 'left';
        
        return function (fn) {
            var initial = slice(1)(arguments);
            
            return function () {
                var remaining = slice(0)(arguments);
                var argSet = isLeft ? [initial, remaining] : [remaining, initial];
                
                return apply(fn, apply(concat, argSet));
            };
        };
    }
    
    function RecurObj (args){
        this.args = args;
    }
    
    function recursor (){
        return new RecurObj(slice(0)(arguments));
    }
    
    function recur (fn){
        return function () {
            var result = new RecurObj(slice(0)(arguments));
            
            while (result instanceof RecurObj) {
                result = apply(fn, cons(recursor, result.args));
            }
            
            return result;
        };
    }
    
    // JFP core functions
    j.always = j.enforce('* => [*] => *', always);
    j.apply = j.enforce('function, array<*> => *', apply);
    j.cons = j.enforce('*, array<*> => array<*>', cons);
    j.either = j.enforce('string => * => * => *', either);
    j.identity = j.enforce('* => *', identity);
    j.maybe = j.enforce('string => * => maybe<*>', maybe);
    j.partial = j.enforce('function, [*] => [*] => *', partial('left'));
    j.recur = j.enforce('function => [*] => *', recur);
    j.rpartial = j.enforce('function, [*] => [*] => *', partial('right'));
    j.slice = j.enforce('int => taggedUnion<array<*>;arguments>, [int] => array<*>', slice);

})(jfp);