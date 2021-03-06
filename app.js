var koa = require('koa');
var cors = require('koa-cors');
var app = new koa();
var Router = require('koa-router');

const koajwt = require('koa-jwt');

//jwt 校验token
app.use(koajwt({
    secret:'my_token'
}).unless({
    path: [/\/api\/register/,/\/api\/login/]
}))


//config
var config = require('config');
global.config = config;
app.proxy = true;
app.use(async function(ctx, next) {
    if (config.offline) {
    ctx.status = 503;
    ctx.body = '服务升级中...';
  } else {
    await next()
  }
});

app.use(cors({
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
    maxAge: 100,
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous']
}));  //{credentials: true, origin: config.host}

//body parser
app.use(require('koa-better-body')({
  "jsonLimit": "50mb",
  "formLimit": "50mb"
}));

//library
app.use(require('./plugins/library')());

//redis
//app.use(require('./plugins/redis')(config.get('redis')));

//elasticsearch
//app.use(require('./plugins/elasticsearch')(config.get('elasticsearch')));

//session
app.keys = ['msdfjljknpsfmsmgnlskfsdmlskg'];
var session = require('koa-generic-session');
/*var redisStore = require('koa-redis');

app.use(session({
  key: 'sid',
  store: redisStore({
    host: config.get('redis').host,
    port: config.get('redis').port,
    pass:config.get('redis').password,
    db:config.get('redis').db,
    connectTimeout:config.get('redis').connectTimeout
  })
}));*/

//ejs
var render = require('koa-ejs');
var path = require('path');
render(app, {
  root: path.join(__dirname, 'views'),
  layout: false,
  viewExt: 'html',
  cache: false,
  debug: false
});

//static server
var staticCache = require('koa-static-cache');
app.use(staticCache(__dirname + '/public', {
  maxAge: 365 * 24 * 60 * 60,
  dynamic: true
}));

//authantication && authorization
app.use(require('./plugins/authantication')({
  enabled: false,
  debug: true,
  types: {
    application: {
      keys: {
        '123': '1380989044'
      },
      urls: ['/projects/:id']
    },
    user: {
      secret: 'sdfjksdfjklsdf',
      urls: []
    }
  }
}));

//mongodb
var mongodb_conf = config.get('mongodb');
mongodb_conf['schemas'] = __dirname + '/models';
app.use(require('./plugins/mongoose')(mongodb_conf));

//token
app.use(require('./plugins/token')({
  secret: 'www.mingxiaobang.com'
}));

//validator
app.use(require('./plugins/validator')({

}));

//routers
router = new Router();
app.use(router.routes()).use(router.allowedMethods());
app.use(require('./plugins/intercept')());
function loadActions(dir) {
  var fs = require('fs');
  var path = require('path');
  var files = fs.readdirSync(dir);
  for (var file in files) {
    var p = dir + "/" + files[file];
    var stat = fs.lstatSync(p);
    if (stat.isDirectory() == true) {
      loadActions(p);
    } else {
      if (path.extname(p) == '.js') {
        require(p)(router);
      }
    }
  }
}
loadActions(__dirname + "/actions");

//listen
app.listen(config.get('port'));
console.log("# listening on port " + config.get('port'));