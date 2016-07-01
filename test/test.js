'use strict';
var assert = require('chai').assert;
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should emit an some_event', function(done) {
            var errTimeout = setTimeout(function() {
                assert(false, 'Event never fired'); //or assert.fail, or whatever.
                done(); //I don't remember whether or not you still supposed to call done()
            }, 1000); //timeout with an error in one second

            myObj.on('some_event', function() {
                clearTimeout(errTimeout); //cancel error timeout
                assert(true);
                done();
            });
        });
    });
});
