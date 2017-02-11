## Signatures

JFP is enforced with Signet types and function signatures. Signature metadata can be accessed via the signature property.
All type signature information presented in the documentation reflects the Signet signatures attached to the functions.

~~~~
j.isTypeOf.signature; // string => * => boolean
j.slice.signature; // index => array<*> => array<*>
~~~~

## Types

### enforce

- Performance: O(n) (for n = number of leaves in type tree)
- Signature: `string, function => function`
- Description: Enforces intended function contract

~~~~
var add = j.enforce('number, number => number', function add (a, b) { return a + b; });
~~~~

### either

- Performance: O(1)
- Signature: `taggedUnion<typeString;predicate> => * => * => *`
- Description: Tests type of test value and returns test value if true and default value if false 

~~~~
j.either('number')(5)(0); // 0
j.either('number')(5)('foo'); // 5
~~~~

### either built-ins

JFP provides several pre-loaded either type functions both for speed and to help keep your code slim and trim

- eitherArray -- `j.either('array')`
- eitherBoolean -- `j.either('boolean')`
- eitherFunction -- `j.either('function')`
- eitherInt -- `j.either('int')`
- eitherNatural -- `j.either('natural')`
- eitherNumber -- `j.either('number')`
- eitherObject -- `j.either('object')`
- eitherString -- `j.either('string')`
- eitherConcatable -- `j.either('concatable')`
- eitherObjectInstance -- `j.either('objectInstance')`
- eitherReferencible -- `j.either('referencible')`
- eitherDefined -- `j.either('defined')`
- eitherNotNull -- `j.either('notNull')`

### isTypeOf

- Performance: O(1)
- Signature: `string => * => boolean`
- Description: Checks the type of a value

~~~~
j.isTypeOf('string')(5); // false
j.isTypeOf('nil')(j.nil); // true
~~~~

### maybe

- Performance: O(1)
- Signature: `taggedUnion<typeString;predicate> => * => maybe<defined>`
- Description: Tests type of test value and returns test value if true and nil if false

~~~~
j.maybe('string')('foo'); // 'foo'
j.maybe('number')('foo'); // j.nil

function isEven (x) {
    return j.isTypeOf('number')(x) && x % 2 === 0;
}

j.maybe(isEven)(5); // nill
j.maybe(isEven)(5); // nill
~~~~

### maybe built-ins

JFP provides a pre-loaded maybe defined type function both for speed and to help keep your code slim and trim

- maybeDefined -- `j.maybe('defined')`

### setJfpTypes

- Performance: O(1)
- Signature: `signet => signet`
- Description: Sets all JFP types on a local instance of signet

~~~~
var signetFactory = require('signet');

var signet = setJfpTypes(signetFactory());
~~~~

### sign

- Performance: O(n) (for n = number of leaves in type tree)
- Signature: `string, function => function`
- Description: Signs function with contract string

~~~~
var add = j.sign('number, number => number', function add (a, b) { return a + b; });
~~~~


### typeChain

- Performance: O(n) -- linear performance based on the depth of the type chain
- Signature: `string => string`
- Description: Provides an API to view the inheritance chain for a specified type

~~~~
typeChain('boundedInt'); // * -> number -> int -> boundedInt
typeChain('array'); // * -> object -> array
~~~~

### Type List

- `()`
- `*`
- `arguments`
- `array`
- `boolean`
- `bounded<>`
- `boundedInt<>`
- `boundedString<>`
- `comparable`
- `defined`
- `exists`
- `formattedString<>`
- `function`
- `index`
- `int`
- `maybe`
- `nil`
- `notNull`
- `notNil`
- `null`
- `number`
- `numeric`
- `object`
- `objectKey`
- `pair`
- `predicate`
- `string`
- `symbol`
- `taggedUnion<>`
- `tuple<>`
- `typeString`
- `undefined`

## Predicates

### and

- Performance: O(1)
- Signature: `comparable => comparable => boolean`

~~~~
j.and(true, true); // true
j.and(true, false); // false
~~~~

### equal

- Performance: O(1)
- Signature: `comparable => comparable => boolean`

~~~~
j.equal(5, 5); // true;
j.equal(5, 7); // false;
j.equal(5)(7); // false;
~~~~

### exists

- Performance: O(1)
- Signature: `* => boolean`
- Description: Returns true if value is not undefined and not null

~~~~
j.exists('a string); // true
j.exists(0); // true
j.exists(null); // false
j.exists(undefined); // false
~~~~

### invert

- Performance: O(1)
- Signature: `function => function`

~~~~
j.invert(j.isTypeOf('string')('foo')); // false
~~~~

### or

- Performance: O(1)
- Signature: `comparable => comparable => boolean`

~~~~
j.or(true, true); // true
j.or(true, false); // true
j.or(false, false); // false
~~~~

### xor

- Performance: O(1)
- Signature: `comparable => comparable => boolean`

~~~~
j.xor(true, true); // false
j.xor(true, false); // true
j.xor(false, false); // false
~~~~

### not

- Performance: O(1)
- Signature: `comparable => boolean`

~~~~
j.not(true); // false
j.not(5); // false
~~~~

### Type Predicates

JFP provides several type type predicates, all of which are pre-loaded isTypeOf function returns:

- isArray -- `j.isTypeOf('array')`
- isBoolean -- `j.isTypeOf('boolean')`
- isFunction -- `j.isTypeOf('function')`
- isNull -- `j.isTypeOf('null')`
- isNumber -- `j.isTypeOf('number')`
- isObject -- `j.isTypeOf('object')`
- isObjectInstance -- `j.isTypeOf('objectInstance')`
- isString -- `j.isTypeOf('string')`
- isUndefined -- `j.isTypeOf('undefined')`
- isNil -- `j.isTypeOf('nil')`
- isPair -- `j.isTypeOf('pair')`
- isPredicate -- `j.isTypeOf('predicate')`
- isInt -- `j.isTypeOf('int')`
- isNatural -- `j.isTypeOf('natural')`
- isNotNull -- `j.isTypeOf('notNull')`
- isNotNil -- `j.isTypeOf('notNil')`
- isConcatable -- `j.isTypeOf('concatable')`
- isDefined -- `j.isTypeOf('defined')`
- isComparable -- `j.isTypeOf('comparable')`
- isNumeric -- `j.isTypeOf('numeric')`
- isReferencible -- `j.isTypeOf('referencible')`


## Core

### always

- Performance: O(1)
- Signature: `* => [*] => *`
- Description: Returns a function which always returns the originally provided value

~~~~
var alwaysTrue = j.always(true);

alwaysTrue(); // true
alwaysTrue('over 9000'); // true
~~~~

### apply

- Performance: O(1)
- Signature: `function, array<*> => *`
- Description: Applies array of arguments to a function

~~~~
j.apply(add, [1, 2]); // 3
~~~~

### argumentsToArray

- Performance: O(1)
- Signature: `variant<array; arguments> => array`
- Description: Slices arguments or array at 0

~~~~
j.argumentsToArray(arguments); // [object Array]
~~~~

### compose

- Performance: O(n) (for n = length of function list)
- Signature: `function, function => function`
- Description: Composes two functions: compose(f, g)(x) = f(g(x))

~~~~
var isNotNumber = j.compose(j.not, j.isNumber);

isNotNumber(5); // false
isNotNumber('string'); // true
~~~~

### concat

- Performance: O(n)
- Signature: `array<*>, array<*> => array<*>`
- Description: Concatenates two arrays together; good for reducing over multiple arrays to concatenate them all

~~~~
var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];
var newArr = j.concat(arr1, arr2); // [1, 2, 3, 4, 5, 6]

arr1 === newArr; // false
arr2 === newArr; // false
~~~~

### conj

- Performance: O(n) (based on slice performance)
- Signature: `*, array<*> => array<*>`
- Description: Postpends value onto array of original values; this is a non-destructive action

~~~~
var originalArray = [1, 2, 3];
var newArray = j.conj(4, originalArray); // [1, 2, 3, 4];

newArray === originalArray; // false
~~~~

### cons

- Performance: O(n) (based on slice performance)
- Signature: `*, array<*> => array<*>`
- Description: Prepends value onto array of original values; this is a non-destructive action

~~~~
var originalArray = [1, 2, 3];
var newArray = j.cons(4, originalArray); // [4, 1, 2, 3];

newArray === originalArray; // false
~~~~

### curry

- Performance: O(1)
- Signature: `function, [int], [array<*>] => [*] => *`
- Description: Converts function into an optionally curried function

~~~~
function add  (a, b) {
    return a + b;
}

j.curry(add)(1)(2); // 3
j.curry(add)(1, 2); // 3
j.curry(add, 3)(1)(2)(3); // 3
~~~~

### foldlCompose

- Performance: O(n)
- Signature: `function, function, ... => function`
- Description: Composes multiple functions together left to right: foldlCompose(f, g, h)(x) = f(g(h(x)))

~~~
var compute = j.foldlCompose(
    j.addBy(1),
    j.multiplyBy(3),
    j.divideBy(2)
);

compute(12); // 19
~~~

### foldrCompose

- Performance: O(n)
- Signature: `function, function, ... => function`
- Description: Composes multiple functions together right to left: foldrCompose(f, g, h)(x) = h(g(f(x)))

~~~
var compute = j.foldrCompose(
    j.addBy(1),
    j.multiplyBy(3),
    j.divideBy(2)
);

compute(5); // 9
~~~

### rcurry

- Performance: O(1)
- Signature: `function, [int], [array<*>] => [*] => *`
- Description: Curries function as above, but each value in the original function is filled right to left instead of left to right; Multiple arguments are inserted in left to right order as received

~~~~
function divide (a, b) {
return a / b;
}

j.rcurry(divide)(1)(2); // 2
j.rcurry(divide)(1, 2); // 0.5
j.rcurry(divide)(2)(1); // 0.5
~~~~

### identity

- Performance: O(1)
- Signature: `* => *`

- Description: Accepts value `a` and returns value `a`

~~~~
j.identity('foo'); // foo
j.identity(42); // 42
~~~~

### partial

- Performance: O(1)
- Signature: `function, [*] => [*] => *`
- Description: Accepts a function and values to apply, returns a function which will apply remaining arguments and return a result

~~~~
function add (a, b) {
return a + b;
}

var inc = j.partial(add, 1);

inc(1); // 2
inc(5); // 6

inc(inc(inc(inc(1)))); // 4
~~~~

### pick

- Performance: O(1)
- Signature: `string => object => maybe<defined>`

~~~~
j.pick('foo')({ foo: 'bar' }); // bar
j.pick('foo')({ baz: 'bar' }); // j.nil
~~~~

### rcompose

- Performance: O(1);
- Signature: `function, function => function`
- Description: Composes two functions right to left: compose(f, g)(x) = g(f(x))

~~~
j.compose(j.addBy(1), j.divideBy(3))(8); // 3
~~~

### recur

- Performance: O(1)
- Signature: `function => function`
- Description: Tail-optimized recursion function which allows for the writing of recursive, over looping, algorithms

~~~~
var isUndefined = j.isTypeOf('undefined');
var isNil = j.isTypeOf('nil');

var sum = j.recur(function (recur, values, total) {
var result = isUndefined(total) ? 0 : total;
return isNil(values) ? total : recur(j.rest(values), total + j.first(values));
});
~~~~

### repeat

- Performance: O(n)
- Signature: `function => number => * => *`
- Description: Repeats provided function n times applying the result from the previous operation

~~~~
var isEven = j.isTypeOf(function (value) {
    return j.isTypeOf('int')(value) && value % 2 === 0;
});

function threeXPlusOneProblem (value) {
    return isEven(value) ? (value / 2) : (3 * value + 1);
}

j.repeat(threeXPlusOneProblem)(15)(7); // 1
j.repeat(j.concat('foo'))(3)(''); // "foofoofoo"
~~~~

### reverseArgs

- Performance: O(n)
- Signature: `function => [*] => *`
- Description: Accepts a function and returns a function which takes arguments in reverse order

~~~~
function divide (a, b) {
return a / b;
}

j.reverseArgs(divide)(2, 12); // 6
~~~~

### rpartial

- Performance: O(1)
- Signature: `function, [*] => [*] => *`
- Description: Similar to partial, but applies arguments in groups from right to left

~~~~
function divide (a, b) {
    return a / b;
}

var divBy2 = j.rpartial(divide, 2);

divBy2(1); // 0.5
divBy2(4); // 2

divBy2(divBy2(divBy2(divBy2(12)))); // 0.75
~~~~

### slice

- Performance: O(n) (estimated JS performance characteristic)
- Signature: `int, [int] => taggedUnion<array<*>;arguments> => array<*>`
- Description: Partial application implementation of slice with optional start and end values applied at beginning of function call

~~~~
j.slice(1)([1, 2, 3, 4]); // [2, 3, 4]

function foo() {
var args = j.slice(0)(arguments);
// ...
}
~~~~

### cond

- Performance: O(n) (for n = number of conditions)
- Signature: `function<function;function;boolean> => *`
- Description: Conditional expression which uses where, then and default to express conditional behaviors

~~~~
j.cond(function(where, then, _default){
    when(j.isTypeOf(number)(a), then(j.multiplyBy(3), a));
    when(_default, then(j.always(a)));
});
~~~~

## Array

### all

- Performance: O(n)
- Signature: `function => array<*> => boolean`
- Description: Verify all values in array satisfy predicate

~~~~
j.all(j.isTypeOf('string'), ['foo', 'bar', 'baz']); // true
j.all(j.isTypeOf('string'), ['foo', 'bar', 42]); // false
~~~~

### compact

- Performance: O(n)
- Signature: `[array] => array<*>`
- Description: Removes falsey values from array

~~~~
j.compact([1, 2, 0, '', false, null, 3]); // [1, 2, 3]
~~~~

### dropNth

- Performance: O(n) (based on the performance of splice)
- Signature: `index => array<*> => array<*>`
- Description: Drops value at nth index from array

~~~~
j.dropNth(0)([1, 2, 3, 4]); // [2, 3, 4];
j.dropNth(2)([1, 2, 3, 4]); // [1, 2, 4];
~~~~

### filter

- Performance: O(n)
- Signature: `function => array<*> => array<*>`
- Description: Filters values from array which fail to pass predicate check

~~~~
var isEven = j.compose(j.equal(0), j.modBy(2));
j.filter(isEven)([1, 2, 3, 4]); // [2, 4]
~~~~

### first

- Performance: O(1)
- Signature: `array<*> => maybe<defined>`
- Description: Returns first value of an array if it exists, otherwise returns nil

~~~~
j.first([1, 2, 3, 4]); // 1
~~~~

### find

- Performance: O(n)
- Signature: `function<*> => array<*> => maybe<defined>`
- Description: finds first value satisfying predicate or 

~~~~
var divisibleBy3 = j.compose(j.equal(0), j.modBy(3));
j.find(divisibleBy3, [1, 2, 4, 5, 6]); 6
j.find(divisibleBy3, [1, 2, 4, 5, 7]); j.nil
~~~~

### foldl

- Performance: O(n)
- Signature: `function, [*] => array<*> => *`

~~~~
j.foldl(j.add)([1, 2, 3, 4]); // 10
j.foldl(j.add, 5)([1, 2, 3, 4]); // 15
~~~~

### foldr

- Performance: O(n)
- Signature: `function, [*] => array<*> => *`

~~~~
j.foldr(j.mod)([2, 5, 8]); // 1
j.foldr(j.mod)([8, 5, 2]); // 2
~~~~

### lastIndexOf

- Performance: O(1)
- Signature: `array<*> => index`

~~~~
j.lastIndexOf([1, 2, 3, 4]); // 3
~~~~

### map

- Performance: O(n)
- Signature: `function => array<*> => array<*>`

~~~~
j.map(j.divideBy(3))([3, 6, 9, 12]); // [1, 2, 3, 4]
~~~~

### none

- Performance: O(n)
- Signature: `function => array<*> => boolean`

~~~~
j.none(j.isTypeOf('number'), ['foo', 'bar', 'baz']); // true
j.none(j.isTypeOf('number'), ['foo', 'bar', 51]); // false
~~~~

### nth

- Performance: O(1)
- Signature: `index => array<*> => maybe<defined>`

~~~~
j.nth(2)([1, 2, 3, 4]); // 3;
~~~~

### rest

- Performance: O(n) (based on performance of slice)
- Signature: `taggedUnion<array<*>;arguments> => array<*>`

~~~~
j.rest([1, 2, 3, 4]); // [2, 3, 4]
~~~~

### reverse

- Performance: O(n)
- Signature: `array<*> => array<*>`

~~~~
j.reverse([1, 2, 3, 4]); // [4, 3, 2, 1]
~~~~

### rfilter

- Performance: O(n)
- Signature: `function => array<*> => array<*>`
- Description: Filters values from multi-dimensional array which fail to pass predicate check

~~~~
var isEven = j.compose(j.equal(0), j.modBy(2));
j.filter(isEven)([1, [2, [3, 4]]]); // [2, 4]
~~~~

### rmap

- Performance: O(n)
- Signature: `function => array<*> => array<*>`

~~~~
j.rmap(j.divideBy(3))([3, 6, [9, 12]]); // [1, 2, 3, 4]
~~~~

### rreduce

- Performance: O(n)
- Signature: `function, [*] => array<*> => *`

~~~~
j.rreduce(j.add)([1, [2, 3, [4]]]); // 10
j.rreduce(j.add, 5)([1, [2, 3, [4]]]); // 15
~~~~

### some

- Performance: O(n)
- Signature: `function => array<*> => boolean`

~~~~
j.none(j.isTypeOf('number'), ['foo', 'bar', 'baz']); // false
j.none(j.isTypeOf('number'), ['foo', 'bar', 51]); // true
~~~~

### sort

- Performance: O(n) + quicksort perf
- Signature: `[*] => array<*> => array<*>`

~~~~
j.sort()([2, 4, 1, 3, 5]); // [1, 2, 3, 4, 5]
j.sort(j.reverseArgs(j.subtract))([2, 4, 1, 3, 5]); // [5, 4, 3, 2, 1]
~~~~

### take

- Performance: O(n) (based on performance of slice)
- Signature: `[index] => function<array<*>>`

~~~~
j.take(3)([1, 2, 3, 4, 5]); // [1, 2, 3];
~~~~

## Math

### add

- Performance: O(1)
- Signature: `number, number => number`

~~~~
j.add(1, 2); // 3
j.add(3)(4); // 7
~~~~

### divide

- Performance: O(1)
- Signature: `number, number => number`

~~~~
j.divide(6, 3); // 2
j.divide(8)(2); // 4
~~~~

### mod

- Performance: O(1)
- Signature: `number, number => number`

~~~~
j.mod(4, 3); // 1
j.mod(7)(5); // 2
~~~~

### multiply

- Performance: O(1)
- Signature: `number, number => number`

~~~~
j.multiply(2, 4); // 8
j.multiply(3)(5); // 15
~~~~

### subtract

- Performance: O(1)
- Signature: `number, number => number`

~~~~
j.subtract(5, 4); // 1
j.subtract(3)(5); // -2
~~~~

### addBy

- Performance: O(1)
- Signature: `number => number => number`

~~~~
j.addBy(5)(6); // 11
~~~~

### divideBy

- Performance: O(1)
- Signature: `number => number => number`

~~~~
j.divideBy(3)(12); // 4
~~~~

### modBy

- Performance: O(1)
- Signature: `number => number => number`

~~~~
j.modBy(5)(7); // 2
~~~~

### multiplyBy

- Performance: O(1)
- Signature: `number => number => number`

~~~~
j.multiplyBy(7)(8); // 56
~~~~

### subtractBy

- Performance: O(1)
- Signature: `number => number => number`

~~~~
j.subtractBy(3)(7); // 4
~~~~

### min

- Performance: O(1)
- Signature: `number => number => number`

~~~~
j.min(5, 6); // 5
j.min(9)(4); // 4
~~~~

### max

- Performance: O(1)
- Signature: `number => number => number`

~~~~
j.max(7, 2); // 7
j.max(8)(5); // 8
~~~~

### inc

- Performance: O(1)
- Signature: `int => int`

~~~~
j.inc(4); // 5
~~~~

### dec

- Performance: O(1)
- Signature: `int => int`

~~~~
j.dec(9); // 8
~~~~

### range

- Performance: O(1)
- Signature: `int, [int] => int => array<int>`

~~~~
j.range(1)(10); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
j.range(1, 3)(10); // [1, 4, 7, 10] 
~~~~

### gt

- Performance: O(1)
- Signature: `number => number => boolean`

~~~~
j.gt(5)(2); // true
j.gt(5)(7); // false
~~~~

### geq

- Performance: O(1)
- Signature: `number => number => boolean`

~~~~
j.geq(5)(2); // true
j.geq(5)(5); // true
j.geq(5)(7); // false
~~~~

### lt

- Performance: O(1)
- Signature: `number => number => boolean`

~~~~
j.gt(5)(2); // false
j.gt(5)(7); // true
~~~~

### leq

- Performance: O(1)
- Signature: `number => number => boolean`

~~~~
j.geq(5)(2); // false
j.geq(5)(5); // true
j.geq(5)(7); // true
~~~~

### between

- Performance: O(1)
- Signature: `number, number => number => boolean`

~~~~
j.between(1, 5)(4); // true
j.between(1, 5)(5); // true
j.between(1, 5)(10); // false
~~~~

## Object

### deref

- Performance: O(n) (depends on key token length)
- Signature: `string => object => maybe<defined>`

~~~~
var testObj = {
foo: {
bar: {
baz: [1, 2, 3]
}
}
};

j.deref('foo.bar.baz')(testObj); // [1, 2, 3]
j.deref('foo.bar.baz.1')(testObj); // 2
j.deref('foo.bar.baz.4')(testObj); // j.nil
~~~~

### merge

- Performance: O(n)
- Signature: `object, object => object`

~~~~
var testObj1 = {
foo: 'bar',
baz: 'quux'
};

var testObj2 = {
baz: 'foo',
quux: 'bar'
};

j.merge(testObj1, testObj2);

// {
// foo: 'bar',
// baz: 'foo',
// quux: 'bar'
// }
~~~~

### toArray

- Performance: O(n) (for n = number of keys)
- Signature: `object => array<tuple<objectKey;*>>`

~~~~
var testObj = {
foo: 'bar',
baz: 'quux'
};

j.toArray(testObj); // [['foo', 'bar'], ['baz', 'quux']]
~~~~

### toObject

- Performance: O(n) (for n = length of array)
- Signature: `array<tuple<objectKey;*>> => object`

~~~~
var testArray = [['foo', 'bar'], ['baz', 'quux']];

j.toObject(testArray); // { foo: 'bar', baz: 'quux' }
~~~~
