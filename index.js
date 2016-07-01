'use strict';
const unix = require('unix-dgram');
// const _ = require('underscore');
const EventEmitter = require('events').EventEmitter;
const exec = require('child_process').exec;
const WPA_CMD = {
    attach: 'ATTACH',
    scan: 'SCAN',
    scanResult: 'SCAN_RESULTS',
    addNetwork: 'ADD_NETWORK',
    listNetwork: 'LIST_NETWORKS',
    setSSID: 'SET_NETWORK :id ssid ":ssid"',
    setPassword: 'SET_NETWORK :id psk ":password"',
    setNetwork: 'SET_NETWORK :id :key :value',
    status: 'STATUS',
    enableNetwork: 'ENABLE_NETWORK :id',
    selectNetwork: 'SELECT_NETWORK :id'
};
class WpaCli extends EventEmitter {
    constructor(ifName) {
        super();
        this.ifName = ifName;
        this.socketPath = '/var/run/wpa_supplicant/' + ifName;
        this.client = unix.createSocket('unix_dgram');
        this.clientPath = '/tmp/wpa_ctrl' + Math.random().toString(36).substr(1);
    }
    connect() {
        this.client.on('message', this._onMessage.bind(this));
        this.client.on('error', this._onError.bind(this));
        this.client.on('congestion', this._onCongestion.bind(this));
        this.client.once('connect', this._onConnect.bind(this));
        this.client.once('listening', this._onListening.bind(this));
        this.client.connect(this.socketPath);
        this.client.bind(this.clientPath);
    }
    _onConnect() {
        console.log('connected');
    }
    _onMessage(msg) {
        msg = msg.toString();
        this._onRawMsg(msg);
        switch (true) {
            case /<3>/.test(msg):
                this._onCtrlEvent(msg.toString());
                break;
            case /bssid \/ frequency \/ signal level \/ flags \/ ssid/.test(msg):
                this._onScanResult(msg);
                break;
            case /network id \/ ssid \/ bssid \/ flags/.test(msg):
                this._onListNetwork(msg);
                break;
            case /p2p_device_address\=\w{2}\:\w{2}\:\w{2}\:\w{2}\:\w{2}\:\w{2}\naddress\=\w/.test(msg):
                this._onStatus(msg);
                break;
        }
    }
    _onCtrlEvent(msg) {
        switch (true) {
            case /CTRL-EVENT-SCAN-STARTED/.test(msg):
                this.emit('scanning');
                break;
            case /CTRL-EVENT-SCAN-RESULTS/.test(msg):
                this.scanResults();
                break;
            case /CTRL-EVENT-CONNECTED/.test(msg):
                this._onApConnected(msg);
                break;
            case /CTRL-EVENT-DISCONNECTED/.test(msg):
                this._onApDisconnected(msg);
                break;
        }
    }
    _onError(err) {
        console.log('error:', err);
    }
    _onCongestion(err) {
        console.log('congestion', err);
    }
    _onListening() {
        this.emit('ready');
        this.sendCmd(WPA_CMD.attach);
    }
    sendCmd(msg) {
        this.client.send(new Buffer(msg));
    }
    scan() {
        this.sendCmd(WPA_CMD.scan);
    }
    scanResults() {
        this.sendCmd(WPA_CMD.scanResult);
    }
    _onScanResult(msg) {
        msg = msg.split('\n');
        msg.splice(0, 1);
        var scanResults = [];
        msg.forEach(function(line) {
            if (line.length > 3) {
                line = line.split('\t');
                scanResults.push({
                    bssid: line[0].trim(),
                    freq: line[1].trim(),
                    rssi: line[2].trim(),
                    ssid: line[4].trim()
                });
            }
        });
        this.emit('scan_results', scanResults);
    }
    _onRawMsg(msg) {
        this.emit('raw_msg', msg);
    }
    _onListNetwork(msg) {
        msg = msg.split('\n');
        msg.splice(0, 1);
        var networkResults = [];
        msg.forEach(function(line) {
            if (line.length > 3) {
                line = line.split('\t');
                networkResults.push({
                    networkId: line[0].trim(),
                    ssid: line[1].trim()
                });
            }
        });
        this.emit('list_network', networkResults);
    }
    addNetwork() {
        this.sendCmd(WPA_CMD.addNetwork);
    }
    listNetwork() {
        this.sendCmd(WPA_CMD.listNetwork);
    }
    status() {
        this.sendCmd(WPA_CMD.status);
    }
    _onStatus(msg) {
        msg = msg.split('\n');
        var status = {};
        msg.forEach(function(line) {
            if (line.length > 3) {
                line = line.split('=');
                status[line[0]] = line[1];
            }
        });
        this.emit('status', status);
    }
    setSSID(networkId, ssid) {
        this.sendCmd(WPA_CMD.setSSID.replace(':id', networkId).replace(/:ssid/, ssid));
    }
    setPassword(networkId, password) {
        this.sendCmd(WPA_CMD.setPassword.replace(':id', networkId).replace(/:password/, password));
    }
    enableNetwork(networkId) {
        this.sendCmd(WPA_CMD.enableNetwork.replace(/:id/, networkId));
    }
    selectNetwork(networkId) {
        this.sendCmd(WPA_CMD.selectNetwork.replace(/:id/, networkId));
    }
    _onApConnected() {
        this.emit('ap_connected');
        this.startDhclient();
    }
    _onApDisconnected() {
        this.emit('ap_disconnected');
        this.stopDhclient();
    }
    startDhclient() {
        exec('dhclient ' + this.ifName, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('dhclient started');
            }
        });
    }
    stopDhclient() {
        exec('dhclient -r ' + this.ifName, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('dhclient stopped');
            }
        });
    }
}

module.exports = WpaCli;
