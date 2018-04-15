const VK = require('vk-io')

const vk = new VK();

vk.setToken('f855542bea5f3adc8819a2a8c868c0e5bca07b2c08e53041c27c9dbc94ba8656d01711e14f8e60d1ca5cd');

vk.on('message', (message) => {
  console.log(message);
})

run().catch(console.log); // async/await "sugar"
