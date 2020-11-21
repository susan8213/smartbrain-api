const client = require("./dbClient");

const User = function(
  name,
  email,
  entries = 0,
  joined = new Date().toUTCString()
) {
  this.name = name;
  this.email = email;
  this.entries = entries;
  this.joined = joined;
};

User.getAll = () => {
  return client("user").select();
};

User.getById = id => {
  return client("user")
    .select()
    .where({ id });
};

User.getByEmail = email => {
  return client("user")
    .select()
    .where({ email });
};

User.create = (user, userSecret) => {
  return client.transaction(trx => {
    trx("user")
      .insert(user)
      .then(() => {
        return trx("user_secret")
          .returning("email")
          .insert(userSecret)
          .then(email => {
            return trx("user")
              .select("*")
              .where({ email: email[0] });
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
};

User.incrementById = (id, props) => {
  return client("user")
    .where({ id })
    .returning(Object.keys(props))
    .increment(props);
};

// const User = client("user");
const UserSecret = function(email, hash) {
  this.email = email;
  this.hash = hash;
};

UserSecret.getByEmail = email => {
  return client("user_secret")
    .select()
    .where({ email });
};

module.exports = { User, UserSecret };
