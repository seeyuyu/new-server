var schema = require('./base/model')({
    open_id: {type: String, default: ''}, // 微信id
    discuss_id :{type: String, default: ''},
    created: {type: String, default: ''}//创建日期
});

schema.index({created: 1})

module.exports = schema
