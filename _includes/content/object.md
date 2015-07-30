##Object Functions


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


