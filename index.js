'use strict';
const unix = require('unix-dgram');
const EventEmitter = require('events').EventEmitter;
const exec = require('child_process').exec;
/*
    WPA_CLI commands
 */
const WPA_CMD = {
    listInterfaces: 'ifconfig',
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
    selectNetwork: 'SELECT_NETWORK :id',
    disconnectAP: 'DISCONNECT',
    peerSearch: 'P2P_FIND',
    peerStopSearch: 'P2P_STOP_FIND',
    peerConnect: 'P2P_CONNECT :peer_addr :auth_type :pin :owner_params',
    peerInfo: 'P2P_PEER :peer_addr',
    peerInvite: 'P2P_INVITE',
    removeVirtIface: 'P2P_GROUP_REMOVE :iface',
    flushPeers: 'P2P_FLUSH'
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
                case /\w{2}\:\w{2}\:\w{2}\:\w{2}\:\w{2}\:\w{2}\npri_dev_type\=\w/.test(msg):
                    this._onPeerInfo(msg);
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
                case /P2P-DEVICE-FOUND/.test(msg):
                    this._onNewPeerFound(msg);
                    break;
                case /P2P-DEVICE-LOST/.test(msg):
                    this._onPeerDisconnect(msg);
                    break;
                case /P2P-GROUP-STARTED/.test(msg):
                    this._onPeerConnected(msg);
                    break;
                case /P2P-INVITATION-RECEIVED/.test(msg):
                    this._onPeerInvitation(msg);
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
            exec('sudo dhclient ' + this.ifName, function(err) {
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
            exec('sudo dhclient -r ' + this.ifName, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    this.emit('ap_disconnected');
                }
            }.bind(this));
        }
        /**
         * disconnect from AP
         */
    disconnectAP() {
            this.sendCmd(WPA_CMD.disconnectAP);
        }
        /**
         * search for peers
         */
    peerFind() {
            this.sendCmd(WPA_CMD.peerSearch);
        }
        /**
         * list avaliable peers
         */
    peerList() {
            this.sendCmd(WPA_CMD.peerList);
        }
        /**
         * stop peer search
         */
    peerStopFind() {
            this.sendCmd(WPA_CMD.peerStopFind);
        }
        /**
         * fetch Peer Information
         * @param  {String} peerAddress peer device address
         */
    peerInfo(peerAddress) {
            var cmd = WPA_CMD.peerInfo.replace(':peer_addr', peerAddress);
            this.sendCmd(cmd);
        }
        /**
         * connect to peer with PBC(Push Button Control) authentication mechanism
         * @param  {String}  peerAddress Mac Address of peer
         * @param  {Boolean} isOwner     Your role, are you group owner? if yes then true else false
         */
    peerConnectPBC(peerAddress, isOwner) {
            var cmd = WPA_CMD.peerConnect.replace(':peer_addr', peerAddress);
            cmd = cmd.replace(':auth_type', 'pbc').replace(':pin', '');
            cmd = cmd.replace(':owner_params', (isOwner) ? 'auth go_intent=7' : '');
            this.sendCmd(cmd);
            console.log('connection cmd sent');
        }
        /**
         * connect to peer with PIN(password) authentication mechanism
         * @param  {String}  peerAddress Mac Address of peer
         * @param  {String}  pin         password for authentication
         * @param  {Boolean} isOwner     Your role, are you group owner? if yes then true else false
         */
    peerConnectPIN(peerAddress, pin, isOwner) {
            var cmd = WPA_CMD.peerConnect.replace(':peer_addr', peerAddress);
            cmd = cmd.replace(':auth_type', 'pin').replace(':pin', pin);
            cmd = cmd.replace(':owner_params', (isOwner) ? ' auth go_intent=7 ' : '');
            this.sendCmd(WPA_CMD.peerConnect);
        }
        /**
         * new peer event handler
         * @param  {String} msg event message
         */
    _onNewPeerFound(msg) {
            var deviceAddressExp = /p2p_dev_addr\=(\w{2}:\w{2}:\w{2}:\w{2}:\w{2}:\w{2})/g;
            var deviceNameExp = /name\=\'(.*)\'/g;
            var deviceName = deviceNameExp.exec(msg)[1];
            var deviceAddress = deviceAddressExp.exec(msg)[1];
            this.emit('peer_found', {
                deviceAddress: deviceAddress,
                deviceName: deviceName
            });
        }
        /**
         * peer disconnection event handler
         * @param  {String} msg event message
         */
    _onPeerDisconnect(msg) {
            var deviceAddressExp = /p2p_dev_addr\=(\w{2}:\w{2}:\w{2}:\w{2}:\w{2}:\w{2})/g;
            var deviceAddress = deviceAddressExp.exec(msg)[1];
            this.emit('peer_disconnected', {
                deviceAddress: deviceAddress
            });
        }
        /**
         * peer info event handler
         * @param  {String} msg event message
         */
    _onPeerInfo(msg) {
            msg = msg.split('\n');
            var deviceAddressExp = /\w{2}:\w{2}:\w{2}:\w{2}:\w{2}:\w{2}/;
            var status = {};
            msg.forEach(function(line) {
                var deviceAddress = deviceAddressExp.exec(line);
                if (line.length > 3 && !deviceAddress) {
                    line = line.split('=');
                    status[line[0]] = line[1];
                } else if (line.length) {
                    status.address = deviceAddress[0];
                }
            });
            this.emit('peer_info', status);
        }
        /**
         * list network interfaces on system
         * @param  {Function} callback callback with list of interface
         */
    listInterfaces(callback) {
            exec(WPA_CMD.listInterfaces, function(err, stdin) {
                var interfaceInfo = {};
                if (err) {} else {
                    var output = stdin.split(/\n/);
                    var currentInterface;
                    const PATTERNS = {
                        interface: /^\w{1,20}/g,
                        macAddr: /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/,
                        ipaddress: /inet\saddr\:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/,
                        bcastAddr: /Bcast\:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/
                    };
                    output.forEach(function(line) {
                        switch (true) {
                            case PATTERNS.interface.test(line):
                                currentInterface = /(^\w{1,20}\-\w{1,20}\-\w{1,20}|^\w{1,20})/g.exec(line)[1];
                                interfaceInfo[currentInterface] = {};
                                interfaceInfo[currentInterface].hwAddr = (PATTERNS.macAddr.test(line)) ? PATTERNS.macAddr.exec(line)[0] : '';
                                break;
                            case PATTERNS.ipaddress.test(line):
                                interfaceInfo[currentInterface].ipaddress = (PATTERNS.ipaddress.exec(line)) ? PATTERNS.ipaddress.exec(line)[1] : '';
                                interfaceInfo[currentInterface].broadcastAddress = (PATTERNS.bcastAddr.exec(line)) ? PATTERNS.bcastAddr.exec(line)[1] : '';
                                break;
                            default:
                        }
                    });
                }
                callback(interfaceInfo);
            });
        }
        /**
         * peer connected handler
         *
         */
    _onPeerConnected(msg) {
            var peerInterface = /P2P-GROUP-STARTED (p2p\-\p2p\d{1,2}\-\d{1,2})/.exec(msg)[1];
            this.emit('peer_connected', peerInterface);
        }
        /**
         * handle peer invitation event
         * @param  {String} msg message 
         */
    _onPeerInvitation(msg) {
            var peerAddress = /bssid=(\w{1,2}\:\w{1,2}\:\w{1,2}\:\w{1,2}\:\w{1,2}\:\w{1,2})/.exec(msg)[1];
            this.emit('peer_invitation_recieved', peerAddress);
        }
        /**
         * Remove virtual interface eg: p2p-p2p0-1
         * @param  {String}   iFaceName interface name
         * @param  {Function} callback  callback function
         */
    removeVitualInterface(iFaceName, callback) {
            var cmd = WPA_CMD.removeVirtIface.replace(':iface', iFaceName);
            this.sendCmd(cmd);
            callback();
        }
        /**
         * Flush peer data
         */
    flushPeers() {
        var cmd = WPA_CMD.flushPeers;
        this.sendCmd(cmd);
    }
}

module.exports = WpaCli;
