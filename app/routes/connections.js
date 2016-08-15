/**
 * @file Controller for the deploy UI
 * @author Joseph Ferraro <@joeferraro>
 */

'use strict';

var express         = require('express');
var router          = express.Router();
var logger          = require('winston');
var requestStore    = require('../lib/request-store');
var Deploy          = require('../lib/services/deploy');
var querystring     = require('querystring');

router.get('/new', function(req, res) {
  var client = req.app.get('client');
  client.executeCommand({
    project: req.project,
    name: 'get-connections',
    editor: req.editor
  })
  .then(function(response) {
    res.render('connections/index.html', {
      connections: response,
      title: 'Org Connections'
    });
  })
  .catch(function(err) {
    logger.error(err);
    res.status(500).send({ error: err.message });
  });
});

router.get('/', function(req, res) {
  var client = req.app.get('client');
  client.executeCommand({
    project: req.project,
    name: 'get-connections',
    editor: req.editor
  })
  .then(function(response) {
    res.send(response);
  })
  .catch(function(err) {
    res.status(500).send({ error: err.message });
  });
});

router.post('/', function(req, res) {
  var client = req.app.get('client');
  client.executeCommand({
    project: req.project,
    name: 'new-connection',
    body: req.body,
    editor: req.editor
  })
  .then(function(response) {
    res.send(response);
  })
  .catch(function(err) {
    res.status(500).send({ error: err.message });
  });
});

router.post('/auth', function(req, res) {
  var params = {
    title: 'New Org Connection',
    callback: '/app/connections/auth/finish',
    param1: req.body.name,
    pid: req.body.pid
  };
  res.redirect('/app/auth/new?'+querystring.stringify(params));
});

router.get('/auth/finish', function(req, res) {
  var client = req.app.get('client');
  logger.debug('finishing auth in org connections: ', req.query);
  var state = JSON.parse(req.query.state);
  logger.debug('state!', state);
  var pid = state.pid;
  var project = client.getProjectById(pid);
  client.executeCommand({
    project: project,
    name: 'new-connection',
    body: {
      name: state.param1,
      accessToken: req.query.access_token,
      instanceUrl: req.query.instance_url,
      refreshToken: req.query.refresh_token
    }
  })
  .then(function(response) {
    res.redirect('/app/connections/new?pid='+pid);
  })
  .catch(function(err) {
    res.status(500).send({ error: err.message });
  });
});

router.delete('/:id', function(req, res) {
  var client = req.app.get('client');
  client.executeCommand({
    project: req.project,
    name: 'delete-connection',
    body: req.body,
    editor: req.editor
  })
  .then(function(response) {
    res.send(response);
  })
  .catch(function(err) {
    res.status(500).send({ error: err.message });
  });
});


module.exports = router;