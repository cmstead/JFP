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

##Update log

###v1.2.2

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
