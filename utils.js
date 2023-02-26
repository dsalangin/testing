const randomInteger = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

const createUser = (name, dateOfBirth, sex) => {
  const user = {
    name,
    dateOfBirth,
    sex,
  }
  return user;
}

const createUsers = (amount, names, surname, sexObj, isMale = false) => {
  const users = [];
  let count = 0;

  const letters = Object.keys(names);
  const namseNumber = amount / letters.length;

  letters.forEach((letter) => {
    for(let i = 0; i < namseNumber; i++) {

      const name = `${names[letter]} ${surname[randomInteger(0, surname.length)]}`;
      const dateOfBirth = new Date(randomInteger(0, new Date().getTime()));
      const sex = isMale ? sexObj.MALE : (i % 2) ? sexObj.MALE : sexObj.FEMALE;

      const user = createUser(name, dateOfBirth, sex);
      users.push(user);

      count++;
      if(count >= amount) {
        break;
      }
    }
  })
  return users;
}

module.exports = createUsers;
