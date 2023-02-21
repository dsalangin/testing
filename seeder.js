const { Seeder } = require('mongo-seeding');

const config = {
  database: 'mongodb://0.0.0.0:27017/myApp',
  dropDatabase: true,
};

module.exports = new Seeder(config);

seeder
  .import(collections)
  .then(() => {
    console.log('Databsae seeded');
  })
  .catch(err => {
    console.log(err);
  });