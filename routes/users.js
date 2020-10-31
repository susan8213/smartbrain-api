var express = require("express");
const serveStatic = require("serve-static");
var router = express.Router();
const UserController = require("../services/UserService");

/* GET users listing. */
router.get("/", UserController.getUserList);
router.get("/:id", UserController.getUser);

router.post("/register", UserController.signUp);
router.post("/signin", UserController.signIn);

router.put("/:id/image", UserController.entry);

module.exports = router;
