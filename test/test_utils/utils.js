export const assertThrowsEventually = async (action, errType) => {
  try {
    await action();
    assert.fail();
  } catch (e) {
    assert(e instanceof errType, `Should throw ${errType.name}`);
  }
};