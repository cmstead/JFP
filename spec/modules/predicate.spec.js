(function(){
    'use strict';
    
    describe('predicates', function(){
        
        describe('isObject', function(){
            
            it('should return true if value is an object', function(){
                expect(j.isObject({})).toBe(true);
            });
            
            it('should return false if value is not an object', function(){
                expect(j.isObject('test')).toBe(false);
            });
            
        });
        
        describe('isArray', function(){
            
            it('should return true if passed value is an array', function(){
                expect(j.isArray([])).toBe(true);
            });
            
            it('should fail if passed value is not an object', function(){
                expect(j.isArray('test')).toBe(false);
            });
            
            it('should fail if passed value is an object but not an array', function(){
                expect(j.isArray({})).toBe(false);
            });
            
        });
        
        describe('isBoolean', function(){
            
            it('should return true if argument is a boolean value', function(){
                expect(j.isBoolean(true)).toBe(true);
            });
            
            it('should return false if argument is not a boolean value', function(){
                expect(j.isBoolean('test')).toBe(false);
            });
            
        });
        
        describe('isString', function(){
            
            it('should return true when argument is a string', function(){
                expect(j.isString('test')).toBe(true);
            });
            
            it('should return false when argument is not a string', function(){
                expect(j.isString(null)).toBe(false);
            });
            
        });
        
        describe('isNull', function(){
            
            it('should return true if argument is null', function(){
                expect(j.isNull(null)).toBe(true);
            });
            
            it('should return false if argument is not null', function(){
                expect(j.isNull('test')).toBe(false);
            });
            
        });
        
        describe('isNumber', function(){
            
            it('should return true if value is a number', function(){
                expect(j.isNumber(1234)).toBe(true);
            });
            
            it('should return false if value is not a number', function(){
                expect(j.isNumber('test')).toBe(false);
            });
            
        });
        
        describe('isNumeric', function(){
            
            it('should return true if value is a number', function(){
                expect(j.isNumeric(1234)).toBe(true);
            });
            
            it('should return false if value is not a number or a numeric string', function(){
                expect(j.isNumeric('test')).toBe(false);
            });
            
            it('should return true when an integer string is passed', function(){
                expect(j.isNumeric('12')).toBe(true);
            });
            
            it('should return true when an octal string is passed', function(){
                expect(j.isNumeric('012')).toBe(true);
            });
            
            it('should return true when a hexadecimal string is passed', function(){
                expect(j.isNumeric('0x12')).toBe(true);
            });
            
            it('should return true when a decimal string is passed', function(){
                expect(j.isNumeric('12.3')).toBe(true);
            });
            
            it('should retrn true when an exponential string is passed', function(){
                expect(j.isNumeric('12e5')).toBe(true);
            });
            
            it('should return true when a negative exponential string is passed', function(){
                expect(j.isNumeric('12e-5')).toBe(true);
            });
            
        });
        
        describe('isTruthy', function(){
            
            it('should return true if value resolves truthy', function(){
                expect(j.isTruthy('test')).toBe(true);
            });
            
            it('should return false if value resolves falsey', function(){
                expect(j.isTruthy(undefined)).toBe(false);
            });
            
        });
        
        describe('isUndefined', function(){
            
            it('should return true if argument is undefined', function(){
                expect(j.isUndefined(undefined)).toBe(true);
            });
            
            it('should return false if argument is not undefined', function(){
                expect(j.isUndefined(null)).toBe(false);
            });
            
        });
        
        describe('not', function(){
            
            it('should return a boolean', function(){
                expect(typeof j.not()).toBe('boolean');
            });
            
            it('should negate any value passed in', function(){
                expect(j.not(true)).toBe(false);
            });
            
        });
        
    });
    
})();