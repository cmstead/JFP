##Conversion Functions


**toDec**

- Performance: O(1)
- Arguments: {string or number} value
- Description: Converts string or numeric value to decimal value


####Example



    j.toDec('1.234');

    // 1.234

    j.toDec(0xA);

    // 11

    j.toDec(010);

    // 8




**toValues**

- Performance: O(n)
- Arguments: {map} valueMap
- Description: Returns array of values contained in hashmap


####Example



    j.toValues({
        1: "Value 1",
        2: "Value 2",
        3: "Value 3",
        4: "Value 4",
    });

    // [ "Value 1", "Value 2", "Value 3", "Value 4" ]


