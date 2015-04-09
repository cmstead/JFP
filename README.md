JFP - Javascript Function Processor
===================================

Library documentation:

http://cmstead.github.io/JFP

NPM Package Information:

https://www.npmjs.com/package/jfp

Javascript Function Processor is a functional library built around the idea that functional
programming shouldn't require special objects or OO paradigms to play well. Chaining shouldn't
be limited to functions in the library.

Programmers should be able to extend their libraries easily. Programmers should be able
to bend their environment to their own will, not the other way around. This is what JFP gives you.

Note: OMG! What madness is this?? Version 1.2.x! I know there are just a few people using this library right now, but thanks for all issues created and helpful feedback. I use this library a lot and outside input is so helpful to keep making things better.

##Roadmap

###v2.0.0

Below is the list of planned breaking changes coming in v2.0

*Breaking changes*

- [x] Maybe will be rewritten  a -> a | null to adhere to a Haskell analog of maybe
- [ ] Pipeline will take values(array) as an initial argument and then pipeline the values through the provided functions in order

*New functions*

- [x] ShortCircuit will be added (and possibly retrofit into v1.x). ShortCircuit will replace the current definition of maybe.
- [ ] MapOr This will map a set of predicates on to a set of values and map the output to or
- [ ] MapAnd This is the and analog for mapOr
- [ ] ComposeAsync A composition function for handling asynchronous functions

*Extended functionality*

- [x] Either will be extended to allow for a datatype to be specified for greater flexibility

A migration path will be outlined (and short)


##Update log

###v1.2.3 (In progress)

Updates:

- execute -- handle passed arguments instead of simply calling provided function

###v1.2.2 (Technically this should have been 1.3 but I couldn't justify it for one function)

Added function:

- execute -- executes function and returns result

###v1.2.1

Updated functionality:

- original contains function is now some (predicate, array)
- added new contains (value, array)

###v1.2.0

Added new functionality:

- contains (predicate, array) O(n) (pathological case)
- every (predicate, array) O(n)
- numberOf (predicate, array) O(n)
- merge (defaultObject, object) O(n)
- sort ([comparator,] array) O(n log n)
- union (array, array) O(n log n)
- intersect (array, array) O(n log n)
- difference (array, array) O(n log n)
- symmetricDifference (array, array) O(n log n) to O(slow) (pathological case)

###v1.1.4

Fixed bad case where concat would ignore valid falsey values. If this behavior is desired, j.compact will remove falsey values in O(n) time.
