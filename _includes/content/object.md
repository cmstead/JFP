##Object Functions

**clone**

- Performance: O(n) where n is the count of elements in your object tree
- Arguments: {any} object[, {int} depth]
- Description: Deep clones an object or clones to a particular depth

####Example

    var original = { foo: 'bar', baz: ['quux'] },
        clone = j.clone(original);
    
    JSON.stringify(original) === JSON.stringify(clone); // true
    original === clone; // false
    original.baz === clone.baz; // false

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


