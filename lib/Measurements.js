import Ambrosus from './Ambrosus';
import Configuration from './conf/Configuration';
import { EthereumError } from './Errors';
import IPFSMap from './storage/IPFSMap';

const MeasurementsJson = require('../build/contracts/Measurements.json');

export default class Measurements extends Ambrosus {

  constructor(ipfs) {
    super();
    this.ipfsMap = new IPFSMap(ipfs);
    this.contract = new this.web3.eth.Contract(MeasurementsJson.abi);
  }

  async deploy(deviceAddress, options = {}) {
    await this.ipfsMap.create();
    return this.contract.deploy({
      data: MeasurementsJson.unlinked_binary,
      arguments: [this.web3.utils.fromAscii(this.ipfsMap.getOwnHash()), deviceAddress],
    })
      .send(await Configuration.getTransactionOptions(options))
      .then(contract => {
        this.contract = contract;
        return this;
      })
      .catch(e => { throw new EthereumError(e); });
  }

  async at(address) {
    super.at(address);
    let ipfsHash = await this.contract.methods.ipfsHash().call();
    await this.ipfsMap.createFromHash(ipfsHash);
    return this;
  }

  async report(measurement, options = {}) {
    let result = await this.contract.methods.validate(measurement.device).call();
    if (!result) throw new EthereumError(`${measurement} can't is not valid`);
    let newHash = await this.ipfsMap.add(JSON.stringify(measurement));
    return this.contract.methods.setIpfsHash(this.web3.utils.fromAscii(newHash))
      .send(await Configuration.getTransactionOptions(options))
      .catch(e => { throw new EthereumError(e); });

  }

  async count() {
    return (await this.ipfsMap.keys()).length;
  }

  async getAll() {
    return (await this.ipfsMap.values()).map(JSON.parse);
  }

  async getById(id) {
    return (await this.getAll()).filter(measurement => measurement.id.toLowerCase() === id)[0];
  }

}