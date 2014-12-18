(function(j){

    function concat(original, extension){
        var result = j.either([], original),
            sanitizedExtension = j.either([], extension),
            i;

        //This is the most performant way to perform this concatenation. Trust me.
        for(i = 0; i < sanitizedExtension.length; i++){
            result.push(sanitizedExtension[i]);
        }

        return result;
    }
    
    function slice(begin, valueSet, end){
        return (!end) ? Array.prototype.slice.call(valueSet, begin) :
                        Array.prototype.slice.call(valueSet, begin, end);
    }

    j.concat = concat;
    j.slice = slice;

})(jfp);