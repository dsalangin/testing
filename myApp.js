const db = require('./connector');
const seeder = require('./seeder');
const arg = process.argv.slice(2);
const {log} = console;

const setupCollection = async () => {
  const dBase = await db;
  const collection = dBase.collection('users');
  return collection;
};


class DataBase {
  constructor (collection) {
    this.collection = collection;
  }

  async createIndex (config) {
    return (await this.collection).createIndex(config);
  }

  async addData (name, dateOfBirth, sex) {
    return (await this.collection).insertOne({name: name, dateOfBirth: dateOfBirth, sex: sex});
  }

  async getData () {
    return (await this.collection).find();
  }

  async getUniqueValues () {
    log('getUniqueValues');
    return (await this.collection).aggregate([
      // {$match: {}},
      {$project: {
          _id: 1,
          name: 1,
          dateOfBirth: 1,
          sex: 1,
          sortData: {$concat: ['$name', '$dateOfBirth']},
          letter: {
            $substr: ['$name', 0, 1], 
          },
          // age: {}
        },
      },
      {$group: {
        _id: '$sortData',
        users: {
          $push: {
            name: '$name',
            dateOfBirth: '$dateOfBirth',
            sex: '$sex'
          },
        },
      }},
      {$sort: {'letter': 1}}
    ]);
  }

  async getFMale() {
    return (await this.collection).find({name:/^F\w+/i});
  }

}


  
let dataBase = null;

if(arg[0] != 1 && arg[0] != undefined) {
  dataBase = new DataBase(setupCollection().catch(() => console.error('Failed to setup user collection')));
}

switch(arg[0]) {
  case '1':
    dataBase = new DataBase(setupCollection().catch(() => console.error('Failed to setup user collection')));
    break;

  case '2':
    if(arg.length != 4 ) {
      return log('invalid input format');
    }

    dataBase.addData(arg[1], arg[2], arg[3]).
      then(() => process.exit());
    break;

  case '3':
    dataBase.getUniqueValues().then((cursor) => (cursor).toArray()).
      then((res) => JSON.stringify(res)).
      then((data) => log('data', data)).
      then(() => process.exit());
  break;

  case '4':
    log('method not implemented');
    process.exit();
  // break;

  case '5':
    dataBase.getFMale().then((cursor) => cursor.toArray()).then((arr) => log(arr)).
      then(() =>  process.exit());
  // break;
    
  default: 
    log('should add an argument');
}

