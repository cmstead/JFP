##Conditional Functions


**either**

- Performance: O(1)
- Arguments: {any} defaultValue, {any, nullable} optionValue
- Description: Returns defaultValue on falsey optionValue or optionValue if it is truthy


####Example



    j.either('default', null);

    //default

    j.either('default', 'my string');

    //my string




**eitherIf**

- Performance: O(1)
- Arguments: {any} defaultValue, {any, nullable} testValue, {boolean} predicate
- Description: Returns defaultValue on falsey optionValue or false predicate or optionValue if it is truthy and predicate is true


####Example



    j.eitherWhen('default', 'yay!', true);

    //yay!

    j.eitherWhen('default', null, true);

    //default

    j.eitherWhen('default', 'yay!', false);

    //default




**eitherWhen**

- Performance: O(1)
- Arguments: {any} defaultValue, {boolean} predicateValue, {function} userFn
- Description: returns userFn output on true predicateValue and truthy otherwise default value


####Example



    j.eitherWhen('default', false, j.identity);

    //default

    j.eitherWhen('default', true, j.partial(j.identity, false));

    //default

    j.eitherWhen('default', true, j.partial(j.identity, 'yay!'));

    //yay!




**maybe**

- Performance: O(1)
- Arguments: {any} defaultValue, {function} userFn, {any, nullable} optionValue
- Description: Returns default value on falsey optionValue or userFn(optionValue) if optionValue is truthy


####Example



    function multiplyBy2(value){
    return value * 2;
    }

    j.maybe(1, multiplyBy2, null);

    //1

    j.maybe(1, multiplyBy2, 0);

    //0

    j.maybe(1, multiplyBy2, 2);

    //4




**when**

- Performance: O(1) function execution varies on implementation
- Arguments: {boolean} checkValue, {function} userFn, [optional] arguments
- Description: executes function with passed arguments on a truthy checkValue


####Example



    when(true, function(myValue){ console.log(myValue); }, "Hello, world!");

    //Hello, world!
