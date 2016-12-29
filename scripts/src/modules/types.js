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
        return _signet.isTypeOf(typeObj[0])(value) || _signet.isTypeOf('null')(value);
    }

    function checkSignet(value) {
        var isFunction = _signet.isTypeOf('function');

        return isFunction(value.subtype) &&
            isFunction(value.extend) &&
            isFunction(_signet.isTypeOf);
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
        return _signet.isTypeOf('variant<object;string;function>');
    }

    function checkConcatable (value) {
        return checkDefined(value) && checkNotNull(value) && _signet.isTypeOf('function')(value.concat);
    }

    function checkFalse(value) {
        return value === false;
    }

    function setJfpTypes(__signet) {
        var numberPattern = '^[0-9]+((\\.[0-9]+)|(e\\-?[0-9]+))?$';
        __signet.subtype('array')('nil', checkNil);
        __signet.subtype('array')('pair', checkPair);
        __signet.subtype('int')('index', checkIndex);
        __signet.subtype('int')('natural', checkNatural);
        __signet.subtype('object')('signet', checkSignet);
        __signet.subtype('boolean')('false', checkFalse);

        __signet.extend('maybe', checkMaybe);
        __signet.extend('notNull', checkNotNull);
        __signet.extend('notNil', checkNotNil);
        __signet.extend('exists', checkExists);
        __signet.extend('concatable', checkConcatable);

        __signet.extend('defined', checkDefined);
        __signet.extend('referencible', checkReferencible);

        __signet.alias('typeString', 'string');
        __signet.alias('predicate', 'function');
        __signet.alias('numeric', 'variant<number;formattedString<' + numberPattern + '>>');
        __signet.alias('comparable', 'variant<boolean;number;string>');
        __signet.alias('objectKey', 'variant<string;symbol>');

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