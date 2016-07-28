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
    * [.peerFind()](#WpaCli+peerFind)
    * [.peerList()](#WpaCli+peerList)
    * [.peerStopFind()](#WpaCli+peerStopFind)
    * [.peerInfo(peerAddress)](#WpaCli+peerInfo)
    * [.peerConnectPBC(peerAddress, isOwner)](#WpaCli+peerConnectPBC)
    * [.peerConnectPIN(peerAddress, pin, isOwner)](#WpaCli+peerConnectPIN)
    * [._onNewPeerFound(msg)](#WpaCli+_onNewPeerFound)
    * [._onPeerDisconnect(msg)](#WpaCli+_onPeerDisconnect)
    * [._onPeerInfo(msg)](#WpaCli+_onPeerInfo)
    * [.listInterfaces(callback)](#WpaCli+listInterfaces)
    * [._onPeerConnected()](#WpaCli+_onPeerConnected)

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
<a name="WpaCli+peerFind"></a>

### wpaCli.peerFind()
search for peers

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
<a name="WpaCli+peerList"></a>

### wpaCli.peerList()
list avaliable peers

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
<a name="WpaCli+peerStopFind"></a>

### wpaCli.peerStopFind()
stop peer search

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
<a name="WpaCli+peerInfo"></a>

### wpaCli.peerInfo(peerAddress)
fetch Peer Information

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| peerAddress | <code>String</code> | peer device address |

<a name="WpaCli+peerConnectPBC"></a>

### wpaCli.peerConnectPBC(peerAddress, isOwner)
connect to peer with PBC(Push Button Control) authentication mechanism

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| peerAddress | <code>String</code> | Mac Address of peer |
| isOwner | <code>Boolean</code> | Your role, are you group owner? if yes then true else false |

<a name="WpaCli+peerConnectPIN"></a>

### wpaCli.peerConnectPIN(peerAddress, pin, isOwner)
connect to peer with PIN(password) authentication mechanism

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| peerAddress | <code>String</code> | Mac Address of peer |
| pin | <code>String</code> | password for authentication |
| isOwner | <code>Boolean</code> | Your role, are you group owner? if yes then true else false |

<a name="WpaCli+_onNewPeerFound"></a>

### wpaCli._onNewPeerFound(msg)
new peer event handler

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | event message |

<a name="WpaCli+_onPeerDisconnect"></a>

### wpaCli._onPeerDisconnect(msg)
peer disconnection event handler

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | event message |

<a name="WpaCli+_onPeerInfo"></a>

### wpaCli._onPeerInfo(msg)
peer info event handler

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | event message |

<a name="WpaCli+listInterfaces"></a>

### wpaCli.listInterfaces(callback)
list network interfaces on system

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | callback with list of interface |

<a name="WpaCli+_onPeerConnected"></a>

### wpaCli._onPeerConnected()
peer connected handler

**Kind**: instance method of <code>[WpaCli](#WpaCli)</code>  
