(function (j) {
	'use strict';
	
	function dereferencer(dataObject, token){
        var key = j.either('', token).trim();
        return key === '' ? dataObject : j.pick(token, dataObject);
    }

    function deref(baseData, key, defaultValue){
        var sanitizedDefault = defaultValue === undefined ? null : defaultValue,
            keyTokens = j.either('', key, 'string').split('.'),
            result = j.reduce(dereferencer, keyTokens, j.either(null, baseData, 'object'));
        
        return j.either(sanitizedDefault, result);
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

})(jfp);