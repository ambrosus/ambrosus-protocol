import Devices from '../../lib/Devices';
import { EthereumError } from '../../lib/Errors';
import { assertThrowsEventually } from '../test_utils/utils';

contract('Devices Interface', (accounts) => {

  let devices;
  let ownerAddress = accounts[0];
  let deviceAddress = accounts[1];
  let userAddress = accounts[2];
  let deviceAddresses = [accounts[3], accounts[4]];
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
      await assertThrowsEventually(
        async () => await devices.add(deviceAddress, { from: userAddress }), EthereumError);
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
      await assertThrowsEventually(
        async () => await devices.remove(deviceAddresses[0], { from: userAddress }), EthereumError);
    });

    it('can\'t remove non-existent device', async () => {
      await assertThrowsEventually(
        async () => await devices.remove(deviceAddress, defaultOptions), EthereumError);
    });

  });

});
