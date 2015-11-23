(function (j) {
	'use strict';
	
	function attachFunction (module, j, key) {
		if(j.isUndefined(j[key]) && j.isType('function', module[key])) {
			j[key] = module[key];
		}
		return j;
	}
	
	function addModule (provider) {
		var module = j.either(j.always({}), provider, 'function')(),
			moduleKeys = j.getKeys(module);
			
		return function () {
			return j.reduce(j.partial(attachFunction, module), moduleKeys, j);
		};
	}
	
	j.addModule = addModule;
	
})(jfp);