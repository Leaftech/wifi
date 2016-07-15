<a name="Wpa-wifi"></a>

## Wpa-wifi
WpaCli to control wpa_supplicant

This only works on linux, tested on ubuntu 14.4 and debian jesse.
you need to have wpa_supplicant installed , run using sudo and running  with wpa_spplicant having config : **ctrl_interface=/var/run/wpa_supplicant**  

**Reference:**
http://w1.fi/wpa_supplicant/devel/ctrl_iface_page.html

**Example**


	  'use strict';
	  const WpaCli = require('wpa-wifi');
	  var wpa = new WpaCli('wlan0');
	  wpa.on('ready', function() {
	      console.log('ready');
	      wpa.listNetworks();
	      wpa.addNetwork();
	      wpa.setSSID(0, 'ssid');
	      wpa.setPassword(0, 'password');
	      wpa.enableNetwork(0);
	      wpa.selectNetwork(0);
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




<a name="WpaCli"></a>

**API Documention:**
<a name="WpaCli"></a>

## WpaCli
WpaCli to control wpa_supplicant

**Kind**: global class  

* [WpaCli](#WpaCli)
    * [new WpaCli(ifName)](#new_WpaCli_new)
    * [.connect()](#WpaCli+connect)
    * [._onConnect()](#WpaCli+_onConnect)
    * [._onMessage(msg)](#WpaCli+_onMessage)
    * [._onCtrlEvent(msg)](#WpaCli+_onCtrlEvent)
    * [._onError(err)](#WpaCli+_onError)
    * [._onCongestion(err)](#WpaCli+_onCongestion)
    * [._onListening()](#WpaCli+_onListening)
    * [.sendCmd(msg)](#WpaCli+sendCmd)
    * [.scan()](#WpaCli+scan)
    * [.scanResults()](#WpaCli+scanResults)
    * [._onScanResult(msg)](#WpaCli+_onScanResult)
    * [._onRawMsg(msg)](#WpaCli+_onRawMsg)
    * [._onListNetwork(msg)](#WpaCli+_onListNetwork)
    * [.addNetwork()](#WpaCli+addNetwork)
    * [.listNetworks()](#WpaCli+listNetworks)
    * [.status()](#WpaCli+status)
    * [._onStatus(msg)](#WpaCli+_onStatus)
    * [.setSSID(networkId, add)](#WpaCli+setSSID)
    * [.setPassword(networkId, password)](#WpaCli+setPassword)
    * [.enableNetwork(networkId)](#WpaCli+enableNetwork)
    * [.selectNetwork(networkId)](#WpaCli+selectNetwork)
    * [._onApConnected()](#WpaCli+_onApConnected)
    * [._onApDisconnected()](#WpaCli+_onApDisconnected)
    * [.startDhclient()](#WpaCli+startDhclient)
    * [.stopDhclient()](#WpaCli+stopDhclient)
    * [.disconnectAP()](#WpaCli+disconnectAP)

<a name="new_WpaCli_new"></a>

### new WpaCli(ifName)
constructs WpaCli


| Param | Type | Description |
| --- | --- | --- |
| ifName | <code>String</code> | interface name eg. wlan0 |

<a name="WpaCli+connect"></a>

### wpaCli.connect()
connect to wpa control interface

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
<a name="WpaCli+_onConnect"></a>

### wpaCli._onConnect()
connect event handler

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
<a name="WpaCli+_onMessage"></a>

### wpaCli._onMessage(msg)
message event handler

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Buffer</code> | message recieved from wpa_ctrl |

<a name="WpaCli+_onCtrlEvent"></a>

### wpaCli._onCtrlEvent(msg)
control event handler

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | control event messages |

<a name="WpaCli+_onError"></a>

### wpaCli._onError(err)
error event handler

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>String</code> | error message |

<a name="WpaCli+_onCongestion"></a>

### wpaCli._onCongestion(err)
congestion event handler

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>String</code> | congestion error message |

<a name="WpaCli+_onListening"></a>

### wpaCli._onListening()
listening event handler

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
<a name="WpaCli+sendCmd"></a>

### wpaCli.sendCmd(msg)
send request to wpa_cli

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | wpa_cli commands |

<a name="WpaCli+scan"></a>

### wpaCli.scan()
scan for wifi AP

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
<a name="WpaCli+scanResults"></a>

### wpaCli.scanResults()
request for wifi scan results

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
<a name="WpaCli+_onScanResult"></a>

### wpaCli._onScanResult(msg)
scan results handler

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | scan results message |

<a name="WpaCli+_onRawMsg"></a>

### wpaCli._onRawMsg(msg)
raw message handler from wpa_cli, captures all messages by default for debuging purposes

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | wpa messages |

<a name="WpaCli+_onListNetwork"></a>

### wpaCli._onListNetwork(msg)
list network handler, list all configured networks or devices

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | network or devices list |

<a name="WpaCli+addNetwork"></a>

### wpaCli.addNetwork()
add new network

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
<a name="WpaCli+listNetworks"></a>

### wpaCli.listNetworks()
request to list networks

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
<a name="WpaCli+status"></a>

### wpaCli.status()
request for status

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
<a name="WpaCli+_onStatus"></a>

### wpaCli._onStatus(msg)
status handler, parses status messages and emits status event

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | status message |

<a name="WpaCli+setSSID"></a>

### wpaCli.setSSID(networkId, add)
set network ssid

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| networkId | <code>String</code> | network id recieved from list networks |
| add | <code>String</code> | ssid to network |

<a name="WpaCli+setPassword"></a>

### wpaCli.setPassword(networkId, password)
set network password

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| networkId | <code>String</code> | networkId network id recieved from list networks |
| password | <code>String</code> | add ssid to network |

<a name="WpaCli+enableNetwork"></a>

### wpaCli.enableNetwork(networkId)
enable configured network

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| networkId | <code>string</code> | networkId network id recieved from list networks |

<a name="WpaCli+selectNetwork"></a>

### wpaCli.selectNetwork(networkId)
select network to connect

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| networkId | <code>String</code> | networkId network id recieved from list networks |

<a name="WpaCli+_onApConnected"></a>

### wpaCli._onApConnected()
AP connected event handler

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
<a name="WpaCli+_onApDisconnected"></a>

### wpaCli._onApDisconnected()
AP disconnect event handler

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
<a name="WpaCli+startDhclient"></a>

### wpaCli.startDhclient()
start dhclient for interface

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
<a name="WpaCli+stopDhclient"></a>

### wpaCli.stopDhclient()
stop dhclient for interface

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
<a name="WpaCli+disconnectAP"></a>

### wpaCli.disconnectAP()
disconnect from AP

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
