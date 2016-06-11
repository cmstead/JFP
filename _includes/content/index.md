## Types

### enforce

- Signature: `string => function`
- Performance: O(n) (for n = number of leaves in type tree)

~~~~
var add = j.enforce('number, number => number', function add (a, b) { return a + b; });
~~~~

### isTypeOf

- Signature: `string => * => boolean`
- Performance: O(1)

~~~~
j.isTypeOf('string')(5); // false
j.isTypeOf('nil')(j.nil); // true
~~~~

### setJfpTypes

- Signature: `signet => signet`
- Performance: O(1)

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

- Signature: `* => [*] => *`
- Performance: O(1)

~~~~
var alwaysTrue = j.always(true);

alwaysTrue(); // true
alwaysTrue('over 9000'); // true
~~~~

### apply

- Signature: `function, array<*> => *`
- Performance: O(1)

~~~~
j.apply(add, [1, 2]); // 3
~~~~

### compose

- Signature: `[function] => function`
- Performance: O(n) (for n = length of function list)

~~~~
var isNotNumber = j.compose(j.not, j.isTypeOf('number'));

isNotNumber(5); // false
isNotNumber('string'); // true
~~~~

### concat

- Signature: `array<*>, array<*> => array<*>`
- Performance: O(n)

~~~~
var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];
var newArr = j.concat(arr1, arr2); // [1, 2, 3, 4, 5, 6]

arr1 === newArr; // false
arr2 === newArr; // false
~~~~

### conj

- Signature: `*, array<*> => array<*>`
- Performance: O(n) (based on slice performance)

~~~~
j.conj(4, [1, 2, 3]); // [1, 2, 3, 4];
~~~~

### cons

- Signature: `*, array<*> => array<*>`
- Performance: O(n) (based on slice performance)

~~~~
j.cons(4, [1, 2, 3]); // [4, 1, 2, 3];
~~~~

### curry

- Signature: `function, [int], [array<*>] => [*] => *`
- Performance: O(1)

~~~~
function add  (a, b) {
return a + b;
}

j.curry(add)(1)(2); // 3
j.curry(add)(1, 2); // 3
j.curry(add, 3)(1)(2)(3); // 3
~~~~

### rcurry

- Signature: `function, [int], [array<*>] => [*] => *`
- performance: O(1)

~~~~
function divide (a, b) {
return a / b;
}

j.rcurry(divide)(1)(2); // 2
j.rcurry(divide)(1, 2); // 0.5
j.rcurry(divide)(2)(1); // 0.5
~~~~

### either

- Signature: `string => * => * => *`
- Performance: O(1)

~~~~
j.either('number')(5)(0); // 0
j.either('number')(5)('foo'); // 5
~~~~

### identity

- Signature: `* => *`
- Performance: O(1)

~~~~
j.identity('foo'); // foo
j.identity(42); // 42
~~~~

### maybe

- Signature: `string => * => maybe<defined>`
- Performance: O(1)

~~~~
j.maybe('string')('foo'); // 'foo'
j.maybe('number')('foo'); // j.nil
~~~~

### partial

- Signature: `function, [*] => [*] => *`
- Performance: O(1)

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

- Signature: `function => function`
- Performance: O(1)

~~~~
var isUndefined = j.isTypeOf('undefined');
var isNil = j.isTypeOf('nil');

var sum = j.recur(function (recur, values, total) {
var result = isUndefined(total) ? 0 : total;
return isNil(values) ? total : recur(j.rest(values), total + j.first(values));
});
~~~~

### reverseArgs

- Signature: `function => [*] => *`
- Performance: O(n)

~~~~
function divide (a, b) {
return a / b;
}

j.reverseArgs(divide)(2, 12); // 6
~~~~

### slice

- Signature: `int, [int] => taggedUnion<array<*>;arguments> => array<*>`
- Performance: O(n) (estimated JS performance characteristic)

~~~~
j.slice(1)([1, 2, 3, 4]); // [2, 3, 4]

function foo() {
var args = j.slice(0)(arguments);
// ...
}
~~~~

### cond

- Signature: `function<function;function;boolean> => *`
- Performance: O(n) (for n = number of conditions)

~~~~
j.cond(function(where, then, _default){
when(j.isTypeOf(number)(a), then(j.multiplyBy(3), a));
when(_default, then(j.always(a)));
});
~~~~

## Array

### all

- Signature: `function => array<*> => boolean`
- Performance: O(n)

~~~~
j.all(j.isTypeOf('string'), ['foo', 'bar', 'baz']); // true
j.all(j.isTypeOf('string'), ['foo', 'bar', 42]); // false
~~~~

### compact

- Signature: `[array] => array<*>`
- Performance: O(n)

~~~~
j.compact([1, 2, 0, '', false, null, 3]); // [1, 2, 3]
~~~~

### dropNth

- Signature: `index => array<*> => array<*>`
- Performance: O(n) (based on the performance of splice)

~~~~
j.dropNth(0)([1, 2, 3, 4]); // [2, 3, 4];
j.dropNth(2)([1, 2, 3, 4]); // [1, 2, 4];
~~~~

### filter

- Signature: `function => array<*> => array<*>`
- Performance: O(n)

~~~~
var isEven = j.compose(j.equal(0), j.modBy(2));
j.filter(isEven, [1, 2, 3, 4]); // [2, 4]
~~~~

### first

- Signature: `array<*> => maybe<defined>`
- Performance: O(1)

~~~~
j.first([1, 2, 3, 4]); // 1
~~~~

### find

- Signature: `function<*> => array<*> => maybe<defined>`
- Performance: O(n)

~~~~
var divisibleBy3 = j.compose(j.equal(0), j.modBy(3));
j.find(divisibleBy3, [1, 2, 4, 5, 6]); 6
j.find(divisibleBy3, [1, 2, 4, 5, 7]); j.nil
~~~~

### foldl

- Signature: `function, [*] => array<*> => *`
- Performance: O(n)

~~~~
j.foldl(j.add)([1, 2, 3, 4]); // 10
j.foldl(j.add, 5)([1, 2, 3, 4]); // 15
~~~~

### foldr

- Signature: `function, [*] => array<*> => *`
- Performance: O(n)

~~~~
j.foldr(j.mod, [2, 5, 8]); // 1
j.foldr(j.mod, [8, 5, 2]); // 2
~~~~

### lastIndexOf

- Signature: `array<*> => index`
- Performance: O(1)

~~~~
j.lastIndexOf([1, 2, 3, 4]); // 3
~~~~

### map

- Signature: `function => array<*> => array<*>`
- Performance: O(n)

~~~~
j.map(j.divideBy(3), [3, 6, 9, 12]); // [1, 2, 3, 4]
~~~~

### none

- Signature: `function => array<*> => boolean`
- Performance: O(n)

~~~~
j.none(j.isTypeOf('number'), ['foo', 'bar', 'baz']); // true
j.none(j.isTypeOf('number'), ['foo', 'bar', 51]); // false
~~~~

### nth

- Signature: `index => array<*> => maybe<defined>`
- Performance: O(1)

~~~~
j.nth(2)([1, 2, 3, 4]); // 3;
~~~~

### rest

- Signature: `taggedUnion<array<*>;arguments> => array<*>`
- Performance: O(n) (based on performance of slice)

~~~~
j.rest([1, 2, 3, 4]); // [2, 3, 4]
~~~~

### reverse

- Signature: `array<*> => array<*>`
- Performance: O(n)

~~~~
j.reverse([1, 2, 3, 4]); // [4, 3, 2, 1]
~~~~

### some

- Signature: `function => array<*> => boolean`
- Performance: O(n)

~~~~
j.none(j.isTypeOf('number'), ['foo', 'bar', 'baz']); // false
j.none(j.isTypeOf('number'), ['foo', 'bar', 51]); // true
~~~~

### sort

- Signature: `[*] => array<*> => array<*>`
- Performance: O(n) + quicksort perf

~~~~
j.sort()([2, 4, 1, 3, 5]); // [1, 2, 3, 4, 5]
j.sort(j.reverseArgs(j.subtract))([2, 4, 1, 3, 5]); // [5, 4, 3, 2, 1]
~~~~

### take

- Signature: `[index] => function<array<*>>`
- Performance: O(n) (based on performance of slice)

~~~~
j.take(3)([1, 2, 3, 4, 5]); // [1, 2, 3];
~~~~

## Math

### add

- Signature: `number, number => number`
- Performance: O(1)

~~~~
j.add(1, 2); // 3
j.add(3)(4); // 7
~~~~

### divide

- Signature: `number, number => number`
- Performance: O(1)

~~~~
j.divide(6, 3); // 2
j.divide(8)(2); // 4
~~~~

### mod

- Signature: `number, number => number`
- Performance: O(1)

~~~~
j.mod(4, 3); // 1
j.mod(7)(5); // 2
~~~~

### multiply

- Signature: `number, number => number`
- Performance: O(1)

~~~~
j.multiply(2, 4); // 8
j.multiply(3)(5); // 15
~~~~

### subtract

- Signature: `number, number => number`
- Performance: O(1)

~~~~
j.subtract(5, 4); // 1
j.subtract(3)(5); // -2
~~~~

### addBy

- Signature: `[number], [number] => taggedUnion<function;number>`
- Performance: O(1)

~~~~
j.addBy(5)(6); // 11
~~~~

### divideBy

- Signature: `[number], [number] => taggedUnion<function;number>`
- Performance: O(1)

~~~~
j.divideBy(3)(12); // 4
~~~~

### modBy

- Signature: `[number], [number] => taggedUnion<function;number>`
- Performance: O(1)

~~~~
j.modBy(5)(7); // 2
~~~~

### multiplyBy

- Signature: `[number], [number] => taggedUnion<function;number>`
- Performance: O(1)

~~~~
j.multiplyBy(7)(8); // 56
~~~~

### subtractBy

- Signature: `[number], [number] => taggedUnion<function;number>`
- Performance: O(1)

~~~~
j.subtractBy(3)(7); // 4
~~~~

### min

- Signature: `[number], [number] => taggedUnion<function;number>`
- Performance: O(1)

~~~~
j.min(5, 6); // 5
j.min(9)(4); // 4
~~~~

### max

- Signature: `[number], [number] => taggedUnion<function;number>`
- Performance: O(1)

~~~~
j.max(7, 2); // 7
j.max(8)(5); // 8
~~~~

### inc

- Signature: `[int] => int`
- Performance: O(1)

~~~~
j.inc(4); // 5
~~~~

### dec

- Signature: `[int] => int`
- Performance: O(1)

~~~~
j.dec(9); // 8
~~~~

### range

- Signature: `int, [int] => int => array<int>`
- Performance: O(1)

~~~~
j.range(1)(10); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
j.range(1, 3)(10); // [1, 4, 7, 10] 
~~~~

### gt

- Signature: `number => number => boolean`
- Performance: O(1)

~~~~
j.gt(5)(2); // true
j.gt(5)(7); // false
~~~~

### geq

- Signature: `number => number => boolean`
- Performance: O(1)

~~~~
j.geq(5)(2); // true
j.geq(5)(5); // true
j.geq(5)(7); // false
~~~~

### lt

- Signature: `number => number => boolean`
- Performance: O(1)

~~~~
j.gt(5)(2); // false
j.gt(5)(7); // true
~~~~

### leq

- Signature: `number => number => boolean`
- Performance: O(1)

~~~~
j.geq(5)(2); // false
j.geq(5)(5); // true
j.geq(5)(7); // true
~~~~

### between

- Signature: `number, number => number => boolean`
- Performance: O(1)

~~~~
j.between(1, 5)(4); // true
j.between(1, 5)(5); // true
j.between(1, 5)(10); // false
~~~~

## Object

### pick

- Signature: `string => object => maybe<defined>`
- Performance: O(1)

~~~~
j.pick('foo')({ foo: 'bar' }); // bar
j.pick('foo')({ baz: 'bar' }); // j.nil
~~~~

### deref

- Signature: `string => object => maybe<defined>`
- Performance: O(n) (depends on key token length)

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

- Signature: `object, object => object`
- Performance: O(n)

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

- Signature: `object => array<tuple<objectKey;*>>`
- Performance: O(n) (for n = number of keys)

~~~~
var testObj = {
foo: 'bar',
baz: 'quux'
};

j.toArray(testObj); // [['foo', 'bar'], ['baz', 'quux']]
~~~~

### toObject

- Signature: `array<tuple<objectKey;*>> => object`
- Performance: O(n) (for n = length of array)

~~~~
var testArray = [['foo', 'bar'], ['baz', 'quux']];

j.toObject(testArray); // { foo: 'bar', baz: 'quux' }
~~~~

## Predicates

### invert

- Signature: `function => function`
- Performance: O(1)

~~~~
j.invert(j.isTypeOf('string')('foo')); // false
~~~~

### equal

- Signature: `*, [*] => taggedUnion<function;boolean>`
- Performance: O(1)

~~~~
j.equal(5, 5); // true;
j.equal(5, 7); // false;
j.equal(5)(7); // false;
~~~~

### and

- Signature: `*, [*] => taggedUnion<function;boolean>`
- Performance: O(1)

~~~~
j.and(true, true); // true
j.and(true, false); // false
~~~~

### or

- Signature: `*, [*] => taggedUnion<function;boolean>`
- Performance: O(1)

~~~~
j.or(true, true); // true
j.or(true, false); // true
j.or(false, false); // false
~~~~

### xor

- Signature: `*, [*] => taggedUnion<function;boolean>`
- Performance: O(1)

~~~~
j.xor(true, true); // false
j.xor(true, false); // true
j.xor(false, false); // false
~~~~

### not

- Signature: `comparable => boolean`
- Performance: O(1)

~~~~
j.not(true); // false
j.not(5); // false
~~~~

### isNil

- Signature: `* => boolean`
- Performance: O(1)

~~~~
j.isNil(j.nil); // true
j.isNil([]); // true
j.isNil({}); // false
~~~~

### isUndefined

- Signature: `* => boolean`
- Performance: O(1)

~~~~
j.isUndefined(undefined); // true
j.isUndefined(null); // false
~~~~