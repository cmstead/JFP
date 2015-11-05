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

**isString**

- Performance: O(1)
- Arguments: {any} value
- Description: Returns true if value is a string, otherwise false


####Example



    j.isString('A string');

    //true

    j.isString([]);

    //false




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


