
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

**contains**

- Performance: O(n) (Pathological)
- Arguments: {any} value, {array} list
- Description: Returns true if array contains value only supports primitives and pointers

####Example

    j.contains(5, [1, 2, 3, 4, 5, 6]);
    
    // true

**difference**

- Performance: O(n log n)
- Arguments: {array} listA, {array} listB
- Description: takes the difference of listA against listB

####Example

    j.difference([1, 2, 3, 4, 5], [2, 4, 5]);
    
    // [1, 3]

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

**every**

- Performance: O(n)
- Arguments: {function} predicate, {array} list
- Description: returns true if all values of array satisfy predicate

####Example

    j.every(j.odd, [1, 3, 5, 6, 7]);
    
    // false

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

**intersect**

- Performance: O(n log n)
- Arguments: {array} listA, {array} listB
- Description: Takes the intersection of two arrays

####Example

    j.intersect([1, 2, 3], [2, 3, 4]);
    
    // [2, 3]

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

    j.map(function(value){ return value * 3; }, [1, 2, 3, 4, 5, 6]);
    
    // [ 3, 6, 9, 12, 15, 18 ]

**multiPartition**

- Performance: O(nlogn)
- Arguments: {function} predicate, {array} predicateArgs, {array} values
- Description: Returns an array of arrays partitioned on values in predicateArgs

###Example
    
    var recordset = [
        { id: 1, foreignId: 1 },
        { id: 2, foreignId: 2 },
        { id: 3, foreignId: 1 },
        { id: 4, foreignId: 3 },
        { id: 5, foreignId: 4 }
    ];
    
    function foreignIdMatch (id, record) {
        return record.foreignId === id;
    }
    
    j.multipartition(foreignIdMatch, [1, 2], recordset);
    
    /*
    [
        [ { id: 1, foreignId: 1 }, { id: 3, foreignId: 1 } ],
        [ { id: 2, foreignId: 2 } ],
        [ { id: 4, foreignId: 3 }, { id: 5, foreignId: 4 } ]
    ];
    */

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

**numberOf**

- Performance: O(n)
- Arguments: {function} predicate, {array} list
- Description: Returns count of elements satisfying predicate

####Example

    j.numberOf(j.even, [1, 2, 3, 4, 5, 6]);
    
    // 3

**partition**

- Performance: O(n)
- Arguments: {function} predicate, {array} values
- Description: Partitions array into array of two arrays, using predicate as identifier

###Example

    j.partition(j.even, [1, 2, 3, 4, 5]);
    
    // [ [2, 4], [1, 3, 5] ]

**reduce**

- Performance: O(n)
- Arguments: {function} userFn, {array} values[, {any} initialState]
- Description: Reduces array to single element of any type through application of userFn

####Example

    j.reduce(function(a, b){ return a + b; }, [1, 2, 3, 4, 5]); // 15
    j.reduce([1, 2, 3, 4], j.add, 10); // 20

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

**some**

- Performance: O(n)
- Arguments: {function} predicate, {array} list
- Description: Returns true if any value in the list passes predicate function otherwise false

####Example

    j.some(j.even, [1, 2, 3, 4, 5]);
    
    // true

**sort**

- Performance: O(n log n)
- Arguments [{function} comparator,] {array} list
- Description: Sorts array with quick sort naturally or with comparator

####Example

    j.sort([1, 3, 2, 5, 4]);
    
    // [1, 2, 3, 4, 5]
    
    function comparator(a, b){
        var b - a; 
    }
    
    j.sort(comparator, [1, 3, 2, 5, 4]);
    
    // [5, 4, 3, 2, 1]

**symmetricDifference**

- Performance: O(n log n) to O(slow) (pathological)
- Arguments: {array} listA, {array} listB
- Description: Takes the symmetric difference of two arrays

####Example

    j.symmetricDifference([1, 2, 3, 4], [2, 3, 4, 5]);
    
    // [1, 5]

**take**

- Performance: O(1)
- Arguments: {int} count, {array} values
- Description: returns first n values of array where n is provided count

####Example

    j.take(3, [1, 2, 3, 4, 5]);
    
    // [ 1, 2, 3 ]

**union**

- Performance: O(n log n)
- Arguments: {array} listA, {array} listB
- Description: takes the union of two arrays

####Example

    j.union([1, 2, 3], [2, 3, 4]);
    
    // [1, 2, 3, 4]


**unique**

- Performance: O(n*log(n))
- Arguments: {array of comparable} valueSet
- Description: returns a sorted array of unique values

####Example

    j.unique([2, 5, 2, 3, 2, 4, 3, 1]);
    
    // [ 1, 2, 3, 4, 5 ]
