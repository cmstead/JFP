##Object Functions

**clone**

- Performance: O(n) where n is the count of elements in your object tree
- Arguments: {any} object[, {int} depth]
- Description: Deep clones an object or clones to a particular depth

####Example

    var original = { foo: 'bar', baz: ['quux'] },
        clone = j.clone(original),
        shallowCopy = j.clone(original, 0);
    
    JSON.stringify(original) === JSON.stringify(clone); // true
    original === clone; // false
    original.baz === clone.baz; // false

    original === shallowCopy; // false
    original.baz === shallowCopy.baz; // true

**getKeys**

- Performance: O(1)
- Arguments: {object} value
- Description: returns an array of keys. If obj is empty or value is not an object, getKeys will return an empty array

####Example

    var myObj = { foo: 'foo', bar: 'bar' };
    
    j.getKeys(myObj); // ['foo', 'bar']
    j.getKeys('Bloop!'); // []
    j.getKeys(null); // []

**merge**

- Performance: O(n)
- Arguments: {object} defaultObject, {object} mergeData
- Description: Merges data from mergeData into new object, filling missing data with default object

####Example

    var defaultData = {
            1: 'foo',
            2: 'bar',
            3: 'baz'
        },
        mergeData = {
            1: 'baz',
            3: 'quux'
        };
    
    j.merge(defaultData, mergeData);
    
    // {
    //     1: 'baz',
    //     2: 'bar',
    //     3: 'quux'
    // }


**pick**

- Performance: O(1)
- Arguments: {string, number} key, {map} valueMap
- Description: Returns value at key in valueMap


####Example



    j.pick('test1', {
        'test1': 'test value 1',
        'test2': 'test value 2',
        'test3': 'test value 3',
    });

    //test value 1

    j.pick('test1', { 'test2': 'not returned' });

    //null




**pluck**

- Performance: O(1)
- Arguments: {string, number} key, {map} valueMap
- Description: Returns object containing key and value from valueMap at key


####Example



    j.pluck('test1', {
        'test1': 'test value 1',
        'test2': 'test value 2',
        'test3': 'test value 3',
    });

    //{ 'test1': 'test value 1' }




**pluckKeys**

- Performance: O(n)
- Arguments: {array of strings or numbers} keys, {map} valueMap
- Description: Returns object containing keys and values from valueMap at keys


####Example



    j.pluckKeys(['test1', 'test3'], {
        'test1': 'test value 1',
        'test2': 'test value 2',
        'test3': 'test value 3',
    });

    //{ 'test1': 'test value 1', 'test3': 'test value 3' }

**transform**

- Performance: O(n) to O(n^2) -- O(n^2) is pathological case
- Arguments: {array} transformPairs, {object} obj
- Description: transforms array from any one structure to a flattened new structure -- each pair represents a from key and a to key. The from key will be dereferenced and a new property will be assigned to the to-key. Any non-pair values in the array will be ignored.

####Example

    var myObj = {
        test: 'bar',
        bar: {
            value: 'bar',
            baz: {
                value: 'quux'
            }
        }
    },
    newObj = j.transform([['test', 'foo'], ['bar.baz', 'baz']], myObj);
    
    JSON.stringify(newObj); // {"foo":"bar","baz":"quux"}
