pragma solidity ^0.4.15;
import "./Devices.sol";

contract Measurements {
  function Measurements(bytes _ipfsHash, Devices _devices){
    ipfsHash = _ipfsHash;
    devices = _devices;
  }

  bytes public ipfsHash;
  Devices public devices;

  function setIpfsHash(bytes _ipfsHash) {
    ipfsHash = _ipfsHash;
  }

  function validate(address _device) constant returns (bool){
    return devices.isOnList(_device);
  }
}
