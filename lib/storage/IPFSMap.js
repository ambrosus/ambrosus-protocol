import { Buffer } from 'safe-buffer';

export default class IPFSMap {

  constructor(_ipfs, _ipfsObject) {
    this.node = _ipfs;
    this.catalog = _ipfsObject;
  }

  async create() {
    this.catalog = await this.node.object.put({
      Data: Buffer.from(' '),
      Links: [],
    });
  }

  async createFromHash(_nodeHash) {
    this.catalog = await this.node.object.get(_nodeHash);
  }

  getOwnHash() {
    return this.catalog.toJSON().multihash;
  }

  getUniqueId(dag) {
    return Date.now() + dag.toJSON().multihash;
  }

  async add(content) {
    var newDAG = await this.node.object.put({
      Data: Buffer.from(content),
      Links: [],
    });
    this.catalog = await this.node.object.patch.addLink(this.catalog.multihash,
      {
        name: this.getUniqueId(newDAG),
        size: newDAG.toJSON().size,
        multihash: newDAG.toJSON().multihash,
      });
    return newDAG.toJSON().multihash;
  }

  keys() {
    return this.catalog.toJSON().links;
  }

  async values() {
    var data = [];
    var keys = await this.keys();
    for (var i = 0; i < keys.length; i++) {
      data.push((await this.node.object.data(keys[i].multihash)).toString());
    }
    return data;
  }
}