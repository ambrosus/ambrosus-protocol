import Devices from '../../lib/Devices';
import * as Errors from '../../lib/Errors';

contract('Devices Interface', (accounts) => {

  let devices;
  let ownerAddress = accounts[0];
  let deviceAddress = '0x378cbCC0928DCA7e0d0aAFd67D22CBf7cCbF3c92';
  let userAddress = '0xde89c7742f5205a509052d64f01d20b5f5b02b6b';
  let deviceAddresses = ['0x4682Ec05bf3A2508BC0165062e9c2fcC218d89ED', '0xdBaa14dEbfAB834D285a9d2E4Ad9a8b277A78736'];
  let defaultOptions = { from: ownerAddress };

  let deployDevices = async () => {
    devices = await new Devices().deploy(deviceAddresses, defaultOptions);
  };

  describe('Create empty list', () => {

    before(async () => {
      devices = await new Devices().deploy();
    });

    it('device count is zero', async () => {
      assert.equal(await devices.count(), 0);
    });

    it('device list is empty', async () => {
      assert.deepEqual(await devices.getAll(), []);
    });

    it('address is not on the list', async () => {
      assert.equal(await devices.isValid(deviceAddresses[0]), false);
    });

  });

  describe('Create initialized list', () => {

    before(async () => {
      await deployDevices();
    });

    it('get device count', async () => {
      assert.equal(await devices.count(), 2);
    });

    it('get device list', async () => {
      assert.deepEqual(await devices.getAll(), deviceAddresses);

    });

    it('checks if device is on list', async () => {
      assert.equal(await devices.isValid(deviceAddresses[0]), true);

    });

    it('check if device is not on the list', async () => {
      assert.equal(await devices.isValid(deviceAddress), false);
    });

  });

  describe('Adding device to a list', () => {

    beforeEach(async () => {
      await deployDevices();
    });

    it('add a device', async () => {
      await devices.add(deviceAddress, defaultOptions);
      assert.deepEqual(await devices.getAll(), [...deviceAddresses, deviceAddress]);
    });

    it('throws if adding from non-owner address', async () => {
      try {
        await devices.add(deviceAddress, { from: userAddress });
        assert.fail("Should throw EthereumError");
      } catch (e) {
        assert(e instanceof Errors.EthereumError);
      }
    });

    it('added device is valid', async () => {
      await devices.add(deviceAddress, defaultOptions);
      assert.equal(await devices.isValid(deviceAddress), true);
    });

  });

  describe('Removing device from a list', () => {

    beforeEach(async () => {
      await deployDevices();
    });

    it('remove device', async () => {
      await devices.remove(deviceAddresses[0], defaultOptions);
      assert.deepEqual(await devices.getAll(), [deviceAddresses[1]]);
    });

    it('removed device isn\'t valid', async () => {
      await devices.remove(deviceAddresses[0], defaultOptions);
      assert.equal(await devices.isValid(deviceAddress), false);
    });

    it('throws error when unauthorised remove of a device', async () => {
      try {
        await devices.remove(deviceAddresses[0], { from: userAddress });
        assert.fail("Should throw EthereumError");
      } catch (e) {
        assert(e instanceof Errors.EthereumError);
      }
    });

    it('can\'t remove non-existent device', async () => {
      try {
        await devices.remove(deviceAddress, defaultOptions);
        assert.fail("Should throw EthereumError");
      } catch (e) {
        assert(e instanceof Errors.EthereumError);
      }
    });

  });

  describe('Failing when no web3', () => {

    let oldWeb3;

    before(() => {
      oldWeb3 = web3;
    });

    it('no web3 when creating contract', async () => {
      web3 = undefined;
      assert.throws(()=>new Devices(), Errors.Web3NotFoundError);
    });

    after(() => {
      web3 = oldWeb3;
    });

  });

});
