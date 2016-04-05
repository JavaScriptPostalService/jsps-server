'use strict';

/**
 * remove item from array
 * @function remove
 * @param {array} arr - array to manipulate
 * @param {string} what - what to remove
*/
const remove = function(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);
    }
}
