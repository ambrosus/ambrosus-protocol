import Requirements from '../../lib/Requirements';

contract('Requirements Interface', (accounts) => {

  let requirement;
  let attributes = {
    Temperature: 12,
    Calories: 3000
  };


  xdescribe('Validating measurements', () => {

    before(async () => {
      requirement = await new Requirements().deploy(attributes);
    });

    it('validate single measurement', async () => {

    });

    it('not validate measurement with wrong value', async () => {

    });

    it('not validate measurement from unregistered device', async () => {

    });

    it('not validate measurement if can\'t prove it is real', async () => {

    });

    it('validate list of measurements', async () => {

    });

  });

  xdescribe('Modifying requirements', () => {

    it('add attribute', async () => {

    });

    it('remove attribute', async () => {

    });

    it('can\'t modify when not authorised', async () => {

    });
  });
});