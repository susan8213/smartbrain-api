var express = require("express");
const serveStatic = require("serve-static");
var router = express.Router();
const ClarifaiService = require("../services/ClarifaiService");

router.post("/face", ClarifaiService.detect);

module.exports = router;
