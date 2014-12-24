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
    
    j.range = range;
    
})(jfp);