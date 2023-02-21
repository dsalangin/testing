const {MongoClient} = require('mongodb');

const url = 'mongodb://0.0.0.0:27017';

module.exports = MongoClient.connect(url).then((client) => client.db('myApp')).
  catch((e) => {
    console.error('Failedto connect to MongoDB', e);
    process.exit();
  });