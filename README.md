# object-filler

populate the values of an object with asynchronous functions

e.g

```js

var fill = require("object-filler");

var populateMe = {
    payments: function (cb) {
   
        // do something async
        setTimeout(function () {
       
            // err = undefined, data = [{...}]
            return cb(undefined, [{amount: 10, id: 19274}]); 
        }, 2000);
    },
    // properties can be nested as much as you like
    attributes: {
        members: function (cb) {
            
            // do something else async
            setTimeout(function () {
           
                // err = undefined, data = [{...}]
                return cb(undefined, [{name: "Cervantes", id: 88831}]); 
            }, 2000);
        }
    }
};

fill(populateMe, function (err, populatedObject) {

    /**
     *  populatedObject = {
     *    payments: [{amount: 10, id: 19274}],
     *    attributes: {
     *      members: [{name: "Cervantes", id: 88831}]
     *    }
     *  }
     */
    console.log(populatedObject);
});
```
