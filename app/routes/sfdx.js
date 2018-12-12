const { spawn } = require('child_process');

'use strict';

var express         = require('express');
var router          = express.Router();
var inherits        = require('inherits');
var logger          = require('winston');
var querystring     = require('querystring');
var path            = require('path');
var util            = require('../lib/util');

router.get('/authweblogin', function(req, res) {
  var ls = spawn('sfdx force:auth:web:login',[''], {shell:true, cwd:`C:\\Users\\`});
  ls.stdout.on('data', (data) => {
	console.log(`stdout: ${data}`);
	});
  return res.sendStatus(200);
});


module.exports = router;