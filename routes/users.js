var express = require("express");
const serveStatic = require("serve-static");
var router = express.Router();
const { UserService, UserSerializer } = require("../services/UserService");

/* GET users listing. */
router.get("/", function(req, res, next) {
  const users = new UserService().getUserList();
  res.send(UserSerializer(users, true));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const user = new UserService().getUserByID(id);
  if (user) {
    res.send(UserSerializer(user));
  } else {
    res.status(404).send();
  }
});

router.post("/register", (req, res) => {
  const user = new UserService().signUp(req.body);
  if (user) {
    res.send(UserSerializer(user));
  } else {
    res.status(400).send("Duplicate user.");
  }
});

router.post("/signin", (req, res) => {
  const user = new UserService().signIn(req.body);
  if (user) {
    res.send(UserSerializer(user));
  } else {
    res.status(400).send("Email or Password is incorrect.");
  }
});

router.put("/:id/image", (req, res) => {
  const { id } = req.params;
  const user = new UserService().entry(id);
  if (user) {
    res.send(UserSerializer(user));
  } else {
    res.status(404).send();
  }
});

module.exports = router;
