##Math Functions


**add**

- Performance: O(n)
- Arguments: [optional] arguments
- Description: Returns the sum of all numbers passed to add


####Example



    j.add();

    //0

    j.add(1);

    //1

    j.add(1, 2);

    //3

    j.add(1, 2, 3, 4, 5);

    //15




**divide**

- Performance: O(n)
- Arguments: [optional] arguments
- Description: divides first value by each other value passed to divide


####Example



    j.divide();

    //1

    j.divide(12);

    //1

    j.divide(12, 2);

    //6

    j.divide(12, 2, 3);

    //2




**equal**

- Performance: O(1)
- Arguments: {any} a, {any} b
- Description: returns true if a and b are strictly equal, false otherwise


####Example



    j.equal(1, 1);

    //true

    j.equal(1, 2);

    //false




**fac**

- Performance: O(n)
- Arguments: {number} value
- Description: returns factorial of value


####Example



    j.fac(0);

    //1

    j.fac(5);

    //120




**inc**

- Performance: O(1)
- Arguments: {number} value
- Description: returns value + 1


####Example



    j.inc(5);

    //6




**geq**

- Performance: O(1)
- Arguments: {number} a, {number} b
- Description: Returns true if a is greater or equal to b, false otherwise


####Example



    j.geq(1, 1);

    //true

    j.geq(2, 1);

    //true

    j.geq(1, 2);

    //false




**greater**

- Performance: O(1)
- Arguments: {number} a, {number} b
- Description: Returns true if a is greater than b, false otherwise


####Example



    j.greater(2, 1);

    //true

    j.greater(1, 1);

    //false

    j.greater(1, 2);

    //false




**leq**

- Performance: O(1)
- Arguments: {number} a, {number} b
- Description: Returns true if a is less or equal to b, false otherwise


####Example



    j.leq(1, 2);

    //true

    j.leq(1, 1);

    //true

    j.leq(2, 1);

    //false




**less**

- Performance: O(1)
- Arguments: {number} a, {number} b
- Description: Returns true if a is less than b, false otherwise


####Example



    j.leq(1, 2);

    //true

    j.leq(1, 1);

    //true

    j.leq(2, 1);

    //false




**max**

- Performance: O(1)
- Arguments: {number} a, {number} b
- Description: returns the max of either a or b. If no values are passed, max returns -Number.MAX_VALUE


####Example



    j.max();

    //-1.7976931348623157e+308

    j.max(5);

    //5

    j.max(5, 6);

    //6




**min**

- Performance: O(1)
- Arguments: {number} a, {number} b
- Description: returns the minimum of either a or b. If no values are passed, min returns Number.MAX_VALUE


####Example



    j.min();

    //1.7976931348623157e+308

    j.min(5);

    //5

    j.min(5, 6);

    //5




**mod**

- Performance: O(1)
- Arguments: {number} a, {number} b
- Description: Returns the modulus of a and b


####Example



    j.mod(4, 2);

    //0

    j.mod(11, 4);

    //3




**multiply**

- Performance: O(n)
- Arguments: [optional] arguments
- Description: Returns the product of all values passed to multiply


####Example



    j.multiply();

    //1

    j.multiply(2);

    //2

    j.multiply(2, 3);

    //6

    j.multiply(2, 3, 4, 5);

    //120





**range**

- Performance: O(n)
- Arguments: {int} a, {int} b, {int} inc
- Description: returns range from a to b, excluding b, incremented by inc


####Example



    j.range(4);

    //[0, 1, 2, 3]

    j.range(2, 10);

    //[2, 3, 4, 5, 6, 7, 8, 9]

    j.range(0, 20, 4);

    //[0, 4, 8, 12, 16]

    j.range(100, 0, -10);

    //[100, 90, 80, 70, 60, 50, 40, 30, 20, 10]





**subtract**

- Performance: O(n)
- Arguments: [optional] arguments
- Description: Returns sum of the first value and the negative of all other provided values


####Example



    j.subtract();

    //0

    j.subtract(1);

    //1

    j.subtract(3, 2);

    //1

    j.subtract(8, 5, 3, 2, 1);

    //-3



