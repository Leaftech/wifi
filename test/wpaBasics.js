'use strict';
var assert = require('chai').assert;
require('chai').should();
const WpaCli = require('../');
describe('WpaCli Basic Tests', function() {
    describe('connect to wpa', function() {
        it('should emit an ready event', function(done) {
            var wpa = new WpaCli('wlan0');

            var errTimeout = setTimeout(function() {
                assert(false, 'Event never fired');
                done();
            }, 1000);

            wpa.once('ready', function() {
                clearTimeout(errTimeout); //cancel error timeout
                assert(true);
                done();
            });
            wpa.connect();
        });
        it('should emit an list_network event', function(done) {
            var wpa = new WpaCli('wlan0');

            var errTimeout = setTimeout(function() {
                assert(false, 'Event never fired');
                done();
            }, 2000);

            wpa.once('ready', function() {
                wpa.listNetworks();
            });
            wpa.once('list_network', function(results) {
                clearTimeout(errTimeout); //cancel error timeout
                results.should.be.a('array');
                done();
            });
            wpa.connect();

        });
        it('should emit an status event', function(done) {
            var wpa = new WpaCli('wlan0');

            var errTimeout = setTimeout(function() {
                assert(false, 'Event never fired');
                done();
            }, 2000);

            wpa.once('ready', function() {
                wpa.status();
            });
            wpa.once('status', function(result) {
                clearTimeout(errTimeout); //cancel error timeout
                result.should.be.a('object');
                done();
            });
            wpa.connect();

        });
        it('should emit an scan_results event', function(done) {
            var wpa = new WpaCli('wlan0');

            var errTimeout = setTimeout(function() {
                assert(false, 'Event never fired');
                done();
            }, 5000);

            wpa.once('ready', function() {
                wpa.scan();
            });
            wpa.once('scan_results', function(results) {
                clearTimeout(errTimeout); //cancel error timeout
                results.should.be.a('array');
                done();
            });
            wpa.connect();

        }).timeout(5000);
        it('should emit an raw_msg event', function(done) {
            var wpa = new WpaCli('wlan0');

            var errTimeout = setTimeout(function() {
                assert(false, 'Event never fired');
                done();
            }, 5000);

            wpa.once('ready', function() {
                wpa.scan();
            });
            wpa.once('raw_msg', function(msg) {
                clearTimeout(errTimeout); //cancel error timeout
                msg.should.be.a('string');
                done();
            });
            wpa.connect();

        });

    });
});
