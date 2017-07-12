const describe = require('mocha').require;
const it = require('mocha').it;
const assert = require('assert');
const mod = require('../../src/mod');

describe('mod', () => {
  it('should have correct value', () => {
    assert.equal(mod.value, 2000, 'mod.value is 1000');
  });
});
