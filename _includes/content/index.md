## Types

### enforce

- Signature: `string => function`
- Performance: O(n) (for n = number of leaves in type tree)

```
var add = j.enforce('number, number => number', function add (a, b) { return a + b; });
```

### isTypeOf

- Signature: `string => * => boolean`
- Performance: O(1)

```
j.isTypeOf('string')(5); // false
j,.isTypeOf('nil')(j.nil); // true
```

### setJfpTypes

- Signature: `signet => signet`
- Performance: O(1)

```
var signetFactory = require('signet');

var signet = setJfpTypes(signetFactory());
```

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
    - `object -> array`
- `int`
    - `number -> int`
- `bounded<>`
    - `number -> bounded`
- `boundedInt<>`
    - `number -> int -> bounded`
- `tuple<>`
    - `object -> array -> tuple`
- `boundedString<>`
    - `string -> boundedString`
- `formattedString<>`
    - `string -> formattedString`
- `taggedUnion<>`
    - `* -> taggedUnion`
- `nil`
    - `object -> array -> nil`
- `index`
    - `number -> int -> index`
- `arguments`
    - `object -> arguments`
- `maybe`
    - `* -> maybe`
- `null`
    - `object -> null`
- `defined`
    - `* -> defined`
- `numeric`
    - `* -> numeric`
- `comparable`
    - `* -> comparable`
- `objectKey`
    - `* -> objectKey`

## Core

### always

- Signature: `* => [*] => *`
- Performance: O(1)

```
var alwaysTrue = j.always(true);

alwaysTrue(); // true
alwaysTrue('over 9000'); // true
```

### apply

- Signature: `function, array<*> => *`
- Performance: O(1)

```
j.apply(add, [1, 2]); // 3
```

### compose

- Signature: `[function] => function`
- Performance: O(n) (for n = length of function list)

```
var isNotNumber = j.compose(j.not, j.isTypeOf('number'));

isNotNumber(5); // false
isNotNumber('string'); // true
```

### concat

- Signature: `array<*>, array<*> => array<*>`
- Performance: O(n)

```
var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];
var newArr = j.concat(arr1, arr2); // [1, 2, 3, 4, 5, 6]

arr1 === newArr; // false
arr2 === newArr; // false
```

### conj

- Signature: `*, array<*> => array<*>`
- Performance: O(n) (based on slice performance)

```
j.conj(4, [1, 2, 3]); // [1, 2, 3, 4];
```

### cons

- Signature: `*, array<*> => array<*>`
- Performance: O(n) (based on slice performance)

```
j.cons(4, [1, 2, 3]); // [4, 1, 2, 3];
```

### curry

- Signature: `function, [int], [array<*>] => [*] => *`
- Performance: O(1)

```
function add  (a, b) {
    return a + b;
}

j.curry(add)(1)(2); // 3
j.curry(add)(1, 2); // 3
j.curry(add, 3)(1)(2)(3); // 3
```

### rcurry

- Signature: `function, [int], [array<*>] => [*] => *`
- performance: O(1)

```
function divide (a, b) {
    return a / b;
}

j.rcurry(divide)(1)(2); // 2
j.rcurry(divide)(1, 2); // 0.5
j.rcurry(divide)(2)(1); // 0.5
```

### either

- Signature: `string => * => * => *`
- Performance: O(1)

```
j.either('number')(5)(0); // 0
j.either('number')(5)('foo'); // 5
```

### identity

- Signature: `* => *`
- Performance: O(1)

### maybe

- Signature: `string => * => maybe<defined>`
- Performance: O(1)

### partial

- Signature: `function, [*] => [*] => *`
- Performance: O(1)

### recur

- Signature: `function => function`
- Performance: O(1)

### reverseArgs

- Signature: `function => [*] => *`
- Performance: O(n)

### slice

- Signature: `int, [int] => taggedUnion<array<*>;arguments> => array<*>`
- Performance: O(n) (estimated JS performance characteristic)

### cond

- Signature: `function<function;function;boolean> => *`
- Performance: O(n) (for n = number of conditions)

## Array

### all

- Signature: `function => array<*> => boolean`
- Performance: O(n)

### compact

- Signature: `[array] => array<*>`
- Performance: O(n)

### dropNth

- Signature: `index => array<*> => array<*>`
- Performance: O(n) (based on the performance of splice)

### filter

- Signature: `function => array<*> => array<*>`
- Performance: O(n)

### first

- Signature: `array<*> => maybe<defined>`
- Performance: O(1)

### find

- Signature: `function<*> => array<*> => maybe<defined>`
- Performance: O(n)

### foldl

- Signature: `function, [*] => array<*> => *`
- Performance: O(n)

### foldr

- Signature: `function, [*] => array<*> => *`
- Performance: O(n)

### lastIndexOf

- Signature: `array<*> => index`
- Performance: O(1)

### map

- Signature: `function => array<*> => array<*>`
- Performance: O(n)

### none

- Signature: `function => array<*> => boolean`
- Performance: O(n)

### nth

- Signature: `index => array<*> => maybe<defined>`
- Performance: O(1)

### rest

- Signature: `taggedUnion<array<*>;arguments> => array<*>`
- Performance: O(n) (based on performance of slice)

### reverse

- Signature: `array<*> => array<*>`
- Performance: O(n)

### some

- Signature: `function => array<*> => boolean`
- Performance: O(n)

### sort

- Signature: `[*] => array<*> => array<*>`
- Performance: O(n) + quicksort perf

### take

- Signature: `[index] => function<array<*>>`
- Performance: O(n) (based on performance of slice)

## Math

### add

- Signature: `number, number => number`
- Performance: O(1)

### divide

- Signature: `number, number => number`
- Performance: O(1)

### mod

- Signature: `number, number => number`
- Performance: O(1)

### multiply

- Signature: `number, number => number`
- Performance: O(1)

### subtract

- Signature: `number, number => number`
- Performance: O(1)

### addBy

- Signature: `[number], [number] => taggedUnion<function;number>`
- Performance: O(1)

### divideBy

- Signature: `[number], [number] => taggedUnion<function;number>`
- Performance: O(1)

### modBy

- Signature: `[number], [number] => taggedUnion<function;number>`
- Performance: O(1)

### multiplyBy

- Signature: `[number], [number] => taggedUnion<function;number>`
- Performance: O(1)

### subtractBy

- Signature: `[number], [number] => taggedUnion<function;number>`
- Performance: O(1)

### min

- Signature: `[number], [number] => taggedUnion<function;number>`
- Performance: O(1)

### max

- Signature: `[number], [number] => taggedUnion<function;number>`
- Performance: O(1)

### inc

- Signature: `[int] => int`
- Performance: O(1)

### dec

- Signature: `[int] => int`
- Performance: O(1)

### range

- Signature: `int, [int] => int => array<int>`
- Performance: O(1)

### gt

- Signature: `number => number => boolean`
- Performance: O(1)

### geq

- Signature: `number => number => boolean`
- Performance: O(1)

### lt

- Signature: `number => number => boolean`
- Performance: O(1)

### leq

- Signature: `number => number => boolean`
- Performance: O(1)

### between

- Signature: `number, number => number => boolean`
- Performance: O(1)

## Object

### pick

- Signature: `string => object => maybe<defined>`
- Performance: O(1)

### deref

- Signature: `string => object => maybe<defined>`
- Performance: O(n) (depends on key token length)

### merge

- Signature: `object, object => object`
- Performance: O(n)

### toArray

- Signature: `object => array<tuple<objectKey;*>>`
- Performance: O(n) (for n = number of keys)

### toObject

- Signature: `array<tuple<objectKey;*>> => object`
- Performance: O(n) (for n = length of array)

## Predicates

### invert

- Signature: `function => function`
- Performance: O(1)

### equal

- Signature: `*, [*] => taggedUnion<function;boolean>`
- Performance: O(1)

### and

- Signature: `*, [*] => taggedUnion<function;boolean>`
- Performance: O(1)

### or

- Signature: `*, [*] => taggedUnion<function;boolean>`
- Performance: O(1)

### xor

- Signature: `*, [*] => taggedUnion<function;boolean>`
- Performance: O(1)

### not

- Signature: `comparable => boolean`
- Performance: O(1)

### isNil

- Signature: `* => boolean`
- Performance: O(1)

### isUndefined

- Signature: `* => boolean`
- Performance: O(1)
