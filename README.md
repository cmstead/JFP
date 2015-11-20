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

Licensed under the Mozilla Public License (MPL). For the full text of the license please see the included text file.
If the text file has been removed, please visit:

https://www.mozilla.org/MPL/

###V2.6.0

- [x] cond - Conditional matching function; accepts function pairs as arguments position 0 must be a predicate, position 1 is a behavior
- [ ] match - Takes an argument and matches on predicate functions then executes functions or returns values accordingly
- [x] Various updates and fixes
    - Updated slice base arity to 2

###V2.5.1

- [x] Fix arity of deref so base arity is 2 (fix to make currying work more predictably)

###V2.5.0

- [x] isTuple - predicate testing on if array is a tuple of n length &lt;int&gt;, &lt;array&gt; -&gt; &lt;boolean&gt;
- [x] isPair - special case isTuple representable by j('isTuple', 2) -- intentionally does NOT conform to scheme's pair? predicate
- [x] isSingle - special case isTuple representable by j('isTuple', 1)
- [x] isTriple - special case isTuple representable by j('isTuple', 3)
- [x] transform - transforms an object into a new object through an array of pairs-based transform definitions -- This ignores all non-pair values
- [x] getKeys - returns array of object keys returns empty array if value is not an object or if object has no keys
- [x] hasFirst - checks if array contains a first element, always returns false on non-array values
- [x] always - returns a function which always returns the same value -- similar to j.partial(j.identity, value)
- [x] empty - accepts type string, returns initialized, empty value of type specified by type string, with no string, empty returns null
- [x] isMultipleOf - verifies value is multiple of a number
- [x] composePredicate - takes a list of predicate functions and applies them to a value, returning a boolean, optional combinator allows for and/or combination behavior selection; default behavior is "and"
- [x] Assorted updates and enhancements
    - Updated shortCircuit to act on an typeString
    - Updated merge function to reduce verbosity and improve stability
    - Added AMD/RequireJS module support

###V2.4.0

Upcoming functionality

- [x] getType - returns type of value -- &lt;any&gt; value -&gt; &lt;string&gt; handles array special case as 'array'
- [x] isType - checks type of value -- &lt;string&gt; typeString, &lt;any&gt; value -&gt; &lt;boolean&gt;
- [x] isPrimitive - checks if value type is a primitive -- &lt;any&gt; value -&gt; &lt;boolean&gt;
- [x] clone - clones objects and arrays -- &lt;T&gt; -&gt; &lt;T&gt;
- [x] maybeType - Applies type string to maybe function and returns new maybe function accepting a value -- &lt;string&gt; -&gt; &lt;function&gt;&lt;T&gt; -&gt; &lt;T | null&gt;
- [x] eitherType - Applies type string to either function and returns a new, curried either function accepting a default value and an option value -- &lt;string&gt; -&gt; &lt;function&gt;&lt;T&gt; -&gt; &lt;function&gt;&lt;T&gt; -&gt; &lt;T | null&gt;
- [x] splitPartial - Performs a split left/right partial, applying final args in the middle of the set - &lt;function&gt;, &lt;array&gt;&lt;Any&gt;, &lt;array&gt;&lt;Any&gt; -&gt; &lt;function&gt;&lt;Any&gt;[&lt;Any&gt;...]
- [x] Updated functionality to explicitly handle array as a type
	- getType returns array
	- isType('array', []) returns true
	- maybe([], 'array') returns [], array respected as object for backwards-compatibility and Javascript standard
	- either([], [1, 2, 3, 4], 'array') returns [1, 2, 3, 4]
- [x] Update arity reporting to improve default currying behavior
    - Reduce - default arity of 2, multi-arity max 3
- [x] Code refactoring
    - Boolean typecast instead of using !!
	- Updates to predicate functionality, reducing footprint
- [x] Added nuget build automation

###V2.3.2

Fixed issue with toValues which occasionally caused an infinite loop.

###V2.3.1

Fixed issue with compose, filter and map which were misbehaving after last update.

###V2.3.0

Upcoming functionality

- [x] Partition - partitions list based on predicate function
- [x] MultiPartition - Partitions list based on 2-arity predicate function with a list of comparison values
- [x] Update deref to accept key, object by default and fall back to compatible mode to support 2.0.x implementation

###v2.2.1

Upcoming changes

- Refactorization of functions for readability and maintenance
- Removed unnecessary code for function argument length and fell back to standard JS behavior, Function.length
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

- [x] Maybe will be rewritten  a -&gt; a | null to adhere to a Haskell analog of maybe
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
