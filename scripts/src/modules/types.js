(function (j) {
    'use strict';

    var _signet = typeof signet !== 'undefined' ? signet : null;

    if (typeof require === 'function') {
        _signet = require('signet')();
    }

    var isFunction = _signet.isTypeOf('function');
    var isNull = _signet.isTypeOf('null');
    var isUndefined = _signet.isTypeOf('undefined');

    function checkNil(value) {
        return value.length === 0;
    }

    function checkMaybe(value, typeObj) {
        return _signet.isTypeOf(typeObj[0])(value) || isNull(value);
    }

    function checkSignet(value) {
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

    function checkDefined(value) {
        return !isUndefined(value) && checkNotNull(value);
    }

    function checkExists(value) {
        return checkNotNull(value) &&
            checkNotNil(value) &&
            checkDefined(value);
    }

    function checkNatural(value) {
        return value >= 0;
    }

    function checkPair(value) {
        return value.length > 0;
    }

    function checkConcatable(value) {
        return checkDefined(value) && checkNotNull(value) && isFunction(value.concat);
    }

    function checkObjectInstance(value) {
        return value !== null;
    }

    function setJfpTypes(__signet) {
        var numberPattern = '^[0-9]+((\\.[0-9]+)|(e\\-?[0-9]+))?$';

        __signet.subtype('array')('nil', checkNil);
        __signet.subtype('array')('pair', checkPair);
        __signet.subtype('int')('natural', checkNatural);
        __signet.subtype('object')('signet', checkSignet);
        __signet.subtype('object')('objectInstance', checkObjectInstance);

        __signet.extend('maybe', checkMaybe);
        __signet.extend('notNull', checkNotNull);
        __signet.extend('notNil', checkNotNil);
        __signet.extend('exists', checkExists);
        __signet.extend('concatable', checkConcatable);

        __signet.extend('defined', checkDefined);

        __signet.alias('index', 'natural');
        __signet.alias('typeString', 'string');
        __signet.alias('predicate', 'function');
        __signet.alias('comparable', 'variant<boolean;number;string>');
        __signet.alias('numeric', 'variant<number;formattedString<' + numberPattern + '>>');
        __signet.alias('objectKey', 'variant<string;symbol>');
        __signet.alias('referencible', 'variant<objectInstance;string;function>');

        __signet.defineDependentOperatorOn('concatable')('isTypeOf', function (a, b){ return typeof a === typeof b; });

        return __signet;
    }

    setJfpTypes(_signet);

    Object.defineProperty(j, 'nil', {
        get: function () {
            return [];
        }
    });

    function either(typeDef) {
        var checkType = _signet.isTypeOf(typeDef);

        return function (defaultValue) {
            return function (value) {
                return checkType(value) ? value : defaultValue;
            };
        };
    }

    function maybe(typeDef) {
        var checkType = _signet.isTypeOf(typeDef);
        
        return function (value) {
            return checkType(value) ? value : null;
        };
    }

    // Type system behaviors
    j.either = _signet.enforce('type => * => *', either);
    j.enforce = _signet.enforce;
    j.isTypeOf = _signet.isTypeOf;
    j.maybe = _signet.enforce('* => maybe<defined>', maybe);
    j.setJfpTypes = _signet.enforce('signet => signet', setJfpTypes);
    j.sign = _signet.sign;
    j.typeChain = _signet.typeChain;

    // Prefab either checks

    j.eitherArray = either('array');
    j.eitherBoolean = either('boolean');
    j.eitherFunction = either('function');
    j.eitherInt = either('int');
    j.eitherNatural = either('natural');
    j.eitherNumber = either('number');
    j.eitherObject = either('object');
    j.eitherString = either('string');

    j.eitherConcatable = either('concatable');
    j.eitherObjectInstance = either('objectInstance');
    j.eitherReferencible = either('referencible');

    j.eitherDefined = either('defined');
    j.eitherNotNull = either('notNull');

    j.maybeDefined = maybe('defined');


})(jfp);