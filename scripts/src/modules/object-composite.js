(function (j) {
	'use strict';
	
    /*
     * toValues converts an object to an array of values
     * This is necessary for reduce to convert objects into
     * processible arrays in an upcoming version.
     */
	function keyReduction (baseObj, finalList, key) {
		return j.conj(baseObj[key], finalList);
	}
	
	function toValues (baseObj) {
		var reducer = j.partial(keyReduction, baseObj);
		return j.isNull(j.maybe(baseObj, 'object')) ? null : j.reduce(reducer, Object.keys(baseObj), []);
	}

	function dereferencer(dataObject, token){
        var key = j.either('', token).trim();
        return key === '' ? dataObject : j.pick(token, dataObject);
    }

    function internalDeref(key, baseData, defaultValue){
        var sanitizedDefault = defaultValue === undefined ? null : defaultValue,
            keyTokens = key.split('.'),
            result = j.reduce(dereferencer, keyTokens, baseData);
        
        return j.either(sanitizedDefault, result);
    }
    
    function deref(key, baseData, defaultValue){
        // Satisifes backwards-compatibility case where key an data are reversed
        var sanitizedKey = typeof key === 'string' ? key : baseData,
            sanitizedData = typeof baseData === 'object' ? baseData : key;
        
        // Fully sanitize data before executing the dereference function
        sanitizedKey = j.either('', sanitizedKey, 'string');
        sanitizedData = j.either(null, sanitizedData, 'object');
        
        return internalDeref(j.either('', sanitizedKey), sanitizedData, defaultValue);
    }
    
    function plucker (baseObj, finalObj, key){
        finalObj[key] = baseObj[key];
        return finalObj;
    }
    
    function pluckKeys (keys, baseObj){
        var sanitizedObject = j.either({}, baseObj, 'object');
        return j.reduce(j.partial(plucker, sanitizedObject), keys, {});
    }
    
    function pluck (key, baseObj) {
        return pluckKeys([key], baseObj);
    }

	j.deref = deref;
    j.pluck = pluck;
    j.pluckKeys = pluckKeys;
    j.toValues = toValues;

})(jfp);