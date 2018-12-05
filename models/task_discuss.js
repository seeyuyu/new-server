var schema = require('./base/model')({
    open_id: {type: String, default: ''}, // 微信id
    title_id:{type: String, default: ''},
    name :{type: String, default: ''},
    discuss :{type: String, default: ''},
    created: {type: String, default: ''},//创建日期
    date: {type: Number, default:Date.now}
});

schema.index({created: 1})

module.exports = schema
