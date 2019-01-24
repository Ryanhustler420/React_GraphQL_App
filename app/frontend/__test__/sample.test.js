// https://jestjs.io/docs/en/api
// # Globals

describe ('sample test 101', () => {
  // test() as same as it()
  it ('works as expected', () => {
    expect (1).toEqual (1);
  });

  it ('handles ranges just fine', () => {
    const age = 200;
    expect (age).toBeGreaterThan (100);
  });

  it ('makes a list of dogs names', () => {
    const dogs = ['snickers', 'hugo'];
    expect (dogs).toEqual (dogs);
    expect (dogs).toContain ('snickers');
  });
});
