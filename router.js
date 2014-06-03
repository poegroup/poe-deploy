/**
 * Module dependencies
 */

var Heroku = require('heroku-client');

module.exports = function(opts) {
  opts = opts || {};
  var client = new Heroku({token: opts.token});
  var router = opts.router;

  function route(task) {
    function error(err) {
      console.log(err.stack || err);
      task.emit('error', err);
    }

    return function() {
      // TODO handle race conditions
      var config = client.apps(router).configVars();
      config.info(function(err, ENV) {
        if (err) error(err);

        var name = task.info.name;
        var NAME = format(name);
        var branch = task.info.branch;
        var BRANCH = format(branch);
        var id = +(new Date);

        ENV['APPS'] = add(name, ENV['APPS']);

        ENV[NAME + '_MOUNT'] = task.info.mount || '/' + name;
        ENV[NAME + '_BRANCHES'] = add(branch, ENV[NAME + '_BRANCHES']);
        ENV[NAME + '_BRANCH_' + BRANCH] = id + ':1';
        ENV[NAME + '_URL_' + id] = 'http://' + task.info.deployment;

        config.update(ENV, function(err) {
          if (err) error(err);
          garbageCollect(client, ENV, name, NAME, branch, BRANCH);
        });
      });
    };
  }

  return function(app) {
    app.on('task', function(task) {
      task.on('success', route(task));
    });
  };
};

function format(name) {
  return name
    .replace(/-/g, '_')
    .toUpperCase();
}

function add(item, list) {
  if (!list) return item;
  var arr = list.split(',');
  if (~arr.indexOf(item)) return list;
  return list + ',' + item;
}

function garbageCollect(ENV, name, NAME, branch, BRANCH, fn) {
  // TODO
}
