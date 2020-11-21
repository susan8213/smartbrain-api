var express = require("express");
var router = express.Router();
const UserController = require("../services/UserService");

/* GET users listing. */
router.get("/", UserController.getUserList);
router.get("/:id", UserController.getUser);

router.post("/register", UserController.signUp);
router.post("/signin", UserController.signIn);

router.put("/:id/image", UserController.entry);

module.exports = router;
