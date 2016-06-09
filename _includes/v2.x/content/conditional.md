##Conditional Functions


**either**

- Performance: O(1)
- Arguments: {any} defaultValue, {any, nullable} optionValue, {string} optionValueType
- Description: Returns defaultValue on falsey optionValue or optionValue if it is truthy

####Example

    j.either('default', null); // default
    j.either('default', 'my string'); // my string
    j.either(10, 0, 'number'); // 0

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

**eitherType**

- Performance: O(1)
- Arguments: {string} type[, {any} defaultValue[, {any} value]]
- Description: applies type argument to either function and curries remaining function

###Example

    // All of the following execution patterns are equivalent
    j.eitherType('string', 'default', null); // default
    j.eitherType('string', 'default')(null);
    j.eitherType('string')('default', null);
    j.eitherType('string')('default')(null);

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
- Arguments: {any} value[, {string} valueType]
- Description: Returns value if truthy, nulll if falsey. Optionall, returns value if it matches valueType, null if not.

**maybeType**

- Performance: O(1)
- Arguments: {string} type[, {any} value]
- Description: Applies type to maybe and returns function to apply values to

###Example

    var maybeString = j.maybeType('string');
    
    maybeString('foo'); // foo
    maybeString({}); // null
    j.maybeType('string')([]); // null
    j.maybeType('string', []); // null

####Example

    j.maybe(undefined); // null
    j.maybe('foo'); // foo
    j.maybe(5, 'string'); // null
    j.maybe(0, 'number'); // 0
    

**when**

- Performance: O(1) function execution varies on implementation
- Arguments: {boolean} checkValue, {function} userFn, [optional] arguments
- Description: executes function with passed arguments on a truthy checkValue


####Example



    when(true, function(myValue){ console.log(myValue); }, "Hello, world!");

    //Hello, world!
