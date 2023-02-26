const DataBase = require('./database');
const createUsers = require('./utils');
const {Names, Surname, Sex} = require('./const');

const arg = process.argv.slice(2);
const {log} = console;

const dataBase = DataBase.createDataBase();

switch(arg[0]) {
  case '1':
    dataBase.setupCollection();
    break;

  case '2':
    dataBase.addData(arg[1], arg[2], arg[3]);
    break;

  case '3':
    dataBase.getUniqueValues();
  break;

  case '4':
    dataBase.addDataArraay(createUsers(1000000, Names, Surname, Sex));
    dataBase.addDataArraay(createUsers(100, {F: 'Frad'}, Surname, Sex, true));
  break;

  case '5':
    dataBase.getRunTime();
    break;
    
  default: 
    log('should add an argument');
}

