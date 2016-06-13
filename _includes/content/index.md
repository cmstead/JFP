JFP is an opinionated functional programming library written for Javascript. The core of JFP is 
built to honor the Scheme heritage Javascript carries with it, while drawing programming practices
from other functional languages like Scala for API definition and Clojure for things like
tail optimization of recursive algorithms.

JFP is a typed library, using [Signet](https://www.npmjs.com/package/signet) typing to ensure 
APIs are well defined and communicate their behavior and intent to the programmer. Most functions
are enforced with sum types and wild cards to provide broader flexibility while still providing
guard rails to help keep the programmer from getting lost.

At its most basic level, JFP can be used as a toolbox, providing helper functions to accomplish
common tasks.  As a programmer becomes more familiar with functional programming and the JFP API,
the library becomes a language-as-a-library system for writing expressive programs and moving toward
function expressions and away from imperative behaviors.

All curried functions in JFP are strictly curried. This means a function which declares a curried
output will not optionally accept all arguments up-front. Although this leads to expressions
which could be a little more parenthesis heavy, it also helps make the language and behaviors
act as a cohesive, well-defined whole.

In the end, JFP is a functional programming system which is built around solving problems and chooses
clarity through clear definitions over optional behaviors and confusing APIs.