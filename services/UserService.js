const users = require("../models/users");
const bcrypt = require("bcrypt-nodejs");

class UserService {
  constructor() {}

  getUserList() {
    return users;
  }

  getUserByID(id) {
    return users.find(user => user.id == id);
  }

  getUserByEmail(email) {
    return users.find(user => user.email === email);
  }

  signIn(data) {
    const { email, password } = data;
    const user = this.getUserByEmail(email);
    if (user) {
      if (bcrypt.compareSync(password, user.hash)) {
        return user;
      }
    }
    return;
  }

  signUp(data) {
    const { email, name, password } = data;
    if (this.getUserByEmail(email)) {
      return;
    }

    const user = {
      id: users[users.length - 1].id + 1,
      name: name,
      email: email,
      hash: bcrypt.hashSync(password),
      entries: 0,
      joined: new Date()
    };
    users.push(user);
    return user;
  }

  entry(id) {
    for (let user of users) {
      if (user.id == id) {
        user.entries++;
        return user;
      }
    }
  }
}

const UserSerializer = (obj, many = false) => {
  if (many) {
    const users = obj.map(user => UserSerializer(user));
    return users;
  } else {
    const { hash, ...user } = obj;
    return user;
  }
};

module.exports.UserService = UserService;
module.exports.UserSerializer = UserSerializer;
