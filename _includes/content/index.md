##A different kind of functional library...

The Javascript Function Processor (JFP) is a different kind of functional library.  Like Lodash and Underscore,
JFP provides common functions like map, filter, partial, compose and so on.  Unlike Lodash and Underscore,
JFP is designed around the idea that functions are going to be used more like one would program in
Lisp, Haskell or other functional languages.

The driving principles of JFP are as follows:

1. Be JFP all the way down
2. Design the interface to answer common needs first
3. Be the least surprising to the user

To be JFP all the way down, the library should either solve a problem in the best way possible and
only solve the problem once. Each subsequent time the solution is needed, JFP should look inward
to use the abstraction already created to expose the same efficiencies.  Beyond this, by
using JFP to solve the problems needed to extend the library, it introduces a guarantee
that the internals of JFP are used early so problems and needs are resolved as soon as possible.

**JFP dogfoods JFP.**

JFP is designed with common uses and needs addressed first.  This means even if the interface may seem
ordered in an unexpected way, the goal is to make it easier to accomplish tasks and create useful abstractions
with less effort.  Ideally, using JFP should simplify programs and clarify your workflow.

**JFP is designed for ease of use.**

When JFP is used, function interactions should not surprise you. Given a particular input, every JFP
function should produce what the user expects. If something doesn't resolve as expected, it is less likely
the function is doing something intentionally surprising and more likely the result of a bug.

**JFP is as transparent as possible.**
