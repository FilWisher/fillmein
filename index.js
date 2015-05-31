"use strict";


module.exports = populate;


function isObj (o) { return ({}.toString.call(o) === "[object Object]"); }
function isFn  (f) { return ({}.toString.call(f) === "[object Function]"); }

function populate (obj, cb) {

    var terror = "object-filler takes ({object},{function})";

    if (!isObj(obj) || !isFn(cb)) throw new TypeError(terror);
    else if (Object.keys(obj).length === 0) return obj;

    var fns = findFns(obj); // extract functions
    var map = markObj(obj); // create map for return values
    
    var errs = [], ret = 0;
    return (function recurse (m, c) {
       
       if (c <= fns.length-1) {
         fns[c](function (err, data) {

             ret += 1;             
             if (err) errs.push(err);
             assignProp(m, map[c], data);
             if (ret >= fns.length) {
                 errs = (errs.length !== 0) ? errs : undefined;  
                 return cb(errs, m);
             }
         });
         return recurse(m, c+1);
       } 
    }(obj, 0));
}

function markObj (obj) {
    
    var map = [];
    var count = 0;
    (function iter (currentObj) {
        
        Object.keys(currentObj).forEach(function (key) {

            if (typeof currentObj[key] === "function") {
                currentObj[key] = count;
                map[count] = key;
                count += 1;
            } else if (typeof currentObj[key] === "object") {
                iter(currentObj[key]);
            }
        });
    }(obj));
    return map;
}

function findFns (obj) {

    return Object.keys(obj).reduce(function (fns, key) {
        
        if (isFn(obj[key])) fns.push(obj[key]);
        else if (isObj(obj[key])) fns = fns.concat(findFns(obj[key]));
        return fns;
    }, []);
}

function assignProp (obj, prop, val) {
    
    var keys = Object.keys(obj);
    if (keys.indexOf(prop) !== -1) return obj[prop] = val;
    else {
        keys.forEach(function (key) {
            if (isObj(obj[key])) assignProp(obj[key], prop, val); 
        }); 
    }
}
