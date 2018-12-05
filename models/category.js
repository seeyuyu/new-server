//分类标签接口
var schema = require('./base/model')({
    id: {type: String, default: ''},       // id
    name:{type: String, default: ''},
    images: {type: String, default: ''},
    created: {type: String, default: ''},  //创建日期
    is_stick :{type: Number, default: 0},  //是否置顶
});

schema.index({created: 1})

module.exports = schema
