(function(j){
    'use strict';
    
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
    
    function equal(a, b){
        var aIsValue = j.not(j.isNull(a) || j.isUndefined(a)),
            bIsValue = j.not(j.isNull(b) || j.isUndefined(b));
        return (aIsValue && bIsValue) ? a === b : false;
    }
    
    j.equal = equal;
    j.range = range;
    
})(jfp);