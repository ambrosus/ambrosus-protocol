pragma solidity ^0.4.23;

import "./Devices.sol";

contract Measurements {
  function Measurements(bytes _ipfsHash, Devices _devices){
    ipfsHash = _ipfsHash;
    devices = _devices;
  }

  event HashChanged(bytes indexed newHash, address indexed device);

  bytes public ipfsHash;
  Devices public devices;

  function setIpfsHash(bytes _ipfsHash) {
    require(devices.isOnList(msg.sender));
    ipfsHash = _ipfsHash;
    HashChanged(_ipfsHash, msg.sender);
  }

  function validate(address _device) constant returns (bool){
    return devices.isOnList(_device);
  }
}
