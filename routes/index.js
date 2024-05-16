const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/chat', function (req, res, next) {
  res.render('chat');
});

router.get('/detail', function (req, res, next) {
  res.render('detail');
});

module.exports = router;
