'use strict';
var assert = require('chai').assert;
require('chai').should();
const WpaCli = require('../');
describe('WpaCli P2P Tests', function() {

    describe('Search for peer', function() {
        var wpa = new WpaCli('p2p0');
        it('should find peers on network', function(done) {
            wpa.once('ready', function() {
                wpa.once('peer_found', function(peer) {
                    peer.should.be.a('object');
                    done();
                }).peerFind();
            }).connect();
            // wpa.on('raw_msg', function(msg) {
            //     console.log(msg);
            // });
        }).timeout(5000);

    });
    describe('connect to peer', function() {
        var wpa = new WpaCli('p2p0');
        it('should connect to peer', function(done) {
            // wpa.on('raw_msg', function(msg) {
            //     console.log(msg);
            // });
            wpa.once('ready', function() {
                wpa.once('peer_found', function(peer) {
                    wpa.once('peer_connected', function() {
                        done();
                    });
                    wpa.peerConnectPBC(peer.deviceAddress, false);
                }).peerFind();
            }).connect();

        }).timeout(50000);
    });
});
