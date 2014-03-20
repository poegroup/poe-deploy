poe-deploy
==========

A simple deploy application with GitHub and Heroku integration

Usage
-----

```js
// app.js
var deploy = require('poe-deploy');

var app = module.exports = deploy();
```

The exported app can now be run with [startup](https://github.com/camshaft/startup.git).

```sh
$ startup start -p app.js
```

Environment Variables
---------------------

`GITHUB_TOKEN` - GitHub access token for cloning the repo
`GITHUB_SECRET` - A secret token shared between GitHub and the `poe-deploy` instance to verify webhooks
`HEROKU_TOKEN` - Heroku access token for deploying and creating a apps
`HEROKU_PREFIX` - A prefix to use when deploying to heroku, i.e. `poe` would result in `poe-myapp-prod`
