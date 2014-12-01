jfp = (function(){
    'use strict';

    return {};

})();

j = jfp;

(function(j){
    'use strict';

    function either(defaultValue, optionValue){
        return (!!optionValue) ? optionValue : defaultValue;
    }

    j.either = either;

})(jfp);