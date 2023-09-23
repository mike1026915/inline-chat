const express = require('express');
const router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'out', 'index.html'));
});

router.get('/chatRoom', function(req, res, next) {
  res.redirect('/');
});

module.exports = router;
