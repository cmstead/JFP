##Core Functions

**j**

- Performance: Identical to j.curry
- Arguments: {string} jfpFunctionName[, {any} arguments]
- Description: Shorthand for j.curry, only accepts string arguments for jfp functions

####Example

    j('conj')(1)([2, 3, 4]); // [1, 2, 3, 4]
    j('pick', 'key')({ key: 'foo' }); // 'foo'


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

- Performance: unmeasured - relies on countArguments
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

**deref**

- Performance: O(n)
- Arguments: {string} deepReference, {object|array} source
- Optional argument arrangement: {object|array} source, {string} deepReference
- Description: Deref resolves a dot-delimited deep object reference

####Example

    var myObj = {
        data: {
            aList: [
                'foo',
                'bar',
                'baz'
            ]
        }
    };
    
    j.deref('data.aList.1', myObj); // bar
    j.deref('data.aList.baz', myObj); // null

**execute**

- Performance: O(1)
- Arguments: {function} userFn, [optional] arguments
- Description: Executes function with provided arguments


####Example

    j.execute(j.add); // 0
    j.execute(j.add, 5); // 5
    j.execute(j.add, 5, 7); // 12

**getType**

- Performance: O(1)
- Arguments: {any}
- Description: returns type of value; handles array case

####Example

    j.getType('foo'); // string
    j.getType({}); // object
    j.getType([]); // array

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

**partialReverse**

- Performance: O(n) where n is the number of arguments
- Arguments: {function} userFn[, {any} arguments]
- Description: Performs partial application and returns a function with remaining arguments reversed

####Example

    function concatThree(astr, bstr, cstr){
        return astr + bstr + cstr;
    }
    
    j.partialReverse(concatThree, 'foo')('bar', 'baz'); // foobazbar


**pipeline**

- Performance: O(n) where n is the number of functions
- Arguments: {any} value {function} pipelinedFunctions
- Description: Executes functions in order, passing value to first and output from previous to input of next


####Example

    j.pipeline([1, 2, 3, 4],
               j('reduce', j.add, 0),
               j('multiply', 3));
    // 30

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

**reverseArgs**

- Performance: O(1) on return, O(n) on function execution, where n is the number of arguments
- Arguments: {function} userFn
- Description: Returns a function which takes arguments in reverse order

####Example

    function strConcat(astr, bstr){
        return astr + bstr;
    }
    
    j.reverseArgs(strConcat)('foo', 'bar'); // barfoo


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

**splitPartial**

- Performance: O(1)
- Arguments: {function} userFn[, {array} leftArguments[, {array} rightArguments]]
- Description: partially applies left and right arguments to a function, resolving remaining arguments in the middle

####Example

    function addToFakeSet (obj, value) {
        obj[key] = true;
        return obj;
    }
    
    var reduceToSet = j.splitPartial(j.reduce, [addToFakeSet], [{}]);
    
    reduceToSet([1, 2, 3, 4, 2, 5, 1, 1, 3]); // { 1: true, 2: true, 3: true, 4: true, 5: true }

**shortCircuit**

- Performance: O(1)
- Arguments: {any} defaultValue, {function} userFn, {any} testValue
- Description: Tests testValue for truthy value, if true, userFn is executed with testValue, otherwise returns default value

####Example

    j.shortCircuit(0, j('apply', j.add), [1, 2]); // 3
    j.shortCircuit(0, j('apply', j.add), null); // 0
