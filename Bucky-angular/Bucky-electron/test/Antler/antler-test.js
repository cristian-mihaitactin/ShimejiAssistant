const test = require('ava')
const electronPath = require('electron')
const { TestDriver } = require('../testDriver')

const app = new TestDriver({
  path: electronPath,
  args: ['.'],
  env: {
    NODE_ENV: 'test'
  }
})
test.before(async t => {
  await app.isReady
})
test.after.always('cleanup', async t => {
  await app.stop()
})


test('foo', t => {
    console.log('in foo')
	t.pass();
});

test('bar', async t => {
    console.log('in bar')
	const bar = Promise.resolve('bar');
	t.is(await bar, 'bar');
});