pragma solidity ^0.4.15;


import 'zeppelin-solidity/contracts/ownership/Ownable.sol';


contract Devices is Ownable {
  function Devices(address[] deviceList){
    devices = deviceList;
  }

  event DeviceAdded(address device);

  event DeviceRemoved(address device);

  address [] devices;

  function add(address device) onlyOwner {
    require(!isOnList(device));
    devices.push(device);
    DeviceAdded(device);
  }

  function remove(address device) onlyOwner {
    require(isOnList(device));
    for (uint i = 0; i < devices.length; i++) {
      if (devices[i] == device) {
        delete devices[i];
        devices[i] = devices[devices.length - 1];
        devices.length--;
        DeviceRemoved(device);
        return;
      }
    }
  }

  function count() constant returns (uint) {
    return devices.length;
  }

  function getAll() constant returns (address[]) {
    return devices;
  }

  function isOnList(address device) constant returns (bool) {
    for (uint i = 0; i < devices.length; i++) {
      if (devices[i] == device) {
        return true;
      }
    }
    return false;
  }
}
