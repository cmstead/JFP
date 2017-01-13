var j = require('../../dist/jfp.min');
var sinon = require('sinon');
var timer = require('../timer/test-timer')();

describe('jfp core', function () {
    
    beforeEach(function () {
        timer.setMaxAcceptableTime(0);
        timer.reset();
        timer.start();
    });

    afterEach(function () {
        timer.stop();
        timer.report();
    });

    describe('maybe', function () {
        
        var isNull = j.isTypeOf('null');
        
        it('should return null if value is not a type match', function () {
            var result = j.maybe('number')('foo');
            
            expect(isNull(result)).toBe(true);
        });
        
        it('should return value if value is a type match', function () {
            var result = j.maybe('string')('foo');
            
            expect(result).toBe('foo');
        });
        
        it('should take a predicate function in place of a type', function () {
            var isEven = j.compose(j.equal(0), j.modBy(2));
            
            expect(isNull(j.maybe(isEven)(3))).toBe(true);
            expect(j.maybe(isEven)(4)).toBe(4);
        });

    });
    
    describe('either', function () {
        
        it('should return value if value matches type', function () {
            expect(j.either('number')(0)(42)).toBe(42);
        });
        
        it('should return default value if value does not match type', function () {
            expect(j.either('number')(0)('foo')).toBe(0);
        });
        
        it('should take a predicate function in place of a type', function () {
            var isEven = j.compose(j.equal(0), j.modBy(2));
            expect(j.either(isEven)(0)(3)).toBe(0);
            expect(j.either(isEven)(0)(4)).toBe(4);
        });
        
    });
    
    describe('identity', function () {
        
        it('should return passed value', function () {
            expect(j.identity('foo')).toBe('foo');
        });
        
    });
    
    describe('always', function () {
        
        it('should return bound value ', function () {
            expect(j.always('foo')()).toBe('foo');
        });
        
    });
    
    describe('cons', function () {
        
        it('should return new array with value prepended', function () {
            var result = j.cons(1, [2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[1,2,3,4]');
        });
        
        it('should return new array without undefined prepended', function () {
            var result = j.cons(undefined, [2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[2,3,4]');
        });
        
    });
    
    describe('conj', function () {
        
        it('should return new array with value prepended', function () {
            var result = j.conj(1, [2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[2,3,4,1]');
        });
        
        it('should return new array without undefined prepended', function () {
            var result = j.conj(undefined, [2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[2,3,4]');
        });
        
    });
    
    describe('slice', function () {
        
        it('should slice starting at an initial index', function () {
            var result = j.slice(1)([1, 2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[2,3,4]');
        });
        
        it('should slice starting at an initial index', function () {
            var result = j.slice(1, 3)([1, 2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[2,3]');
        });
        
    });
    
    describe('recur', function () {
        
        function fac (recur, n, current){
            var result = !j.isTypeOf('undefined')(current) ? current : 1;
            return n === 0 ? result : recur(n-1, result * n); 
        }
        
        it('should evaluate fac 0 correctly', function () {
            expect(j.recur(fac)(0)).toBe(1);
        });
        
        it('should evaluate fac 2 correctly', function () {
            expect(j.recur(fac)(2)).toBe(2);
        });
        
        it('should evaluate fac 30 correctly', function () {
            expect(j.recur(fac)(30)).toBe(2.652528598121911e+32);
        });
        
    });
    
    describe('compose', function () {
        
        function inc (value){
            return value + 1;
        }
        
        it('should compose one function', function () {
            var add1 = j.compose(inc);
            
            expect(add1(5)).toBe(6);
        });
        
        it('should compose two functions', function () {
            var add2 = j.compose(inc, inc);
            
            expect(add2(5)).toBe(7);
        });
        
        it('should compose multiple functions', function () {
            var addMany = j.compose(inc, inc, inc, inc, inc, inc);
            
            expect(addMany(5)).toBe(11);
        });
        
    });
    
    describe('curry', function () {
        
        function add3Vals (a, b, c){
            return a + b + c;
        }
        
        it('should return a function which can be called as usual', function () {
            expect(j.curry(add3Vals)(1, 2, 3)).toBe(6);
        });
        
        it('should return a curried function', function () {
            expect(j.curry(add3Vals)(1)(2)(4)).toBe(7);
            expect(j.curry(add3Vals)(1, 2)(5)).toBe(8);
            expect(j.curry(add3Vals)(1)(2, 6)).toBe(9);
            expect(j.curry(add3Vals)()()()(1)(2, 4)).toBe(7);
        });

        it('should curry to a specified length', function () {
            expect(typeof j.curry(add3Vals, 4)(1, 2, 3)).toBe('function');
            expect(typeof j.curry(add3Vals, 4)(1, 2, 3, 4)).toBe('number');
        });

    });
    
    describe('rcurry', function () {
        
        function div (a, b){
            return a / b;
        }
        
        it('should return a curried function', function () {
            expect(j.rcurry(div)(3)(12)).toBe(4);
            expect(j.rcurry(div)(12, 4)).toBe(3);
        });

        it('should curry to a specified length', function () {
            expect(typeof j.rcurry(div, 3)(1, 2)).toBe('function');
        });

    });
    
    describe('partial', function () {
        
        function add (a, b){
            return a + b;
        }
        
        it('should partially apply arguments to a function', function () {
            expect(j.partial(add, 5, 6)()).toBe(11);
            expect(j.partial(add, 6)(7)).toBe(13);
            expect(j.partial(add)(7, 8)).toBe(15);
        });
        
    });
    
    describe('rpartial', function () {
        
        function divide (a, b){
            return a / b;
        }
        
        function truncate (value){
            return Math.floor(value * 1000) / 1000;
        }
        
        it('should partially apply arguments to a function from right to left', function () {
            expect(j.rpartial(divide, 6, 12)()).toBe(0.5);
            expect(j.rpartial(divide, 3)(12)).toBe(4);
            expect(truncate(j.rpartial(divide)(4, 12))).toBe(0.333);
        });
        
    });

    describe('repeat', function(){

        it('should repeat an operation one time', function () {
            var callCount = 0;

            function spy (){
                callCount ++;
            }

            j.repeat(spy)(1)();

            expect(callCount).toBe(1);
        });

        it('should repeat an operation multiple times', function () {
            var callCount = 0;

            function spy (){
                callCount ++;
            }

            j.repeat(spy)(5)();

            expect(callCount).toBe(5);
        });

        it('should repeat with previous result', function () {
            function repeatStr (astr){
                return function (count) {
                    return j.repeat(j.concat(astr))(count)('');
                };
            }

            expect(j.repeat(j.inc)(5)(2)).toBe(7);
            expect(repeatStr('a')(5)).toBe('aaaaa');
        });

    });
    
});