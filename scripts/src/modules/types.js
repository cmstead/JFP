(function (j) {
    'use strict';

    var signet = typeof signet !== 'undefined' ? signet : null;

    if(typeof require === 'function') {
        signet = require('signet')();
    }

    function checkNil(value) {
        return value.length === 0;
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

    function checkNotNull(value) {
        return !checkNull(value);
    }

    function checkDefined (value){
        return typeof value !== 'undefined';
    }

    function checkIndex (value){
        return value >= 0;
    }

    function checkNatural (value){
        return value >= 0;
    }

    function checkPair (value){
        return value.length > 0;
    }

    function checkReferencible (value){
        return signet.isTypeOf('taggedUnion<object;string;function>');
    }

    function setJfpTypes(_signet) {
        var numberPattern = '^[0-9]+((\\.[0-9]+)|(e\\-?[0-9]+))?$';
        _signet.subtype('array')('nil', checkNil);
        _signet.subtype('array')('pair', checkPair);
        _signet.subtype('int')('index', checkIndex);
        _signet.subtype('int')('natural', checkNatural);
        _signet.subtype('object')('arguments', checkArguments);
        _signet.subtype('object')('signet', checkSignet);

        _signet.extend('maybe', checkMaybe);
        _signet.extend('null', checkNull);
        _signet.extend('notNull', checkNotNull);
        _signet.extend('defined', checkDefined);
        _signet.extend('referencible', checkReferencible);

        _signet.alias('typeString', 'string');
        _signet.alias('predicate', 'function');
        _signet.alias('numeric', 'taggedUnion<number;formattedString<' + numberPattern + '>>');
        _signet.alias('comparable', 'taggedUnion<boolean;number;string>');
        _signet.alias('objectKey', 'taggedUnion<string;symbol>');

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
    j.typeChain = signet.typeChain;

})(jfp);