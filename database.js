const {MongoClient} = require('mongodb');
const {URL} = require('./const');

const {log} = console;


class DataBase {
  _collection = null;
  _isSetupCollection = false;

  constructor(dataBase) {
    this._dataBase = dataBase;
    this._shouldSetupCollection();
    this.createIndex({name: 1});
    this.createIndex({sex: 1});
  }

  static _connect() {
    return MongoClient.connect(URL).then((client) => client.db('myApp')).
    catch((e) => {
      console.error('Failedto connect to MongoDB', e);
      process.exit();
    });
  }

  static createDataBase() {
    const db = (async () => await this._connect())();
    return new DataBase(db);
  }

  setupCollection() {
    const promise =  new Promise((resolve) => {
      const collection = (async () => (await this._dataBase).collection('users'))();
      resolve(collection);
    });
    this._collection = promise.then((collection) => collection);
    this._isSetupCollection = true;
    return this._collection;
  }

  _shouldSetupCollection() {
    if(!this.isSetupCollection) {
      this.setupCollection();
    }
  }

  async addData (name, dateOfBirth, sex) {
    (await this._collection).insertOne({name: name, dateOfBirth: new Date(dateOfBirth), sex: sex});
  }

  async addDataArraay (array) {
    (await this._collection).insertMany(array);
  }

  async createIndex(config) {
    return (await this._collection).createIndex(config);
  }

  getData () {
    const promise = (async () => (await this._collection).find())();
    promise.then((cursor) => cursor.toArray()).then((data) => log(data));
  }

  async getUniqueValues () {
    const promise = (async () => (await this._collection).aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          dateOfBirth: 1,
          sex: 1,
          sortData: {
            $concat: [
              '$name',
              {$substr: ['$dateOfBirth', 0, -1]},
            ]
          },
          ageDay: {
            $dateDiff: {
              startDate: '$dateOfBirth',
              endDate: new Date(),
              unit: 'day',
            },
          },
        },
      },
      {
        $group: {
          _id: '$sortData',
          users: {
            $first: {
              _id: '$_id',
              name: '$name',
              dateOfBirth: '$dateOfBirth',
              sex: '$sex',
              ageDay: '$ageDay'
            },
          },
        }
      },
      {
        $project: {
          _id: '$users._id',
          name: '$users.name',
          dateOfBirth: '$users.dateOfBirth',
          sex: '$users.sex',
          age: {
            $trunc: {
              $divide: ['$users.ageDay', 365],
            }
          }           
        },
      },
      {$sort: {'name': 1}},
    ]))();
    promise.then((cursor) => cursor.toArray()).then((data) => log(data));
  }

  async getFMale() {
    return (await this._collection).find({name: /^F\w+/i, sex: 'male'}).toArray();
  }

  async getRunTime() {
    const startTime = new Date();
    await this.getData();
    log(`time: ${(new Date() - startTime) / 1000}s`)
  }

}

module.exports = DataBase;
