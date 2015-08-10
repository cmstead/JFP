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

###V2.3.0

Upcoming functionality

- [ ] Pattern matching (defmatch)
- [ ] Conditional cleanup with pattern matching functionality

###v2.2.1

Upcoming changes

- Refactorization of functions for readability and maintenance
- Reworking dependencies to simplify code
- Enhacning performance as applicable
- Adding license information (Never quite did that. WHOOPS!)

###v2.2.0

Added functionality to j-aliasing - pick aliasing

calling j(':propertyname') returns a partially applied j.pick
calling j(':propertyname', object) will return the picked property from an object

###v2.1.0

Because sometimes I forget how to semver...

Anyway, updates go a little like this:

- Fixed reverseArgs. Function now returns value output from execution of original function.
- Fixed deref. Function no longer returns key value if object value is null or undefined.

###v2.0.0

Below is the list of planned breaking changes coming in v2.0

*Breaking changes*

- [x] Maybe will be rewritten  a -> a | null to adhere to a Haskell analog of maybe
- [x] Pipeline will take a value of any type as an initial argument and then pipeline the value through the provided functions in order

*New functions*

- [x] Deref will take an object, a dot-separated key and a default and return either the dereferenced value, null or default if provided.
- [x] ShortCircuit will be added (and possibly retrofit into v1.x). ShortCircuit will replace the current definition of maybe.
- [x] ReverseArgs returns a wrapper function around an original function which reverses all arguments passed in
- [x] PartialReverse returns a reverseArgs wrapped partial application of original function

*Extended functionality*

- [x] Either will be extended to allow for a datatype to be specified for greater flexibility

*Migration Path*

Migrating from 1.2.x to 2.0.0 is pretty straightforward. Following are the changes that need to be made:

- Maybe can be renamed to shortCircuit.
- Pipeline will need all arguments moved inside the function call and ordered with value first. All functions are listed in execution order.


##Update log

Note: OMG! What madness is this?? Version 1.2.x! I know there are just a few people using this library right now, but thanks for all issues created and helpful feedback. I use this library a lot and outside input is so helpful to keep making things better.

###v1.2.3

Updates:

- jfp is a shorthand function for currying
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
