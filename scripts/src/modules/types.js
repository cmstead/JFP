(function (j) {
    'use strict';

    var _signet = typeof signet !== 'undefined' ? signet : null;

    if (typeof require === 'function') {
        _signet = require('signet')();
    }

    var signetDefinition = {
        alias: 'function',
        defineDependentOperatorOn: 'function',
        defineDuckType: 'function',
        extend: 'function',
        isTypeOf: 'function',
        subtype: 'function'
    };

    function checkConcatable(value) {
        return typeof value.concat === 'function';
    }

    function checkNil(value) {
        return value.length === 0;
    }

    function checkPair(value) {
        return value.length > 0;
    }

    function isSameType(a, b) {
        return typeof a === typeof b;
    }

    function setJfpTypes(__signet) {
        var numberPattern = '^[0-9]+((\\.[0-9]+)|(e\\-?[0-9]+))?$';

        __signet.subtype('array')('nil', checkNil);
        __signet.subtype('array')('pair', checkPair);
        __signet.defineDuckType('signet', signetDefinition);

        __signet.alias('defined', 'not<undefined>');
        __signet.subtype('defined')('concatable', checkConcatable);

        __signet.alias('natural', 'leftBoundedInt<0>')
        __signet.alias('index', 'natural');

        __signet.alias('comparable', 'variant<boolean, number, string>');
        __signet.alias('exists', 'not<variant<nil, null, undefined>>');
        __signet.alias('maybe', 'variant<null, _>');
        __signet.alias('notNull', 'not<null>');
        __signet.alias('notNil', 'not<nil>');
        __signet.alias('numeric', 'variant<number, formattedString<' + numberPattern + '>>');
        __signet.alias('objectInstance', 'composite<not<null>, object>')
        __signet.alias('objectKey', 'variant<string, symbol>');
        __signet.alias('predicate', 'function');
        __signet.alias('referencible', 'variant<objectInstance, string, function>');
        __signet.alias('typeString', 'string');

        __signet.defineDependentOperatorOn('concatable')('isTypeOf', isSameType);

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
    j.enforce = _signet.enforce;
    j.isTypeOf = _signet.isTypeOf;
    j.sign = _signet.sign;

    j.either = _signet.enforce('type => defaultValue:* => value:* => *', either);
    j.maybe = _signet.enforce('type => value:* => maybe<defined>', maybe);
    j.setJfpTypes = _signet.enforce('signet => signet', setJfpTypes);

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
