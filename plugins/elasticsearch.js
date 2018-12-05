'use strict';

module.exports = function(options) {
  options = options || {};

  var elasticsearch = require('elasticsearch');
  var client = new elasticsearch.Client({
    host: options.host + ":" + options.port,
    httpAuth: ''
  });

    // console.log('ES=>',options);
    return async function(ctx, next) {
    ctx.elasticsearch = client;
    await next();
  }
}
