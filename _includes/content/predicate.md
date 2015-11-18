##Predicate Functions


**and**

- Performance: O(n)
- Arguments: [optional] {boolean} arguments
- Description: Checks that all provided values are truthy

####Example

    j.and();

    //true

    j.and(true, 1);

    //true

    j.and(true, false);

    //false

**composePredicate**

- Performance: O(n)
- Arguments: {array} predicates, {any} value
- Description: composes predicates using either the "and" or the "or" combinator to produce a new composite predcate function

####Example

    var between3And5 = j.composePredicate(j('less', 3), j('greater', 5)),
        multipleOf3Or5 = j.composePredicate(j('isMultipleOf', 3), j('isMultipleOf', 5), j.or);
    
    j.filter(between3And5, [1, 2, 3, 4, 5]); // [4]
    j.filter(multipleOf3Or5, [1, 2, 3, 4, 5, 6]); // [3, 5, 6]

**isArray**

- Performance: O(1)
- Arguments: {any} value
- Description: Returns true if value is an array, otherwise false

####Example

    j.isArray([]);

    //true

    j.isArray({});

    //false

**isBoolean**

- Performance: O(1)
- Arguments: {any} value
- Description: Returns true if value is a boolean value, otherwise false


####Example



    j.isBoolean(false);

    //true

    j.isBoolean('true');

    //false




**isEven**

- Performance: O(1)
- Arguments: {number} value
- Description: returns true if number is even, otherwise false


####Example



    j.isEven(2);

    //true

    j.isEven(3);

    //false




**isInt**

- Performance: O(1)
- Arguments: {number} value
- Description: returns true if number is an integer, otherwise false


####Example



    j.isInt(2);

    //true

    j.isInt(3.14159);

    //false

**isMultiple**

- Performance: O(1)
- Arguments: {int} baseValue, {int} testValue
- Description: returns true if testValue is a multiple of baseValue else false

####Example

    j.isMultiple(3, 6); // true
    j.isMultiple(2, 15); // false

**isNegative**

- Performance: O(1)
- Arguments: {number} value
- Description: returns true if number is less than 0, otherwise false


####Example



    j.isNegative(-2);

    //true

    j.isNegative(5);

    //false




**isNonNegative**

- Performance: O(1)
- Arguments: {number} value
- Description: returns true if number is 0 or greater, otherwise false


####Example



    j.isNonNegative(0);

    //true

    j.isNonNegative(3);

    //true

    j.isNonNegative(-5);

    //false




**isNonPositive**

- Performance: O(1)
- Arguments: {number} value
- Description: returns true if number is 0 or less, otherwise false


####Example



    j.isNonPositive(0);

    //true

    j.isNonPositive(-2);

    //true

    j.isNonPositive(7);

    //false




**isNonZero**

- Performance: O(1)
- Arguments: {number} value
- Description: returns true if number is not 0, otherwise false


####Example



    j.isNonZero(6);

    //true

    j.isNonZero(-2.85);

    //true

    j.isNonZero(0);

    //false




**isNull**

- Performance: O(1)
- Arguments: {any} value
- Description: Returns true if value is null, otherwise false


####Example



    j.isNull(null);

    //true

    j.isNull(undefined);

    //false




**isNumber**

- Performance: O(1)
- Arguments: {any} value
- Description: Returns true if value is a number, otherwise false


####Example



    j.isNumber(1234);

    //true

    j.isNumber(0x1A);

    //true

    j.isNumber('1234);

    //false




**isNumeric**

- Performance: O(1)
- Arguments: {any} value
- Description: Returns true if value is a number or a string matching a numeric pattern, otherwise false


####Example



    j.isNumeric(1234.33);

    //true

    j.isNumeric('0x1A');

    //true

    j.isNumeric('1234');

    //false




**isObject**

- Performance: O(1)
- Arguments: {any} value
- Description: Returns true if value is an object, otherwise false


####Example



    j.isObject({});

    //true

    j.isObject([]);

    //true

    j.isObject(undefined);

    //false




**isOdd**

- Performance: O(1)
- Arguments: {number} value
- Description: returns true if number is odd, otherwise false


####Example



    j.isOdd(3);

    //true

    j.isOdd(10);

    //false

**isPair**

- Performance: O(1)
- Arguments: {array} value
- Description: Verifies provided value is an array of length 2. Shorthand for j('isTuple', 2)

####Example

    j.isPair(null); // false
    j.isPair([1, 2]); // true
    j.isPair([1, 2, 3, 4]); // false

**isPositive**

- Performance: O(1)
- Arguments: {number} value
- Description: returns true if number greater than 0, otherwise false


####Example



    j.isPositive(3);

    //true

    j.isPositive(-2.414);

    //false

**isPrimitive**

- Performance: O(1);
- Arguments: {any} value
- Description: returns true if value has a primitive type, otherwise false

####Example

    j.isPrimitive(55); // true
    j.isPrimitive({}); // false

**isSingle**

- Performance: O(1)
- Arguments: {array} value
- Description: Verifies provided value is an array of length 1. Shorthand for j('isTuple', 1)

####Example

    j.isSingle(null); // false
    j.isSingle([1]); // true
    j.isSingle([1, 2, 3, 4]); // false

**isString**

- Performance: O(1)
- Arguments: {any} value
- Description: Returns true if value is a string, otherwise false


####Example



    j.isString('A string');

    //true

    j.isString([]);

    //false

**isTriple**

- Performance: O(1)
- Arguments: {array} value
- Description: Verifies provided value is an array of length 3. Shorthand for j('isTuple', 3)

####Example

    j.isTriple(null); // false
    j.isTriple([1, 2, 3]); // true
    j.isTriple([1, 2, 3, 4]); // false

**isTruthy**

- Performance: O(1)
- Arguments: {any} value
- Description: Returns true if value resolves to truthy, otherwise false

####Example

    j.isTruthy(true);

    //true

    j.isTruthy(1);

    //true

    j.isTruthy('I am a string.');

    //true

    j.isTruthy(null);

    //false

**isTuple**

- Performance: O(1)
- Arguments: {int} size, {array} value
- Description: Verifies provided value is an array and that the array is of length "size"

####Example

    j.isTuple(3, null); // false
    j.isTuple(2, [1, 2]); // true
    j.isTuple(1, [1, 2, 3, 4]); // false

**isType**

- Performance: O(1)
- Arguments: {string} typeString, {any} value
- Description: returns true if value type and typeString match

####Example

    j.isType('string', 'foo'); // true
    j.isType('string', null); // false
    j.isType('array', []); // true

**isUndefined**

- Performance: O(1)
- Arguments: {any} value
- Description: Returns true if value is undefined, otherwise false


####Example



    j.isUndefined(undefined);

    //true

    j.isUndefined(null);

    //false




**isZero**

- Performance: O(1)
- Arguments: {number} value
- Description: returns true if number is 0, otherwise false


####Example



    j.isZero(0);

    //true

    j.isZero(1);

    //false




**not**

- Performance: O(1)
- Arguments: {any} value
- Description: Returns true if value is falsey, otherwise false


####Example



    j.not(true);

    //false

    j.not(0);

    //true




**or**

- Performance: O(n)
- Arguments: [optional] {boolean} arguments
- Description: Checks that any of the provided values are truthy


####Example



    j.or();

    //false

    j.or(true);

    //true

    j.or(true, false, 'true');

    //true

    j.or(0, false, null);

    //false




**xor**

- Performance: O(1)
- Arguments: {boolean} a, {boolean} b
- Description: performs an exclusive or check on passed boolean values


####Example



    j.xor(true, false);

    //true

    j.xor(false, true);

    //true

    j.xor(true, true);

    //false

    j.xor(false, false);

    //false


