'use strict';
const WpaCli = require('./');
var wpa = new WpaCli('wlan0');
wpa.on('ready', function() {
    console.log('ready');
    wpa.listNetwork();
    wpa.addNetwork();
    wpa.setSSID(0, 'ssid');
    wpa.setPassword(0, 'password');
    wpa.enableNetwork(0);
    wpa.selectNetwork(0);
    wpa.listNetwork();
});

wpa.connect();


wpa.on('status', function(status) {
    console.log(status);
});
wpa.on('scan_results', function(scanResults) {
    console.log(scanResults);
});
wpa.on('list_network', function(networks) {
    console.log(networks);
});
wpa.on('raw_msg', function(msg) {
    console.log(msg);
});
