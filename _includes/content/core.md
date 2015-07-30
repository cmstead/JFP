##Core Functions


**apply**

- Performance: O(1)
- Arguments: {function} userFn, {array} values
- Description: Calls provided function with values in passed array


####Example



    function add(a, b){
        return a + b;
    }

    j.apply(add, [1, 2]);

    //3




**compose**

- Performance: O(n) on setup where n is the function count, O(1) at execution time
- Arguments: {function} [arguments]
- Description: Performs function composition on functions provided


####Example



    function isUndefined(value){
        return typeof value === 'undefined';
    }

    function not(value){
        return !value;
    }

    var notUndefined = j.compose(not, isUndefined);

    notUndefined(null);

    //true

    notUndefined(undefined);

    //false




**countArguments**

- Performance: unmeasured
- Arguments: {function} userFn
- Description: Counts the number of arguments required for a function


####Example



    j.countArguments(function(arg1, arg2, arg3){});

    //3




**curry**

- Performance: unmeasured - requires on countArguments
- Arguments: {function} userFn, [optional] arguments
- Description: Curries function based on argument count -- partial application special case


####Example



    function add(a, b);

    j.curry(add)(1)(2);

    //3

    j.curry(add, 1)(2);

    //3

    j.curry(add, 1, 2);

    //3




**identity**

- Performance: O(1)
- Arguments: {any} value
- Description: Returns value passed in, via direct return


####Example



    j.identity('my value');

    //my value




**partial**

- Performance: O(1)
- Arguments: {function} userFn, [optional] arguments
- Description: Generalized partial application function.


####Example



    function divide(a, b){
        return a / b;
    }

    j.partial(divide, 6)(2);

    //3




**pipeline**

- Performance: O(n) on setup where n is the argument count, O(1) on execution
- Arguments: {function} [arguments]
- Description: Executes functions in left-to-right order pipelining the output from current to the next


####Example



    function add(a, b){
        return a + b;
    }

    function divideBy2(value){
        return value / 2;
    }

    j.pipeline(add, divideBy2)(4, 6);

    //5




**recur**

- Performance: O(n) - best case, depends on outside operations
- Arguments: {function} userFn, [optional] arguments
- Description: Tail-optimized recursion function


####Example



    function factorial(recur, base, result){
        var sanitizedResult = j.either(1, result);
        return (base >= 0) ? recur(base - 1, sanitizedResult * base) : sanitizedResult;
    }

    j.recur(factorial, 5);

    //120




**rpartial**

- Performance: O(1)
- Arguments: {function} userFn, [optional] arguments
- Description: partial application, applies initial arguments to the right-most position of userFn


####Example



    function divide(a, b){
    return a / b;
    }

    j.rpartial(divide, 4)(2);

    //0.5


