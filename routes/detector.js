var express = require("express");
var router = express.Router();
const ClarifaiService = require("../services/ClarifaiService");

router.post("/face", ClarifaiService.detect);

module.exports = router;
