pragma solidity ^0.4.23;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';


contract Devices is Ownable {
  function Devices(address[] _devices){
    devices = _devices;
  }

  event DeviceAdded(address device);

  event DeviceRemoved(address device);

  address [] devices;

  function add(address _device) onlyOwner {
    require(!isOnList(_device));
    devices.push(_device);
    DeviceAdded(_device);
  }

  function remove(address _device) onlyOwner {
    require(isOnList(_device));
    for (uint i = 0; i < devices.length; i++) {
      if (devices[i] == _device) {
        devices[i] = devices[devices.length - 1];
        devices.length--;
        DeviceRemoved(_device);
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

  function isOnList(address _device) constant returns (bool) {
    for (uint i = 0; i < devices.length; i++) {
      if (devices[i] == _device) {
        return true;
      }
    }
    return false;
  }
}
