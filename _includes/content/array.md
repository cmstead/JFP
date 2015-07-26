##Array Functions

**compact**

- Performance: O(n)
- Arguments: {array} values
- Description: Removes all falsey values from array

####Example

    j.compact(['my string', false, 0, 52, undefined]);
    
    // [ 'my string', 52 ]

**concat**

- Performance: O(n)
- Arguments: {array} original, {array} extension
- Description: Extends original array with values from extension array

####Example

    j.concat([1, 2, 3], [4, 5, 6]);
    
    // [ 1, 2, 3, 4, 5, 6 ]

**conj**

- Performance: O(1)
- Arguments: {any} value, {array} destination
- Description: Returns new array with value postpended

####Example

    j.conj(4, [1, 2, 3]);
    
    // [ 1, 2, 3, 4 ]

**cons**

- Performance: O(n)
- Arguments: {any} value, {array} source
- Description: Returns new array beginning with value and extended with source array

####Example

    j.cons(4, [1, 2, 3]);
    
    // [ 4, 1, 2, 3 ]

**drop**

- Performance: O(n)
- Arguments: {int} index, {array} valueSet
- Description: Returns new array with value at the provided index removed

####Example

    j.drop(0, [1, 2, 3, 4, 5]);
    
    // [ 2, 3, 4, 5 ]
    
    j.drop(4, [1, 2, 3, 4, 5]);
    
    // [ 1, 2, 3, 4 ]
    
    j.drop(2, [1, 2, 3, 4, 5]);
    
    // [ 1, 2, 4, 5 ]

**dropFirst**

- Performance: O(n)
- Arguments: {array} valueSet
- Description: Returns new array with first value removed

####Example

    j.dropFirst([1, 2, 3, 4, 5]);
    
    // [ 2, 3, 4, 5 ]

**dropLast**

- Performance: O(n)
- Arguments: {array} valueSet
- Description: Returns new array with last value removed

####Example

    j.dropLast([1, 2, 3, 4, 5]);
    
    // [ 1, 2, 3, 4 ]

**each**

- Performance: O(n)
- Arguments: {function} userFn, {array} userArray
- Description: Performs userFn on each element of userArray

####Example

    j.each(function(value){ console.log(value); }, [1, 2, 3, 4, 5]);
    
    // 1
    // 2
    // 3
    // 4
    // 5

**filter**

- Performance: O(n)
- Arguments: {function} predicate, {array} userArray
- Description: Returns array containing values which pass predicate test

####Example

    j.filter(function(value){ return value % 2 === 0; }, [1, 2, 3, 4, 5, 6]);
    
    // [ 2, 4, 6 ]

**find**

- Performance: O(n)
- Arguments: {function} predicate, {array} userArray
- Description: Returns first value that passes predicate function

####Example

    j.find(function(value){ return value % 2 === 0; }, [1, 2, 3, 4, 5, 6]);
    
    // 2

**first**

- Performance: O(1)
- Arguments: {array} values
- Description: Returns first value in array

####Example

    j.first([1, 2, 3, 4, 5, 6]);
    
    // 1

**last**

- Performance: O(1)
- Arguments: {array} values
- Description: Returns last value in array

####Example

    j.first([1, 2, 3, 4, 5, 6]);
    
    // 6

**lastIndex**

- Performance: O(1)
- Arguments: {array} values
- Description: Returns index of last element in array

####Example

    j.first([1, 2, 3, 4, 5, 6]);
    
    // 5

**map**

- Performance: O(n)
- Arguments: {function} userFn, {array} userArray
- Description: Returns new array containing values mapped through userFn

####Example

    j.map(function(value){ return value - 3; }, [1, 2, 3, 4, 5, 6]);
    
    // [ 3, 6, 9, 12, 15, 18 ]

**nth**

- Performance: O(1)
- Arguments: {int} index, {array} valueSet
- Description: Returns value at nth position of valueSet

####Example

    j.nth(0, [1, 2, 3, 4, 5, 6]);
    
    // 1
    
    j.nth(5, [1, 2, 3, 4, 5, 6]);
    
    // 6
    
    j.nth(3, [1, 2, 3, 4, 5, 6]);
    
    // 4

**reduce**

- Performance: O(n)
- Arguments: {function} userFn, {array} values
- Description: Reduces array to single element of any type through application of userFn

####Example

    j.reduce(function(a, b){ return a + b; }, [1, 2, 3, 4, 5]);
    
    //15

**rest**

- Performance: O(1)
- Arguments: {array} values
- Description: Returns new array without first element

####Example

    j.rest([1, 2, 3, 4, 5]);
    
    // [ 2, 3, 4, 5 ]

**slice**

- Performance: O(1) likely executes in O(n) time within Javascript runtime
- Arguments: {int} begin, {array} valueSet, {int} end
- Description: Returns slice of provided array

####Example

    j.slice(0, [1, 2, 3, 4, 5]);
    
    // [ 1, 2, 3, 4, 5 ]
    
    j.slice(2, [1, 2, 3, 4, 5]);
    
    // [ 4, 5 ]
    
    j.slice(2, [1, 2, 3, 4, 5], 3);
    
    // [ 4 ]

**take**

- Performance: O(1)
- Arguments: {int} count, {array} values
- Description: returns first n values of array where n is provided count

####Example

    j.take(3, [1, 2, 3, 4, 5]);
    
    // [ 1, 2, 3 ]

**unique**

- Performance: O(n*log(n))
- Arguments: {array of comparable} valueSet
- Description: returns a sorted array of unique values

####Example

    j.unique([2, 5, 2, 3, 2, 4, 3, 1]);
    
    // [ 1, 2, 3, 4, 5 ]
