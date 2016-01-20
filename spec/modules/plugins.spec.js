var jfp = require('../../dist/jfp.js'),
    j = jfp;

(function () {
	'use strict';

	describe('plugins', function () {
		
		function myPlugin (j) {
			return {
				foo: function () {},
				bar: 'baz',
				always: function () { return 'Boo.'; }
			};
		}
		
		it('should return a function', function () {
			expect(typeof j.addModule(myPlugin)).toBe('function');
		});
		
		it('should call the passed function', function () {
			var spy = jasmine.createSpy('spy').and.returnValue({});
			j.addModule(spy);
			expect(spy).toHaveBeenCalled();
		});
		
		it('should not fail if no function is provided', function () {
			expect(j.addModule).not.toThrow();
		});

		it('should not fail if no function returns a non-object', function () {
			expect(j.partial(j.addModule, function () {})).not.toThrow();
		});

		describe('returned function', function () {
			
			it('should attach module from provider function', function () {
				j.addModule(myPlugin)();
				expect(typeof j.foo).toBe('function');
			});
			
			it('should not modify an existing function', function () {
				j.addModule(myPlugin)();
				expect(typeof j.always(true)).toBe('function');
			});
			
			it('should not add a non-function property', function () {
				j.addModule(myPlugin)();
				expect(j.isUndefined(j.bar)).toBe(true);
			});
			
		});
		
	});

})();
