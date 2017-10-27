import ipfsAPI from 'ipfs-api';
import Measurements from '../../lib/Measurements';
import { assertThrowsEventually } from '../test_utils/utils';
import { EthereumError } from '../../lib/Errors';
import Devices from '../../lib/Devices';

contract('Measurements Interface', (accounts) => {

  let measurements;
  let ownerAddress = accounts[0];
  let authorizedDevices = [accounts[1], accounts[2]];
  let unauthorizedDevice = accounts[3];
  let defaultOptions = { from: ownerAddress };
  //IPFS client instance
  let ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002');

  let testMeasurement = {
    id: 'Temperature',
    value: 10,
    description: {
      unit: 'Celsius',
      error: '10%',
    },
    timestamp: 154234123213,
    farmerId: 'John Farmer',
    batchId: 'batch000000000001',
    device: authorizedDevices[0],
  };

  let testMeasurement2 = {
    id: 'Pressure',
    value: 35,
    description: {
      unit: 'psi',
    },
    timestamp: 164234123213,
    farmerId: 'John Farmer',
    batchId: 'batch000000000001',
    device: authorizedDevices[1],

  };

  let deploy = async () => {
    let devices = (await new Devices().deploy(authorizedDevices, defaultOptions)).address;
    measurements = await new Measurements(ipfs).deploy(devices, defaultOptions);
  };

  describe('Reporting', () => {

    before(async () => {
      await deploy();
    });

    it('report one measurement', async () => {
      await measurements.report(testMeasurement, { from: authorizedDevices[0] });
      assert.equal(await measurements.count(), 1);
    });

    it('fails to report from unauthorized device', async () => {
      await assertThrowsEventually(
        async () => await measurements.report({ ...testMeasurement, device: unauthorizedDevice },
          { from: unauthorizedDevice }),
        EthereumError);
    });

  });

  describe('Retrieving', () => {
    before(async () => {
      await deploy();
      await measurements.report(testMeasurement);
      await measurements.report(testMeasurement2);
    });

    it('get by id', async () => {
      assert.deepEqual(await measurements.getById("temperature"), testMeasurement);
    });

    it('get all', async () => {
      assert.deepEqual(await measurements.getAll(), [testMeasurement, testMeasurement2]);
    });

  });

  xdescribe('Merging', () => {

  });

  xdescribe('Splitting', () => {

  });

});