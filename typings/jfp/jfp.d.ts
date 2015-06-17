// Type definitions for JFP
// Project: http://cmstead.github.io/JFP
// Definitions by: Chris Stead <http://www.chrisstead.com>

declare var j: j.JfpStatic

declare module j {
	
	interface JfpStatic {
		/**
		 * jfp supports string function aliasing -- alias is a jfp function name and seeking behavior
		 * will happen against the jfp object only.
		 */
		 (alias: string, ...arguments: Array<any>): JfpCurriedOutput<any>;
		 (externalFunction: Function, ...arguments: Array<any>): JfpCurriedOutput<any>;
	}
	
	interface JfpCurriedOutput<T> {}
	
	//Array functions
	interface JfpStatic {
		
		/**
		 * Removes falsey values from an array
		 * @param values The array to compact
		 */
		compact(values: any[]): any[];
		
		/**
		 * Clones and concatenates two arrays
		 * @param values1 The array to concatenate to
		 * @param values2 The array to concatenate with
		 */
		concat(values1: any[], values2: any[]): any[];
		
		/**
		 * Appends value to clone of destination array
		 * @param value The value to add to the end of an array
		 * @param destination The array to be cloned and appended to
		 */
		conj(value: any, destination: any[]): any[];
		
		/**
		 * Prepends value to clone of destination array
		 * @param value The value to add to the beginning of an array
		 * @param destination The array to be cloned and prepended to
		 */
		cons(value: any, destination: any[]): any[];
		
		/**
		 * Drops value at specified index from clone of array
		 * @param index Index to perform drop at
		 * @param values Array to remove value from
		 */
		drop(index: number, values: any[]): any[];
		
		/**
		 * Drops first element from clone of values array
		 * @param values Array to drop first value of
		 */
		dropFirst(values: any[]): any[];
		
		/**
		 * Drops last element from clone of values array
		 * @param values Array to drop last value from
		 */
		dropLast(values: any[]): any[];
		
		/**
		 * Performs iterable function on each value of provided array
		 * @param iterable Function to perform on each value of array
		 * @param values Array to operate on
		 */
		each(iteratable: (value: any) => void, values: any[]): any[];
		
		/**
		 * Filters all values not passing provided predicate
		 * @param predicate Function which performs a boolean resultant operation on a value of the array
		 * @param values Array to filter
		 */
		filter(predicate: (value: any) => boolean, values: any[]): any[];
		
		/**
		 * Finds the first value in an array that satisfies provided predicate
		 * @param predicate Function which performs a boolean resultant operation on a value of the array
		 * @param values Array to run predicate against
		 */
		find(predicate: (value: any) => boolean, values: any[]): any;
		
		/**
		 * Returns the first value in an array
		 * @param values Array of values
		 */
		first(values: any[]): any;
		
		/**
		 * Returns last value in an array
		 * @param values Array of values
		 */
		last(values: any[]): any;
		
		/**
		 * Returns last index of an array
		 * @param values Array
		 */
		lastIndex(values: any[]): number;
		
		/**
		 * Maps functions into new array using mapper function
		 * @param mapper Mapping function
		 * @param values Array to map
		 */
		map(mapper: (value: any) => any, values: any[]): any[];
		
		/**
		 * Returns nth value of passed array
		 * @param index Array index
		 * @param values Array of values
		 */
		nth(index: number, values: any[]): any;
		
		/**
		 * Reduces array using reducer function
		 * @param reducer Function to reduce values with
		 * @param values Array to reduce
		 */
		reduce(reducer: (condition1: any, condition2: any) => any, values: any[]): any;

		/**
		 * Reduces array using reducer function
		 * @param reducer Function to reduce values with
		 * @param values Array to reduce
		 * @param initialCondition Initial value to use in first reduction application
		 */
		reduce(reducer: (condition1: any, condition2: any) => any, values: any[], initialCondition: any): any;
		
		/**
		 * Returns all but the first element of array
		 * @param values Array to return the rest of
		 */
		rest(values: any[]): any[];
		
		/**
		 * Returns a slice of an array
		 * @param initialIndex index to start slicing at
		 * @param values Array to slice
		 */
		slice(initialIndex: number, values: any[]): any[];
		
		/**
		 * Returns a slice of an array
		 * @param initialIndex index to start slicing at
		 * @param values Array to slice
		 * @param lastIndex Index to end slice with
		 */
		slice(initialIndex: number, values: any[], lastIndex: number): any[];
		
		/**
		 * Returns first n values of an array
		 * @param quantity Number of values to return
		 * @param values Array of values to take from
		 */
		take(quantity: number, values: any[]): any[];
		
		/**
		 * Returns array of values with duplicates removed
		 * @param values Array of values to filter by uniqueness
		 */
		unique(values: any[]): any[];
		
	}
	
	//Conditional functions
	interface JfpStatic {
		
		/**
		 * Returns preferred value if truthy, otherwise returns default value
		 * @param defaultValue Default value
		 * @param preferredValue Preferred value
		 */
		either(defaultValue: any, preferredValue: any): any;
		
		/**
		 * Returns provided value if truthy or matches datatype, otherwise returns default value
		 * @param defaultValue Default value
		 * @param preferredValue Preferred value
		 * @param datatype Type preferred value should be
		 */
		either(defaultValue: any, preferredValue: any, datatype: string): any;
		
		/**
		 * Returns preferred value if truthy, otherwise returns default value
		 * @param defaultValue Default value
		 * @param preferredValue Preferred value
		 * @param predicateValue Boolean switch to return default or preferred value
		 */
		eitherIf(defaultValue: any, preferredValue: any, predicateValue: boolean): any;
		
		/**
		 * Returns provided value if truthy, otherwise returns default value
		 * @param defaultValue Default value
		 * @param preferredValue Preferred value
		 * @param predicate Predicate function preferred value is tested against
		 */
		eitherWhen(defaultValue: any, preferredValue: any, predicate: (value: any) => boolean): any;
		 
		/**
		 * Returns preferred value if truthy, otherwise null
		 * @param preferredValue Preferred value to check
		 */
		maybe(preferredValue: any): any;
		
		/**
		 * Returns preferred value if truthy or matches datatype, otherwise null
		 * @param preferredValue Preferred value to check
		 * @param datatype Datatype to match
		 */
		maybe(preferredValue: any, datatype: string): any;
		  
		/**
		 * Executes function when condition is true
		 * @param predicateValue Value to set behavior execution
		 * @param userFunction Behavior to execute
		 */
		when(predicateValue: boolean, userFunction: Function): any;
		
		/**
		 * Executes function when condition is true
		 * @param predicateValue Value to set behavior execution
		 * @param userFunction Behavior to execute
		 * @param ...arguments arguments for userFunction
		 */
		when(predicateValue: boolean, userFunction: Function, ...arguments: any[]): any;
		
	}
	
	interface JfpStatic{
		
		/**
		 * Converts value to decimal equivalent returns null if non-convertable
		 * @param value String or number value to convert
		 */
		toDec(value: string): number;
		toDec(value: number): number;
		
		/**
		 * Converts an object literal into an array of values
		 * @param value Object literal
		 */
		toValues(value: Object): Array<any>;

	}
	
	interface JfpStatic{
		
		/**
		 * Applies an array of values to a function
		 * @param userFn Function to perform application against
		 * @param values Array of arguments for function
		 */
		apply(userFn: Function, values: Array<any>): void;
		
		/**
		 * Composes a set of functions into a new single function
		 * @param ...arguments Arguments for compose
		 */
		compose(...arguments: Array<Function>): Function
	
		/**
		 * Counts the number of arguments in a function declaration
		 * @param userFn Function to count arguments of
		 */
		countArguments(userFn: Function): number;
		
		/**
		 * Curries function until all arguments are satisfied
		 * @param userFn Function to curry
		 * @param ...argments Initial arguments for currying application
		 */
		curry(userFn: Function): Function;
		curry(userFn: Function): any;
		curry(userFn: Function, ...arguments: Array<any>): Function;
		curry(userFn: Function, ...arguments: Array<any>): any;
		
		/**
		 * Returns value passed to the function
		 * @param value Value to return
		 */
		identity(value: any): any;
		
		/**
		 * Applies values to a function and returns partially applied function
		 * @param userFn Function to apply values to
		 * @param ...arguments Values to apply
		 */
		partial(userFn: Function): Function;
		partial(userFn: Function, ...arguments: Array<any>): Function;
		
		/**
		 * Pipelines or chains functions producing a single final output
		 * @param value Initial condition for function pipelining
		 * @param ...arguments Functions to chain/pipeline
		 */
		pipeline(value: any, ...arguments: Array<Function>): any;
		pipeline(value: Array<any>, ...arguments: Array<Function>): any;
		pipeline(value: Object, ...arguments: Array<Function>): any;
		
		/**
		 * Recursion function to allow for tail-optimized recursion
		 * @param userFn Function to recur on
		 * @param ...arguments Initial condition arguments
		 */
		recur(userFn: Function): any;
		recur(userFn: Function, ...arguments: Array<any>): any;
		
		/**
		 * Performs a right partial application on a function
		 * @param userFn Function to apply arguments
		 * @param ...arguments Inital arguments
		 */
		rpartial(userFn: Function): any;
		rpartial(userFn: Function, ...arguments: Array<any>): any;
	}
	
}

declare module "jfp" {
	export = j;
}