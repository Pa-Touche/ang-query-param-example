/**
 * Example: {d: {e: {f: 'value1'}, 'g': 'value2'} returns ['d.e.f', 'g']
 *
 * @param obj any record type
 */
export function exctractLeafProperties(obj: Record<string, any>): string[] {
    return getLeafValuePairs(obj).map((keyValuePair) => keyValuePair[0]);
  }

export function getLeafValuePairs(obj: Record<string, any>): [string, any][] {
    let keyValuePairs: [string, any][] = [];
    for (const key in obj) {
        const objValue = obj[key];
        if (typeof objValue === 'object') {
            const keysOfCurrentObj = exctractLeafProperties(objValue);
            keyValuePairs = keyValuePairs.concat(
                keysOfCurrentObj.map(function (subKey) {
                    const nestedKey = `${key}.${subKey}`;
                    return [nestedKey, extractNestedProperty(obj, nestedKey)];
                })
            );
        } else {
            keyValuePairs.push([key, objValue]);
        }
    }
    return keyValuePairs;
}


export function extractNestedProperty(obj: any, nestedPropertyKey: string): any | undefined {
    return nestedPropertyKey?.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}



/**
 * Method is recursive and will go down to leaf elements. 
 * Array are handled in following manner: falsy are not removed, but if the array contains objects as leafs, those will be runned against this method. 
 * 
 * This method could be extended by adding params to ignore arrays. 
 * @param {*} obj: must be object (can be empty). Method is not robust to other input types: primitives/array.
 * 
 * The number 0 is not considered to be a falsy. (Even though striclty in JavaScript it's a falsy)
 * 
 * This function is meant to be runned against objects produced by Angular FormGroups.
 * 
 * @why ? when sending payloads to our backend, empty objects (or objects of falsys: "") were deserialized as class instances (which should be)
 * and the constraints on the fields failed. 
 */
export function falsyRemover(obj: any) {
    const cleanedObj = { ...obj };

    for (const key in cleanedObj) {
        if (cleanedObj.hasOwnProperty(key)) {
            //console.log(`${key}: ${returnedObj[key]}`);

            const val = cleanedObj[key];

            if (!val && val !== 0) {
                delete cleanedObj[key];
            } else {
                // WARNING: an array is also an object in JS... 
                if (Array.isArray(val)) {
                    cleanedObj[key] = arrFalsyRemover(val);
                } else if (typeof val === 'object') {
                    const valObj = falsyRemover(val);

                    // If after been "cleaned-up" by falsy remover, no more elements left, then the object can be removed. 
                    if (Object.keys(valObj).length === 0) {
                        delete cleanedObj[key];
                    } else {
                        cleanedObj[key] = valObj;
                    }
                }
            }
        }
    }

    return cleanedObj;
}

/**
 * Falsy will not be removed in an array, as it will break ordering. 
 * (could be changed if wanted). 
 * Warning: this method all items in the array will be of same type as first element (contains only one type).
 * Not robust.
 * @param {*} arr can be any obj.  
 */
export function arrFalsyRemover(arr: any) {
    if (arr.length === 0 || (!isObj(arr[0]) && !Array.isArray(arr[0]))) {
        return arr;
    }
    
    const mappingFct = isObj(arr[0]) ? (val: any) => falsyRemover(val) : (val: any) => arrFalsyRemover(val); 


    return arr.map(mappingFct);
}

export function isObj(candidate: any) {
    return typeof candidate === 'object' && !Array.isArray(candidate);
}