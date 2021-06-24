const express = require('express');
const router = express.Router();


const mainController = require('../controllers/mainController');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('hello world🌈');
  });
  
  module.exports = router;