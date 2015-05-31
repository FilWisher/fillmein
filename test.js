"use strict";


var test = require("tape");
var fill = require("./");


test("if not object, stop with warning", function (t) {

    function error (fn) {
        try {
            fn();
            t.fail("should not be executed");
        } catch (e) {
            t.ok(e, "error thrown"); 
        } 
    }
    function cb () {}
    error(function () { return fill(undefined, cb); }); 
    error(function () { return fill("test", cb); }); 
    error(function () { return fill(12, cb); }); 
    error(function () { return fill(null, cb); }); 
    error(function () { return fill([], cb); });
    t.end();
});


test("if empty object, return empty object", function (t) {

    function cb () {}
    t.deepEqual(fill({}, cb), {}, "objects are both empty");
    t.end();
});


test("returns object with returned value of fns", function (t) {

    var obj = {
        levelone: function (cb) {
            return cb(null, 7);  
        },
        next: {
            leveltwo: function (cb) {
                return cb(null, 8); 
            },
            next: {
                levelthree: function (cb) {
                    return cb(null, 9); 
                } 
            }
        }
    };
    fill(obj, function (err, filled) {
     
        t.notOk(err, "no error returned"); 
        t.equals(filled.levelone, 7, "level1 properties filled");
        t.equals(filled.next.leveltwo, 8, "level2 properties filled");
        t.equals(filled.next.next.levelthree, 9, "level3 properties filled");
        t.end();
    });
});


test("async fns", function (t) {

    var obj = {
        levelone: function (cb) {
            
            setTimeout(function () {
           
                return cb(null, 7);  
            }, 100);
        },
        next: {
            leveltwo: function (cb) {
                
                setTimeout(function () {
               
                    return cb(null, 8);  
                }, 700);
            },
            unchanged: "test",
            next: {
                levelthree: function (cb) {
                    
                    setTimeout(function () {
                   
                        return cb(null, 9);  
                    }, 200);
                }
            }
        }
    };
    fill(obj, function (err, filled) {
     
        t.notOk(err, "no error returned"); 
        t.equals(filled.levelone, 7, "level1 properties filled");
        t.equals(filled.next.leveltwo, 8, "level2 properties filled");
        t.equals(filled.next.next.levelthree, 9, "level3 properties filled");
        t.end();
    });
});

test("errors returned too", function (t) {

    
    var obj = {
        levelone: function (cb) {
            
            setTimeout(function () {
           
                return cb("error");  
            }, 100);
        },
        next: {
            leveltwo: function (cb) {
                
                setTimeout(function () {
               
                    return cb("error");  
                }, 700);
            },
            unchanged: "test",
            next: {
                levelthree: function (cb) {
                    
                    setTimeout(function () {
                   
                        return cb("error");  
                    }, 200);
                }
            }
        }
    };
    fill(obj, function (err, data) {
   
        t.equals(err.length, 3, "3 errors returned");
        t.end();
    });
});
