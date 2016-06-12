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
- Signature: `string => function`

~~~~
var add = j.enforce('number, number => number', function add (a, b) { return a + b; });
~~~~

### isTypeOf

- Performance: O(1)
- Signature: `string => * => boolean`

~~~~
j.isTypeOf('string')(5); // false
j.isTypeOf('nil')(j.nil); // true
~~~~

### setJfpTypes

- Performance: O(1)
- Signature: `signet => signet`

~~~~
var signetFactory = require('signet');

var signet = setJfpTypes(signetFactory());
~~~~

### Type List

- `()`
- `*`
- `boolean`
- `function`
- `number`
- `object`
- `string`
- `symbol`
- `undefined`
- `array`
- `int`
- `bounded<>`
- `boundedInt<>`
- `tuple<>`
- `boundedString<>`
- `formattedString<>`
- `taggedUnion<>`
- `nil`
- `index`
- `arguments`
- `maybe`
- `null`
- `defined`
- `numeric`
- `comparable`
- `objectKey`

## Core

### always

- Performance: O(1)
- Signature: `* => [*] => *`

~~~~
var alwaysTrue = j.always(true);

alwaysTrue(); // true
alwaysTrue('over 9000'); // true
~~~~

### apply

- Performance: O(1)
- Signature: `function, array<*> => *`

~~~~
j.apply(add, [1, 2]); // 3
~~~~

### compose

- Performance: O(n) (for n = length of function list)
- Signature: `[function] => function`

~~~~
var isNotNumber = j.compose(j.not, j.isTypeOf('number'));

isNotNumber(5); // false
isNotNumber('string'); // true
~~~~

### concat

- Performance: O(n)
- Signature: `array<*>, array<*> => array<*>`

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

~~~~
j.conj(4, [1, 2, 3]); // [1, 2, 3, 4];
~~~~

### cons

- Performance: O(n) (based on slice performance)
- Signature: `*, array<*> => array<*>`

~~~~
j.cons(4, [1, 2, 3]); // [4, 1, 2, 3];
~~~~

### curry

- Performance: O(1)
- Signature: `function, [int], [array<*>] => [*] => *`

~~~~
function add  (a, b) {
return a + b;
}

j.curry(add)(1)(2); // 3
j.curry(add)(1, 2); // 3
j.curry(add, 3)(1)(2)(3); // 3
~~~~

### rcurry

- performance: O(1)
- Signature: `function, [int], [array<*>] => [*] => *`

~~~~
function divide (a, b) {
return a / b;
}

j.rcurry(divide)(1)(2); // 2
j.rcurry(divide)(1, 2); // 0.5
j.rcurry(divide)(2)(1); // 0.5
~~~~

### either

- Performance: O(1)
- Signature: `string => * => * => *`

~~~~
j.either('number')(5)(0); // 0
j.either('number')(5)('foo'); // 5
~~~~

### identity

- Performance: O(1)
- Signature: `* => *`

~~~~
j.identity('foo'); // foo
j.identity(42); // 42
~~~~

### maybe

- Performance: O(1)
- Signature: `string => * => maybe<defined>`

~~~~
j.maybe('string')('foo'); // 'foo'
j.maybe('number')('foo'); // j.nil
~~~~

### partial

- Performance: O(1)
- Signature: `function, [*] => [*] => *`

~~~~
function add (a, b) {
return a + b;
}

var inc = j.partial(add, 1);

inc(1); // 2
inc(5); // 6

inc(inc(inc(inc(1)))); // 4
~~~~

### recur

- Performance: O(1)
- Signature: `function => function`

~~~~
var isUndefined = j.isTypeOf('undefined');
var isNil = j.isTypeOf('nil');

var sum = j.recur(function (recur, values, total) {
var result = isUndefined(total) ? 0 : total;
return isNil(values) ? total : recur(j.rest(values), total + j.first(values));
});
~~~~

### reverseArgs

- Performance: O(n)
- Signature: `function => [*] => *`

~~~~
function divide (a, b) {
return a / b;
}

j.reverseArgs(divide)(2, 12); // 6
~~~~

### slice

- Performance: O(n) (estimated JS performance characteristic)
- Signature: `int, [int] => taggedUnion<array<*>;arguments> => array<*>`

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

~~~~
j.all(j.isTypeOf('string'), ['foo', 'bar', 'baz']); // true
j.all(j.isTypeOf('string'), ['foo', 'bar', 42]); // false
~~~~

### compact

- Performance: O(n)
- Signature: `[array] => array<*>`

~~~~
j.compact([1, 2, 0, '', false, null, 3]); // [1, 2, 3]
~~~~

### dropNth

- Performance: O(n) (based on the performance of splice)
- Signature: `index => array<*> => array<*>`

~~~~
j.dropNth(0)([1, 2, 3, 4]); // [2, 3, 4];
j.dropNth(2)([1, 2, 3, 4]); // [1, 2, 4];
~~~~

### filter

- Performance: O(n)
- Signature: `function => array<*> => array<*>`

~~~~
var isEven = j.compose(j.equal(0), j.modBy(2));
j.filter(isEven, [1, 2, 3, 4]); // [2, 4]
~~~~

### first

- Performance: O(1)
- Signature: `array<*> => maybe<defined>`

~~~~
j.first([1, 2, 3, 4]); // 1
~~~~

### find

- Performance: O(n)
- Signature: `function<*> => array<*> => maybe<defined>`

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
j.foldr(j.mod, [2, 5, 8]); // 1
j.foldr(j.mod, [8, 5, 2]); // 2
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
j.map(j.divideBy(3), [3, 6, 9, 12]); // [1, 2, 3, 4]
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
- Signature: `[number], [number] => taggedUnion<function;number>`

~~~~
j.addBy(5)(6); // 11
~~~~

### divideBy

- Performance: O(1)
- Signature: `[number], [number] => taggedUnion<function;number>`

~~~~
j.divideBy(3)(12); // 4
~~~~

### modBy

- Performance: O(1)
- Signature: `[number], [number] => taggedUnion<function;number>`

~~~~
j.modBy(5)(7); // 2
~~~~

### multiplyBy

- Performance: O(1)
- Signature: `[number], [number] => taggedUnion<function;number>`

~~~~
j.multiplyBy(7)(8); // 56
~~~~

### subtractBy

- Performance: O(1)
- Signature: `[number], [number] => taggedUnion<function;number>`

~~~~
j.subtractBy(3)(7); // 4
~~~~

### min

- Performance: O(1)
- Signature: `[number], [number] => taggedUnion<function;number>`

~~~~
j.min(5, 6); // 5
j.min(9)(4); // 4
~~~~

### max

- Performance: O(1)
- Signature: `[number], [number] => taggedUnion<function;number>`

~~~~
j.max(7, 2); // 7
j.max(8)(5); // 8
~~~~

### inc

- Performance: O(1)
- Signature: `[int] => int`

~~~~
j.inc(4); // 5
~~~~

### dec

- Performance: O(1)
- Signature: `[int] => int`

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

### pick

- Performance: O(1)
- Signature: `string => object => maybe<defined>`

~~~~
j.pick('foo')({ foo: 'bar' }); // bar
j.pick('foo')({ baz: 'bar' }); // j.nil
~~~~

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

## Predicates

### invert

- Performance: O(1)
- Signature: `function => function`

~~~~
j.invert(j.isTypeOf('string')('foo')); // false
~~~~

### equal

- Performance: O(1)
- Signature: `*, [*] => taggedUnion<function;boolean>`

~~~~
j.equal(5, 5); // true;
j.equal(5, 7); // false;
j.equal(5)(7); // false;
~~~~

### and

- Performance: O(1)
- Signature: `*, [*] => taggedUnion<function;boolean>`

~~~~
j.and(true, true); // true
j.and(true, false); // false
~~~~

### or

- Performance: O(1)
- Signature: `*, [*] => taggedUnion<function;boolean>`

~~~~
j.or(true, true); // true
j.or(true, false); // true
j.or(false, false); // false
~~~~

### xor

- Performance: O(1)
- Signature: `*, [*] => taggedUnion<function;boolean>`

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

### isNil

- Performance: O(1)
- Signature: `* => boolean`

~~~~
j.isNil(j.nil); // true
j.isNil([]); // true
j.isNil({}); // false
~~~~

### isUndefined

- Performance: O(1)
- Signature: `* => boolean`

~~~~
j.isUndefined(undefined); // true
j.isUndefined(null); // false
~~~~