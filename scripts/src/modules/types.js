(function (j) {
    'use strict';

    var _signet = typeof signet !== 'undefined' ? signet : null;

    if(typeof require === 'function') {
        _signet = require('signet')();
    }

    function checkNil(value) {
        return value.length === 0;
    }

    function checkMaybe(value, typeObj) {
        return _signet.isTypeOf(typeObj.valueType[0])(value) || checkNil(value);
    }

    function checkSignet(value) {
        var isFunction = _signet.isTypeOf('function');

        return isFunction(value.subtype) &&
            isFunction(value.extend) &&
            isFunction(_signet.isTypeOf);
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

    function checkNotNil(value) {
        return !checkNil(value);
    }

    function checkDefined (value){
        return typeof value !== 'undefined';
    }

    function checkExists(value) {
        return checkNotNull(value) &&
            checkNotNil(value) &&
            checkDefined(value);
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
        return _signet.isTypeOf('taggedUnion<object;string;function>');
    }

    function setJfpTypes(__signet) {
        var numberPattern = '^[0-9]+((\\.[0-9]+)|(e\\-?[0-9]+))?$';
        __signet.subtype('array')('nil', checkNil);
        __signet.subtype('array')('pair', checkPair);
        __signet.subtype('int')('index', checkIndex);
        __signet.subtype('int')('natural', checkNatural);
        __signet.subtype('object')('arguments', checkArguments);
        __signet.subtype('object')('signet', checkSignet);

        __signet.extend('maybe', checkMaybe);
        __signet.extend('null', checkNull);
        __signet.extend('notNull', checkNotNull);
        __signet.extend('notNil', checkNotNil);
        __signet.extend('exists', checkExists);

        __signet.extend('defined', checkDefined);
        __signet.extend('referencible', checkReferencible);

        __signet.alias('typeString', 'string');
        __signet.alias('predicate', 'function');
        __signet.alias('numeric', 'taggedUnion<number;formattedString<' + numberPattern + '>>');
        __signet.alias('comparable', 'taggedUnion<boolean;number;string>');
        __signet.alias('objectKey', 'taggedUnion<string;symbol>');

        return __signet;
    }

    setJfpTypes(_signet);

    Object.defineProperty(j, 'nil', {
        get: function () {
            return [];
        }
    });

    // Type system behaviors
    j.enforce = _signet.enforce;
    j.isTypeOf = _signet.isTypeOf;
    j.setJfpTypes = _signet.enforce('signet => signet', setJfpTypes);
    j.typeChain = _signet.typeChain;

})(jfp);