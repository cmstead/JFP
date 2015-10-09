(function(j){

    function throwWhenNotComparable(a, b){
        j.when(j.isUndefined(a) || j.isUndefined(b), function(){
            throw new TypeError('Inequality comparisons require two values');
        });
    }

    function greater(a, b){
        throwWhenNotComparable(a, b);
        return a > b;
    }

    function less(a, b){
        throwWhenNotComparable(a, b);
        return a < b;
    }

    function isInt(value){
        return j.equal(j.truncate(value), value);
    }

    var isNegative = j.partial(greater, 0),
        isPositive = j.partial(less, 0),
        isZero = j.partial(j.equal, 0),
        isEven = j.compose(isZero, j.rpartial(j.mod, 2));

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
    j.geq = j.compose(j.not, less);
    j.greater = greater;
    j.leq = j.compose(j.not, greater);
    j.less = less;

})(jfp);