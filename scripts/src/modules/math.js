(function(j){
    'use strict';
    
    //This is a recursive add fn
    function adder(recur, current, valueSet){
        return (valueSet.length === 0) ?
                current :
                recur(current + j.first(valueSet), j.rest(valueSet));
    }
    
    function add(){
        return j.recur(adder, 0, j.slice(0, arguments));
    }
    
    //This is a recursive divide fn
    function divider(recur, current, valueSet){
        return (valueSet.length === 0) ?
                current :
                recur(current / j.first(valueSet), j.rest(valueSet));
    }
    
    function divide(){
        var args = j.slice(0, arguments),
            first = args.length ? j.first(args) : 1;
        return j.recur(divider, first, j.rest(args));
    }
    
    //This is a recursive multiply fn
    function multiplier(recur, current, valueSet){
        return (valueSet.length === 0) ?
                current :
                recur(current * j.first(valueSet), j.rest(valueSet));
    }
    
    function multiply(){
        return j.recur(multiplier, 1, j.slice(0, arguments));
    }
    
    //This is a recursive subtraction fn
    function subtractor(recur, current, valueSet){
        return (valueSet.length === 0) ?
                current :
                recur(current - j.first(valueSet), j.rest(valueSet));
    }
    
    function subtract(){
        var args = j.slice(0, arguments),
            first = args.length ? j.first(args) : 0;
        return j.recur(subtractor, first, j.rest(args));
    }
    
    function equal(a, b){
        var isNotUndefined = j.compose(j.not, j.isUndefined);
        
        return (j.and(isNotUndefined(a), 
                      isNotUndefined(b))) ? a === b : false;
    }
    
    function greater(a, b){
        if(j.isUndefined(a) || j.isUndefined(b)){
            throw new TypeError('Greater requires two variables for comparison');
        }
        
        return a > b;
    }
    
    function less(a, b){
        if(j.isUndefined(a) || j.isUndefined(b)){
            throw new TypeError('Less requires two variables for comparison');
        }
        
        return a < b;
    }
    
    function leq(a, b){
        return less(a, b) || equal(a, b);
    }
    
    function geq(a, b){
        return greater(a, b) || equal(a, b);
    }

    //This is a recursive constructor function for ranges
    function rangeBuilder(recur, currentRange, m, n){
        currentRange = (m <= n) ? j.conj(m, currentRange) : currentRange;
        return (++m <= n) ? recur(currentRange, m ,n) : currentRange;
    }
    
    function range(a, b){
        return j.recur(rangeBuilder,
                       j.conj(a),
                       j.either(0, a) + 1,
                       j.either(0, b));
    }

    j.add = add;
    j.divide = divide;
    j.equal = equal;
    j.geq = geq;
    j.greater = greater;
    j.leq = leq;
    j.less = less;
    j.multiply = multiply;
    j.range = range;
    j.subtract = subtract;
    
})(jfp);