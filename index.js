/**
 * Module dependencies
 */

var grappler = require('grappler');
var envs = require('envs');
var github = require('grappler-hook-github');
var heroku = require('grappler-deploy-heroku');
var stdout = require('grappler-logger-stdout');
var config = require('grappler-task-config');

/**
 * Create a poe-deploy app
 */

module.exports = function(opts) {
  opts = opts || {};
  opts.github = opts.github || {};
  opts.heroku = opts.heroku || {};

  var app = grappler();

  var GITHUB_TOKEN = envs('GITHUB_TOKEN', opts.github.token);

  app.on('task', function(task) {
    task.use(config({
      githubToken: GITHUB_TOKEN
    }));
  });

  app.plugin(github({
    secret: envs('GITHUB_SECRET', opts.github.secret),
    token: GITHUB_TOKEN
  }));

  app.plugin(heroku({
    prefix: envs('HEROKU_PREFIX', opts.heroku.prefix),
    token: envs('HEROKU_TOKEN', opts.heroku.token),
    env: {
      GITHUB_USERNAME: GITHUB_TOKEN,
      GITHUB_PASSWORD: 'x-oauth-basic',
      GITHUB_AUTH_TOKEN: GITHUB_TOKEN
    }
  }));

  app.plugin(stdout());

  return app;
};
