(function(j){

    function equal(a, b){
        var isNotUndefined = j.compose(j.not, j.isUndefined);

        return (j.and(isNotUndefined(a),
            isNotUndefined(b))) ? a === b : false;
    }

    function greater(a, b){
        if(j.or(j.isUndefined(a), j.isUndefined(b))){
            throw new TypeError('Inequality comparisons require two values');
        }

        return a > b;
    }

    function geq(a, b){
        return j.or(equal(a, b), greater(a, b));
    }

    function isEven(value){
        return equal(0, j.mod(value, 2));
    }

    function isPositive(value){
        return greater(value, 0);
    }

    function isZero(value){
        return value === 0;
    }

    function isNegative(value){
        return j.compose(j.not, j.or)(isPositive(value), isZero(value));
    }

    function isInt(value){
        return equal(j.truncate(value), value);
    }

    j.isEven = isEven;
    j.isInt = isInt;
    j.isNegative = isNegative;
    j.isNonNegative = j.compose(j.not, isNegative);
    j.isNonPositive = j.compose(j.not, isPositive);
    j.isNonZero = j.compose(j.not, isZero);
    j.isOdd = j.compose(j.not, isEven);
    j.isPositive = isPositive;
    j.isZero = isZero;

    //Special case predicate naming is intended for these functions
    //There is a general expectation that these not be named with 'is'
    j.equal = equal;
    j.geq = geq;
    j.greater = greater;
    j.leq = j.compose(j.not, greater);
    j.less = j.compose(j.not, geq);

})(jfp);