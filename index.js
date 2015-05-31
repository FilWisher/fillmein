module.exports = function populate (obj, cb) {
    
    var fns = findFns(obj);
    var map = markObj(obj);

    var ret = 0;
    return (function recurse (m, c) {
       
       if (c <= fns.length-1) {
         
         fns[c](function (err, data) {

             ret += 1;             
             if (err) return cb(err, m);
             m[map[c]] = data;
             if (ret >= fns.length) return cb(undefined, m);
         });
         return recurse(m, c+1);
       } 
    }(obj, 0));
}


function markObj (obj) {
    
    var map = [];
    var count = 0;
    (function iter (currentObj) {
        
        Object.keys(currentObj)
        .forEach(function (key) {

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
    return Object.keys(obj)
    .reduce(function (fns, key) {
        
        if (typeof obj[key] === "function") {
            fns.push(obj[key]);
        } else if (typeof obj[key] === "object") {
            fns = fns.concat(findFns(obj[key]));
        }
        return fns;
    }, []);
}
