JFP - Javascript Function Processor
===================================

Library Documentation:

http://cmstead.github.io/JFP

NPM Package Information:

https://www.npmjs.com/package/jfp

NuGet Package Information

https://www.nuget.org/packages/JFP/

Package dependency for web deployment:

https://www.npmjs.com/package/signet

JFP is an opinionated, type-enforced functional programming library. JFP makes use of the Signet type
library, not only relying on the types for its own signatures, but also to provide rich type
interactions for the user of JFP.

JFP is intended to be the foundation for a strong functional programming paradigm in Javascript
with roots in Scheme, but borrowing type and contract philosophies from other languages like
Scala. Many common utility functions are provided out of the box, but their contracts are 
built around the idea that partial application and currying are fundamental to the construction
of correct, reliable software in Javascript.

JFP is not a drop-in replacement for Underscore, Lodash or Ramda. Instead it is built around the
idea that Javascript is a dynamic language, but sometimes it needs a little help. Types are
strongly enforced only when weak enforcement would either limit the revealing of function
intent or if contract violation would introduce broken or buggy behavior.

Licensed under the Mozilla Public License (MPL). For the full text of the license please see the included text file.
If the text file has been removed, please visit:

https://www.mozilla.org/MPL/

### 4.2.1 ###

- Enhanced type error output
- Updated type signatures with names for type identifiers

### v4.1.0

- Added dependent type definitions to concat and between
- Added isTypeOf operator to concatable type definition
- Added notBetween function

### v4.0.0

Important breaking changes:

- Compose now only composes two functions
- Large number of predicates added
- Removed all nil returns on non-array functions

### v3.5.0

Added notNil and exists types

### v3.4.2

Fixed client-side dependency issues

### v3.0.0

System overhaul. Code written with earlier versions of JFP will be incompatible with v3.0.0. 
Currently, there is no migration path planned due to stronger typing and radical contract
modification. Although this may be inconvenient for people currently using older versions of
JFP, it will, in the long run, be a benefit to all who use the library.

Many functions were eliminated completely either due to underuse, violation of philosophy
or they were simply unnecessary given the updated library behavior.