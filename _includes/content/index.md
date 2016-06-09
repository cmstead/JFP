## Types

### enforce

- Signature: `string => function`

### isTypeOf

- Signature: `string => * => boolean`

### setJfpTypes

- Signature: `signet => signet`

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

### apply

- Signature: `function, array<*> => *`

### compose

- Signature: `[function] => function`

### concat

- Signature: `array<*>, array<*> => array<*>`

### conj

- Signature: `*, array<*> => array<*>`

### cons

- Signature: `*, array<*> => array<*>`

### curry

- Signature: `function, [int], [array<*>] => [*] => *`

### rcurry

- Signature: `function, [int], [array<*>] => [*] => *`

### either

- Signature: `string => * => * => *`

### identity

- Signature: `* => *`

### maybe

- Signature: `string => * => maybe<defined>`

### partial

- Signature: `function, [*] => [*] => *`

### recur

- Signature: `function => function`

### reverseArgs

- Signature: `function => [*] => *`

### slice

- Signature: `int, [int] => taggedUnion<array<*>;arguments> => array<*>`

### cond

- Signature: `function<function;function;boolean> => *`

## Array

### all

- Signature: `function => array<*> => boolean`

### compact

- Signature: `[array] => array<*>`

### dropNth

- Signature: `index => array<*> => array<*>`

### filter

- Signature: `function => array<*> => array<*>`

### first

- Signature: `array<*> => maybe<defined>`

### find

- Signature: `function<*> => array<*> => maybe<defined>`

### foldl

- Signature: `function, [*] => array<*> => *`

### foldr

- Signature: `function, [*] => array<*> => *`

### lastIndexOf

- Signature: `array<*> => index`

### map

- Signature: `function => array<*> => array<*>`

### none

- Signature: `function => array<*> => boolean`

### nth

- Signature: `index => array<*> => maybe<defined>`

### rest

- Signature: `taggedUnion<array<*>;arguments> => array<*>`

### reverse

- Signature: `array<*> => array<*>`

### some

- Signature: `function => array<*> => boolean`

### sort

- Signature: `[*] => array<*> => array<*>`

### take

- Signature: `[index] => function<array<*>>`

## Math

### add

- Signature: `number, number => number`

### divide

- Signature: `number, number => number`

### mod

- Signature: `number, number => number`

### multiply

- Signature: `number, number => number`

### subtract

- Signature: `number, number => number`

### addBy

- Signature: `[number], [number] => taggedUnion<function;number>`

### divideBy

- Signature: `[number], [number] => taggedUnion<function;number>`

### modBy

- Signature: `[number], [number] => taggedUnion<function;number>`

### multiplyBy

- Signature: `[number], [number] => taggedUnion<function;number>`

### subtractBy

- Signature: `[number], [number] => taggedUnion<function;number>`

### min

- Signature: `[number], [number] => taggedUnion<function;number>`

### max

- Signature: `[number], [number] => taggedUnion<function;number>`

### inc

- Signature: `[int] => int`

### dec

- Signature: `[int] => int`

### range

- Signature: `int, [int] => int => array<int>`

### gt

- Signature: `number => number => boolean`

### geq

- Signature: `number => number => boolean`

### lt

- Signature: `number => number => boolean`

### leq

- Signature: `number => number => boolean`

### between

- Signature: `number, number => number => boolean`

## Object

### pick

- Signature: `string => object => maybe<defined>`

### deref

- Signature: `string => object => maybe<defined>`

### merge

- Signature: `object, object => object`

### toArray

- Signature: `object => array<tuple<objectKey;*>>`

### toObject

- Signature: `array<tuple<objectKey;*>> => object`

## Predicates

### invert

- Signature: `function => function`

### equal

- Signature: `*, [*] => taggedUnion<function;boolean>`

### and

- Signature: `*, [*] => taggedUnion<function;boolean>`

### or

- Signature: `*, [*] => taggedUnion<function;boolean>`

### xor

- Signature: `*, [*] => taggedUnion<function;boolean>`

### not

- Signature: `comparable => boolean`

### isNil

- Signature: `* => boolean`

### isUndefined

- Signature: `* => boolean`