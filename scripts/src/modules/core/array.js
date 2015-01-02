(function(j){

    function slice(begin, valueSet, end){
        return (!end) ? Array.prototype.slice.call(valueSet, begin) :
                        Array.prototype.slice.call(valueSet, begin, end);
    }

    function concat(original, extension){
        var result = j.slice(0, j.either([], original)),
            sanitizedExtension = j.either([], extension),
            i;

        //This is the most performant way to perform this concatenation. Trust me.
        for(i = 0; i < sanitizedExtension.length; i++){
            result.push(sanitizedExtension[i]);
        }

        return result;
    }

    j.concat = concat;
    j.slice = slice;

})(jfp);