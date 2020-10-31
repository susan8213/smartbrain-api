const { User, UserSecret } = require("../models/users");
const bcrypt = require("bcrypt-nodejs");

exports.getUserList = async (req, res) => {
  try {
    const users = await User.getAll();
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.getById(id);
    if (!user.length) {
      return res.status(400).send();
    }
    return res.json(user[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
};

exports.signUp = async (req, res) => {
  const { email, name, password } = req.body;
  //TODO: validation

  const user = new User(name, email);
  const userSecret = new UserSecret(email, bcrypt.hashSync(password));
  try {
    const result = await User.create(user, userSecret);
    return res.json(result[0]);
  } catch (err) {
    const msg = err.message;
    if (msg.includes("duplicate key value")) {
      return res.status(400).send("Duplicate user.");
    }
    console.log(err);
    return res.status(500).send(msg);
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const secret = await UserSecret.getByEmail(email);
    const user = await User.getByEmail(email);
    if (!(secret && bcrypt.compareSync(password, secret[0].hash))) {
      return res.status(400).send("Email or Password is incorrect.");
    }
    return res.json(user[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
};

exports.entry = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await User.incrementById(id, { entries: 1 });
    if (!result.length) {
      return res.status(400).send();
    }
    return res.json(result[0].entries);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
};
