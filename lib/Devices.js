import Ambrosus from './Ambrosus';
import { EthereumError } from './Errors';
const DevicesJson = require('../build/contracts/Devices.json');

export default class Devices extends Ambrosus{
  constructor() {
    super();
    this.contract = new this.web3.eth.Contract(DevicesJson.abi);
  }

  async deploy(devices = [], options = {}) {
    let deployer = this.contract.deploy({
      data: DevicesJson.unlinked_binary,
      arguments: [devices]
    });
    let defaultOptions = {
      from: (await this.web3.eth.getAccounts())[0],
      gas: await deployer.estimateGas(),
    };
    this.contract = await deployer.send({ ...defaultOptions, ...options });
    return this;
  }

  async count() {
    return await this.contract.methods.count().call();
  }

  async getAll() {
    return await this.contract.methods.getAll().call();
  }

  async isValid(deviceAddress) {
    return await this.contract.methods.isOnList(deviceAddress).call();
  }

  async add(device, options) {
    let transaction = await this.contract.methods.add(device);
    let defaultOptions = {
      from: (await this.web3.eth.getAccounts())[0],
      gas: await transaction.estimateGas(),
    };
    try {
      await transaction.send({ ...defaultOptions, ...options });
    } catch (e) {
      throw new EthereumError(e);
    }
  }

  async remove(device, options) {
    let transaction = await this.contract.methods.remove(device);
    let defaultOptions = {
      from: (await this.web3.eth.getAccounts())[0],
      //gas: await transaction.estimateGas(),
    };
    try {
      await transaction.send({ ...defaultOptions, ...options });
    } catch (e) {
      throw new EthereumError(e);
    }
  }
}