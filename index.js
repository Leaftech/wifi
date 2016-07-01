'use strict';
const unix = require('unix-dgram');
// const _ = require('underscore');
const EventEmitter = require('events').EventEmitter;
const exec = require('child_process').exec;
/*
    WPA_CLI commands
 */
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
/**
 * WpaCli to control wpa_supplicant
 */
class WpaCli extends EventEmitter {
    /**
     * constructs WpaCli
     * @param  {String} ifName interface name eg. wlan0
     */
    constructor(ifName) {
            super();
            this.ifName = ifName;
            this.socketPath = '/var/run/wpa_supplicant/' + ifName;
            this.client = unix.createSocket('unix_dgram');
            this.clientPath = '/tmp/wpa_ctrl' + Math.random().toString(36).substr(1);
        }
        /**
         * connect to wpa control interface
         */
    connect() {
            this.client.on('message', this._onMessage.bind(this));
            this.client.on('error', this._onError.bind(this));
            this.client.on('congestion', this._onCongestion.bind(this));
            this.client.once('connect', this._onConnect.bind(this));
            this.client.once('listening', this._onListening.bind(this));
            this.client.connect(this.socketPath);

        }
        /**
         * connect event handler
         */
    _onConnect() {
            this.client.bind(this.clientPath);
        }
        /**
         * message event handler
         * @param  {Buffer} msg message recieved from wpa_ctrl
         */
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
        /**
         * control event handler
         * @param  {String} msg control event messages
         */
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
        /**
         * error event handler
         * @param  {String} err error message
         */
    _onError(err) {
            console.log('error:', err);
        }
        /**
         * congestion event handler
         * @param  {String} err congestion error message
         */
    _onCongestion(err) {
            console.log('congestion', err);
        }
        /**
         * listening event handler
         */
    _onListening() {
            this.emit('ready');
            this.sendCmd(WPA_CMD.attach);
        }
        /**
         * send request to wpa_cli
         * @param  {String} msg wpa_cli commands
         */
    sendCmd(msg) {
            this.client.send(new Buffer(msg));
        }
        /**
         * scan for wifi AP
         */
    scan() {
            this.sendCmd(WPA_CMD.scan);
        }
        /**
         * request for wifi scan results
         */
    scanResults() {
            this.sendCmd(WPA_CMD.scanResult);
        }
        /**
         * scan results handler
         * @param  {String} msg scan results message
         */
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
        /**
         * raw message handler from wpa_cli, captures all messages by default for debuging purposes
         * @param  {String} msg wpa messages
         */
    _onRawMsg(msg) {
            this.emit('raw_msg', msg);
        }
        /**
         * list network handler, list all configured networks or devices
         * @param  {String} msg network or devices list
         */
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
        /**
         * add new network
         */
    addNetwork() {
            this.sendCmd(WPA_CMD.addNetwork);
        }
        /**
         * request to list networks
         */
    listNetworks() {
            this.sendCmd(WPA_CMD.listNetwork);
        }
        /**
         * request for status
         */
        status() {
            this.sendCmd(WPA_CMD.status);
        }
        /**
         * status handler, parses status messages and emits status event
         * @param  {String} msg status message
         */
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
        /**
         * set network ssid
         * @param {String} networkId network id recieved from list networks
         * @param {String} add ssid to network
         */
    setSSID(networkId, ssid) {
            this.sendCmd(WPA_CMD.setSSID.replace(':id', networkId).replace(/:ssid/, ssid));
        }
        /**
         * set network password
         * @param {String} networkId networkId network id recieved from list networks
         * @param {String} password  add ssid to network
         */
    setPassword(networkId, password) {
            this.sendCmd(WPA_CMD.setPassword.replace(':id', networkId).replace(/:password/, password));
        }
        /**
         * enable configured network
         * @param  {string} networkId networkId network id recieved from list networks
         */
    enableNetwork(networkId) {
            this.sendCmd(WPA_CMD.enableNetwork.replace(/:id/, networkId));
        }
        /**
         * select network to connect
         * @param  {String} networkId networkId network id recieved from list networks
         */
    selectNetwork(networkId) {
            this.sendCmd(WPA_CMD.selectNetwork.replace(/:id/, networkId));
        }
        /**
         * AP connected event handler
         */
    _onApConnected() {
            this.startDhclient();
        }
        /**
         * AP disconnect event handler
         */
    _onApDisconnected() {
            this.stopDhclient();
        }
        /**
         * start dhclient for interface
         */
    startDhclient() {
            exec('dhclient ' + this.ifName, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    this.emit('ap_connected');
                }
            }.bind(this));
        }
        /**
         * stop dhclient for interface
         */
    stopDhclient() {
        exec('dhclient -r ' + this.ifName, function(err) {
            if (err) {
                console.log(err);
            } else {
                this.emit('ap_disconnected');
            }
        }.bind(this));
    }
}

module.exports = WpaCli;
