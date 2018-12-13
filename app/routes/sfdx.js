const { spawn } = require('child_process');
const fs = require('fs');

'use strict';

var express = require('express');
var router = express.Router();
var inherits = require('inherits');
var logger = require('winston');
var querystring = require('querystring');
var path = require('path');
var util = require('../lib/util');

router.post('/authweblogin', function (req, res) {
  var ls = spawn('sfdx force:auth:web:login -s', [''], { shell: true });
  ls.stdout.on('data', (data) => {
    console.log(`Auth: stdout: ${data}`);
  });
  return res.sendStatus(200);
});

router.post('/deployclass', function (req, res) {
  var deploy = spawn(`sfdx force:source:deploy -m ApexClass:${req.body.file}`, [], {
    shell: true,
    cwd: `${req.body.cwd}`
  });

  deploy.stdout.on('data', (data) => {
    console.log(`Deploy: stdout: ${data}`);
  });

  deploy.stderr.on('data', (data) => {
    console.log(`Deploy: stderr: ${data}`);
  });

  deploy.on('close', (code) => {
    console.log(`Deploy: child process exited with code ${code}`);
  });
  return res.sendStatus(200);
});

router.post('/executeanonymous', function (req, res) {
  const tmpPath = path.join('.', 'tmp.cls');
  fs.writeFileSync(path.join(tmpPath), req.body.code);

  var execAnon = spawn(`sfdx force:apex:execute -f ${tmpPath}`, [''], { shell: true });

  execAnon.stdout.on('data', (data) => {
    console.log(`execAnon: stdout: ${data}`);
  });

  execAnon.stderr.on('data', (data) => {
    console.log(`execAnon: stderr: ${data}`);
  });

  execAnon.on('close', (code) => {
    fs.unlinkSync(tmpPath);
    console.log(`execAnon: child process exited with code ${code}`);
  });
  return res.sendStatus(200);
});


module.exports = router;