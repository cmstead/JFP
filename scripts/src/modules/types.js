(function (j) {
    'use strict';

    var signet = typeof signet !== 'undefined' ? signet : require('signet')();

    function checkNil(value) {
        return value.length === 0 && Object.keys(value).length === 0;
    }

    function checkMaybe(value, typeObj) {
        return signet.isTypeOf(typeObj.valueType[0])(value) || checkNil(value);
    }

    function checkSignet(value) {
        var isFunction = signet.isTypeOf('function');

        return isFunction(value.subtype) &&
            isFunction(value.extend) &&
            isFunction(signet.isTypeOf);
    }

    function checkArguments(value) {
        return Object.prototype.toString.call(value) === '[object Arguments]';
    }

    function checkNull(value) {
        return value === null;
    }

    function checkDefined (value){
        return !signet.isTypeOf('undefined')(value);
    }

    function checkIndex (value){
        return value >= 0;
    }

    function setJfpTypes(_signet) {
        var numberPattern = '^[0-9]+((\\.[0-9]+)|(e\\-?[0-9]+))?$';
        _signet.subtype('array')('nil', checkNil);
        _signet.subtype('int')('index', checkIndex);
        _signet.subtype('object')('arguments', checkArguments);
        _signet.subtype('object')('signet', checkSignet);

        _signet.extend('maybe', checkMaybe);
        _signet.extend('null', checkNull);
        _signet.extend('defined', checkDefined);

        _signet.alias('numeric', 'taggedUnion<number;formattedString<' + numberPattern + '>>');
        _signet.alias('comparable', 'taggedUnion<boolean;number;string;symbol;null>');

        return _signet;
    }

    setJfpTypes(signet);

    Object.defineProperty(j, 'nil', {
        get: function () {
            return [];
        }
    });

    // Type system behaviors
    j.enforce = signet.enforce;
    j.isTypeOf = signet.isTypeOf;
    j.setJfpTypes = signet.enforce('signet => signet', setJfpTypes);


})(jfp);