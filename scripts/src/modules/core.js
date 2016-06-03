(function (j) {
    'use strict';

    var isUndefined = j.isTypeOf('undefined');

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
        return isUndefined(value) ? values : concat([value], values);
    }
    
    function conj (value, values){
        return isUndefined(value) ? values : concat(values, [value]);
    }

    function slice (start, end){
        return function (valueSet) {
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
            var result = apply(recursor, slice(0)(arguments));
            
            while (result instanceof RecurObj) {
                result = apply(fn, cons(recursor, result.args));
            }
            
            return result;
        };
    }
    
    function compose (){
        var fns = slice(0)(arguments).reverse();
        var fn = fns.shift();
        var isNil = j.isTypeOf('nil');
        
        return function () {
            return recur(execCompose)(apply(fn, slice(0)(arguments)), fns);
            
            function execCompose (recur, result, fns){
                return isNil(fns) ? result : recur(fns[0](result), slice(1)(fns));
            }
        };
    }
    
    function curry (fn, count, args){
        var curriable = function (){
            var args = concat(curriable.args, slice(0)(arguments));
            var done = curriable.fnLength <= args.length;
            
            return done ? apply(curriable.fn, args) : curry(fn, curriable.fnLength, args); 
        };
        
        curriable.fn = fn;
        curriable.args = maybe('array')(args);
        
        Object.defineProperty(curriable, 'fnLength', {
            value: isUndefined(count) ? fn.length : count,
            writeable: false
        });
        
        return curriable;
    }
    
    // JFP core functions
    j.always = j.enforce('* => [*] => *', always);
    j.apply = j.enforce('function, array<*> => *', apply);
    j.compose = j.enforce('[function] => function', compose);
    j.concat = j.enforce('array<*>, array<*> => array<*>', concat);
    j.conj = j.enforce('*, array<*> => array<*>', conj);
    j.cons = j.enforce('*, array<*> => array<*>', cons);
    j.curry = j.enforce('function, [int], [array<*>] => [*] => *', curry);
    j.either = j.enforce('string => * => * => *', either);
    j.identity = j.enforce('* => *', identity);
    j.maybe = j.enforce('string => * => maybe<*>', maybe);
    j.partial = j.enforce('function, [*] => function', partial('left'));
    j.recur = j.enforce('function => function', recur);
    j.rpartial = j.enforce('function, [*] => function', partial('right'));
    j.slice = j.enforce('int, [int] => taggedUnion<array<*>;arguments> => array<*>', slice);

})(jfp);