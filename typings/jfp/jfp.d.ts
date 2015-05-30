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
		 (alias: string, ...arguments: any): JfpCurriedOutput<any>;
		 (externalFunction: Function, ...arguments: any): JfpCurriedOutput<any>;
	}
	
	interface JfpCurriedOutput {}
	
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
		conj(value: T, destination: any[]): any[];
		
		/**
		 * Prepends value to clone of destination array
		 * @param value The value to add to the beginning of an array
		 * @param destination The array to be cloned and prepended to
		 */
		cons(value: T, destination: any[]): any[];
		
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
		find(predicate: (value: any) => boolean, values: any[]): any;
		first(values: any[]): any;
		last(values: any[]): any;
		lastIndex(values: any[]): number;
		map(mapper: (value: any) => any, values: any[]): any[];
		nth(index: number, values: any[]): any;
		reduce(reducer: (condition1: any, condition2: any) => <T>, values: any[], initialCondition?: any): <T>;
		rest(values: any[]): any[];
		slice(initialIndex: number, values: any[], lastIndex?: number): any[];
		take(quantity: number, values: any[]): any[];
		unique(values: any[]): any[];
		
	}
	
}

declare module "jfp" {
	export = j;
}