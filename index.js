/**
 * Module dependencies
 */

var grappler = require('grappler');
var envs = require('envs');
var github = require('grappler-hook-github');
var heroku = require('grappler-deploy-heroku');
var stdout = require('grappler-logger-stdout');

/**
 * Create a poe-deploy app
 */

module.exports = function(opts) {
  opts = opts || {};
  opts.github = opts.github || {};
  opts.heroku = opts.heroku || {};

  var app = grappler();

  app.plugin(github({
    secret: envs('GITHUB_SECRET', opts.github.secret),
    token: envs('GITHUB_TOKEN', opts.github.token)
  }));

  app.plugin(heroku({
    prefix: envs('HEROKU_PREFIX', opts.heroku.prefix),
    token: envs('HEROKU_TOKEN', opts.heroku.token),
    env: {
      GITHUB_USERNAME: envs('GITHUB_SECRET', opts.github.secret),
      GITHUB_PASSWORD: 'x-oauth-basic',
      GITHUB_AUTH_TOKEN: envs('GITHUB_SECRET', opts.github.secret)
    }
  }));

  app.plugin(stdout());

  return app;
};
